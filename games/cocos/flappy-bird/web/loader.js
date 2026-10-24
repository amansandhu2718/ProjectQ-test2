/* This loader runs on the game host. It does not execute game code until every file is verified. */
(() => {
  const publicPem = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyFbWY9ue0MAQfRdqm0qS\nzrecs0wErUNa0oVpPiTMyJseEB/xmvWNeiczz8fXZNWcUu6gnkxA3JkyVZBJC4sm\n1UT5xvRGc/14hFLzX8eyYU22PaN+ZPVAbPyfvJzw5UlbS5PAb8Ww/hlbGY16kcUI\ny6g2QuoURrxsj4N2694D8vGCZ0s2zsvPyF/g5xPB/nnKj2TODcm7nFv23yKP/f1m\n0+5Oy2uLiJF8ExUjJxEX55JTxcBuF+L54rpfaCx8xIDptuleeqNfrhrpgkzajhUr\nevfIkN7DqSdfKxOtOH3SBycBG5esbWRTUzFx2JIj68TB74Bbs6wdJLrNm3ZJmYG+\nnwIDAQAB\n-----END PUBLIC KEY-----\n";
  const runtime = "cocos-2.4.7-homerun-1";
  const root = new URL("../", location.href);
  const manifestUrl = new URL("manifest.web.json", root).href;
  const params = new URL(location.href).searchParams;
  const parentOrigin = params.get("hostOrigin");
  const status = document.getElementById("status");
  const retry = document.getElementById("retry");
  if (
    !parentOrigin ||
    new URL(parentOrigin).origin !== parentOrigin ||
    !/^https?:$/.test(new URL(parentOrigin).protocol)
  ) {
    status.textContent = "Open this game from HomeRun.";
    return;
  }
  const channel = "homerun:cocos";
  const notify = (message) => parent.postMessage({ channel, message }, parentOrigin);
  const bytes = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const hex = (b) => Array.from(new Uint8Array(b), (v) => v.toString(16).padStart(2, "0")).join("");
  const cacheName = "homerun-cocos-flappy-bird-web-1";
  const validatePath = (p) =>
    typeof p === "string" &&
    /^[A-Za-z0-9_./-]+$/.test(p) &&
    p.split("/").every((x) => x && x !== "." && x !== "..");
  async function verify(text) {
    if (text.length > 262144) throw Error("Game manifest is too large");
    const envelope = JSON.parse(text);
    const key = await crypto.subtle.importKey(
      "spki",
      bytes(publicPem.replace(/-----[^-]+-----|\s/g, "")),
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    );
    if (
      !(await crypto.subtle.verify(
        "RSASSA-PKCS1-v1_5",
        key,
        bytes(envelope.signature),
        new TextEncoder().encode(envelope.manifest),
      ))
    )
      throw Error("Game signature is invalid");
    const m = JSON.parse(envelope.manifest);
    if (
      m.schema !== 1 ||
      m.id !== "flappy-bird" ||
      m.platform !== "web" ||
      m.runtime !== runtime ||
      !/^\d+\.\d+\.\d+$/.test(m.version) ||
      !new RegExp("^web/" + m.version.replaceAll(".", "\\.") + "/[a-f0-9]{32}/$").test(m.prefix) ||
      m.entry !== "index.html" ||
      !Array.isArray(m.files) ||
      !m.files.length ||
      m.files.length > 512
    )
      throw Error("Game is incompatible with this runtime");
    let total = 0;
    const paths = new Set();
    for (const f of m.files) {
      if (
        !validatePath(f.path) ||
        paths.has(f.path) ||
        !Number.isSafeInteger(f.size) ||
        f.size < 0 ||
        !/^[a-f0-9]{64}$/.test(f.sha256) ||
        /\.(so|dex|jar|aar|dylib|a|exe)$/i.test(f.path)
      )
        throw Error("Invalid game file");
      paths.add(f.path);
      total += f.size;
    }
    if (total > 67108864 || !paths.has(m.entry)) throw Error("Incomplete game package");
    return m;
  }
  async function run() {
    retry.hidden = true;
    status.textContent = "Downloading game…";
    notify({ type: "download:progress", received: 0, total: 0 });
    if (!("serviceWorker" in navigator) || !crypto.subtle)
      throw Error("A secure browser with service workers is required");
    const registration = await navigator.serviceWorker.register("sw.js", { scope: "./" });
    await navigator.serviceWorker.ready;
    const cache = await caches.open(cacheName);
    let text;
    const cached = await cache.match(manifestUrl);
    if (cached && params.get("refresh") !== "1") text = await cached.text();
    else {
      const response = await fetch(manifestUrl, { cache: "no-store" });
      if (!response.ok)
        throw Error("Game files are unavailable. Publish the Cocos game package, then retry.");
      text = await response.text();
    }
    const m = await verify(text);
    const total = m.files.reduce((s, f) => s + f.size, 0);
    let received = 0;
    for (const f of m.files) {
      const url = new URL(m.prefix + f.path, root).href;
      let response = await cache.match(url);
      let data = response && (await response.arrayBuffer());
      if (
        data &&
        (data.byteLength !== f.size ||
          hex(await crypto.subtle.digest("SHA-256", data)) !== f.sha256)
      )
        data = null;
      if (!data) {
        response = await fetch(url, { cache: "no-store", headers: { "X-HomeRun-Download": "1" } });
        if (!response.ok) throw Error("A game file could not be downloaded");
        const reader = response.body.getReader();
        const chunks = [];
        let size = 0;
        while (true) {
          const next = await reader.read();
          if (next.done) break;
          size += next.value.length;
          if (size > f.size) {
            await reader.cancel();
            throw Error("Game file exceeds declared size");
          }
          chunks.push(next.value);
          notify({ type: "download:progress", received: received + size, total });
        }
        data = new Uint8Array(size);
        let offset = 0;
        for (const c of chunks) {
          data.set(c, offset);
          offset += c.length;
        }
        if (size !== f.size || hex(await crypto.subtle.digest("SHA-256", data)) !== f.sha256)
          throw Error("Game file integrity check failed");
        await cache.put(
          url,
          new Response(data, {
            headers: {
              "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
            },
          }),
        );
      }
      received += f.size;
      notify({ type: "download:progress", received, total });
    }
    await cache.put(manifestUrl, new Response(text));
    if (!registration.active) throw Error("Game cache worker did not activate");
    notify({ type: "download:complete" });
    const entry = new URL(m.prefix + m.entry, root);
    entry.searchParams.set("hostOrigin", parentOrigin);
    location.replace(entry.href);
  }
  const launch = () =>
    run().catch((error) => {
      status.textContent = error.message;
      retry.hidden = false;
      notify({ type: "download:error", message: error.message });
    });
  retry.onclick = launch;
  launch();
})();
