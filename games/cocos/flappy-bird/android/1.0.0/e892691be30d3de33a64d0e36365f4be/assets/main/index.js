window.__require = function t(e, i, s) {
function o(h, a) {
if (!i[h]) {
if (!e[h]) {
var n = h.split("/");
n = n[n.length - 1];
if (!e[n]) {
var c = "function" == typeof __require && __require;
if (!a && c) return c(n, !0);
if (r) return r(n, !0);
throw new Error("Cannot find module '" + h + "'");
}
h = n;
}
var l = i[h] = {
exports: {}
};
e[h][0].call(l.exports, function(t) {
return o(e[h][1][t] || t);
}, l, l.exports, t, e, i, s);
}
return i[h].exports;
}
for (var r = "function" == typeof __require && __require, h = 0; h < s.length; h++) o(s[h]);
return o;
}({
FlappyBird: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "59012D0GIFPmZAl9svR6lV3", "FlappyBird");
var s, o = this && this.__extends || (s = function(t, e) {
return (s = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
})(t, e);
}, function(t, e) {
s(t, e);
function i() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype, new i());
}), r = this && this.__decorate || function(t, e, i, s) {
var o, r = arguments.length, h = r < 3 ? e : null === s ? s = Object.getOwnPropertyDescriptor(e, i) : s;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) h = Reflect.decorate(t, e, i, s); else for (var a = t.length - 1; a >= 0; a--) (o = t[a]) && (h = (r < 3 ? o(h) : r > 3 ? o(e, i, h) : o(e, i)) || h);
return r > 3 && h && Object.defineProperty(e, i, h), h;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
var h = t("./GameModel"), a = t("./HostBridge"), n = cc._decorator, c = n.ccclass, l = n.property, p = "#244B4D", d = "#FFF9E9", u = {
yellow: {
tail: "#E8AF42",
body: "#FFD563",
belly: "#FFE8A1",
wing: "#F6B84A",
highlight: "#FFDE7A"
},
red: {
tail: "#BC3434",
body: "#F05252",
belly: "#FFA3A3",
wing: "#CF3F3F",
highlight: "#FF8585"
},
green: {
tail: "#248848",
body: "#50BF6B",
belly: "#B7E8A4",
wing: "#349F53",
highlight: "#89DB88"
}
}, y = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.keyboardEnabled = !0;
e.helpOpen = !1;
e.viewportHeight = 800;
e.layoutBusy = !1;
e.safeAreaProbe = null;
e.hostPauseHandler = function() {
return e.onHide();
};
e.disposeBridge = null;
e.birdColor = "yellow";
e.hostConfigured = !1;
e.exitOpen = !1;
e.exitWasPaused = !1;
e.flashTime = 0;
e.overTime = 0;
e.lastScore = 0;
e.savedBest = 0;
e.previousState = "ready";
e.previousPause = !1;
e.heldKeys = {};
return e;
}
e.prototype.onLoad = function() {
try {
this.initializeGame();
} catch (t) {
this.enabled = !1;
cc.error("Flappy Bird initialization failed:", t);
throw t;
}
};
e.prototype.initializeGame = function() {
var t = this, e = 0;
try {
e = Number(cc.sys.localStorage.getItem("flappy-bird.best.v1")) || 0;
} catch (t) {}
this.model = new h.default(e);
this.savedBest = this.model.best;
if (cc.sys.isBrowser) {
cc.view.enableAutoFullScreen(!1);
document.body.style.overscrollBehavior = "none";
var i = document.querySelector('meta[name="viewport"]');
i && i.getAttribute("content").indexOf("viewport-fit") < 0 && i.setAttribute("content", i.getAttribute("content") + ",viewport-fit=cover");
this.safeAreaProbe = document.createElement("div");
this.safeAreaProbe.style.cssText = "position:fixed;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top);";
document.body.appendChild(this.safeAreaProbe);
window.addEventListener("flappy-host-pause", this.hostPauseHandler);
}
this.world = this.makeNode("Game World", this.node, -240, -400);
this.world.setContentSize(480, 800);
this.world.setAnchorPoint(0, 0);
this.world.addComponent(cc.Mask).type = cc.Mask.Type.RECT;
this.scenery = this.graphics("Sky and scenery");
this.obstacles = this.graphics("Pipes");
this.ground = this.graphics("Ground");
this.createBird();
this.createUI();
cc.view.on("canvas-resize", this.layoutViewport, this);
this.layoutViewport();
this.world.on(cc.Node.EventType.TOUCH_START, this.onTouch, this);
if (this.keyboardEnabled) {
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
}
cc.game.on(cc.game.EVENT_HIDE, this.onHide, this);
this.syncUI();
this.drawWorld();
this.disposeBridge = a.installHostBridge(function(e) {
return t.onHostMessage(e);
}, function() {
return t.model.best;
});
};
e.prototype.onDestroy = function() {
cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
cc.game.off(cc.game.EVENT_HIDE, this.onHide, this);
cc.view.off("canvas-resize", this.layoutViewport, this);
this.disposeBridge && this.disposeBridge();
if (cc.sys.isBrowser) {
window.removeEventListener("flappy-host-pause", this.hostPauseHandler);
this.safeAreaProbe && this.safeAreaProbe.parentNode && this.safeAreaProbe.parentNode.removeChild(this.safeAreaProbe);
}
};
e.prototype.update = function(t) {
this.model.update(t);
"over" === this.model.state && (this.overTime += Math.min(t, .1));
if (this.model.state !== this.previousState || this.model.paused !== this.previousPause) {
"playing" === this.previousState && "playing" !== this.model.state && (this.flashTime = .18);
this.previousState = this.model.state;
this.previousPause = this.model.paused;
this.syncUI();
}
if (this.model.score !== this.lastScore) {
this.lastScore = this.model.score;
this.scoreLabel.string = String(this.model.score);
cc.Tween.stopAllByTarget(this.scoreLabel.node);
this.scoreLabel.node.scale = 1.18;
cc.tween(this.scoreLabel.node).to(.16, {
scale: 1
}).start();
this.bestLabel.string = "BEST  " + this.model.best;
}
if (this.model.best !== this.savedBest) {
this.savedBest = this.model.best;
try {
cc.sys.localStorage.setItem("flappy-bird.best.v1", String(this.savedBest));
} catch (t) {}
this.reportHighScore();
}
this.flashTime = Math.max(0, this.flashTime - t);
this.flash.opacity = Math.round(this.flashTime / .18 * 155);
this.drawWorld();
};
e.prototype.onTouch = function() {
"playing" !== this.model.state || this.helpOpen || this.exitOpen || this.act();
};
e.prototype.act = function() {
this.model.paused || this.helpOpen || this.exitOpen || ("over" !== this.model.state ? this.model.flap() && this.syncUI() : this.overTime > .35 && this.startGame());
};
e.prototype.restart = function() {
this.model.reset();
this.overTime = 0;
this.lastScore = 0;
this.previousState = "ready";
this.previousPause = !1;
this.flashTime = 0;
this.helpOpen = !1;
cc.Tween.stopAllByTarget(this.scoreLabel.node);
this.scoreLabel.node.scale = 1;
this.scoreLabel.string = "0";
this.syncUI();
};
e.prototype.startGame = function() {
this.restart();
this.model.flap();
this.syncUI();
};
e.prototype.onKeyDown = function(t) {
if (t.keyCode === cc.macro.KEY.escape && this.hostConfigured) this.onSystemBack(); else if (!this.exitOpen && !this.heldKeys[t.keyCode]) {
this.heldKeys[t.keyCode] = !0;
if (t.keyCode === cc.macro.KEY.space || t.keyCode === cc.macro.KEY.up || t.keyCode === cc.macro.KEY.w) this.act(); else if (t.keyCode === cc.macro.KEY.p || t.keyCode === cc.macro.KEY.escape) {
if (this.helpOpen) {
this.helpOpen = !1;
this.syncUI();
return;
}
this.model.togglePause();
this.syncUI();
} else t.keyCode === cc.macro.KEY.r && "over" === this.model.state && this.startGame();
}
};
e.prototype.onKeyUp = function(t) {
delete this.heldKeys[t.keyCode];
};
e.prototype.onHide = function() {
this.heldKeys = {};
if ("playing" === this.model.state) {
this.model.paused = !0;
this.syncUI();
}
};
e.prototype.syncUI = function() {
this.readyUI.active = "ready" === this.model.state;
this.helpUI.active = this.helpOpen;
this.overUI.active = "over" === this.model.state;
this.pauseUI.active = this.model.paused && !this.exitOpen;
this.exitUI.active = this.exitOpen;
this.exitTrigger.active = this.hostConfigured && !this.exitOpen;
this.hud.active = "playing" === this.model.state || "dying" === this.model.state;
this.bestLabel.string = "BEST  " + this.model.best;
this.readyUI.getChildByName("Ready best").getComponent(cc.Label).string = "BEST SCORE  " + this.model.best;
this.resultScore.string = String(this.model.score);
this.resultBest.string = String(this.model.best);
this.resultHeading.string = this.model.newBest ? "A NEW PERSONAL BEST!" : "EVERY FLIGHT GETS BETTER";
this.medalLabel.string = this.model.score >= 20 ? "GOLD" : this.model.score >= 10 ? "SILVER" : this.model.score >= 5 ? "BRONZE" : "ROOKIE";
};
e.prototype.createUI = function() {
var t = this;
this.hud = this.makeNode("Playing HUD", this.world);
this.scoreLabel = this.label(this.hud, "Score", "0", 240, 704, 68, d, !0, 3);
this.bestLabel = this.label(this.hud, "Best score", "BEST  0", 380, 755, 16, p, !0);
var e = this.button(this.hud, "Pause", "", 60, 730, 80, 80, d, function() {
t.model.togglePause();
t.syncUI();
}).addComponent(cc.Graphics);
this.rect(e, -10, -12, 6, 24, p);
this.rect(e, 4, -12, 6, 24, p);
this.readyUI = this.makeNode("Home menu", this.world);
this.label(this.readyUI, "Eyebrow", "TINY WINGS. ENDLESS POSSIBILITIES.", 240, 740, 14, p, !0);
this.label(this.readyUI, "Title shadow", "FLAPPY BIRD", 242, 633, 56, "#599F97", !0, 0);
this.label(this.readyUI, "Title", "FLAPPY BIRD", 240, 638, 56, d, !0, 3);
this.label(this.readyUI, "Subtitle", "Find your rhythm. Chase the sky.", 240, 582, 19, p);
var i = this.makeNode("Best badge", this.readyUI).addComponent(cc.Graphics);
this.roundRect(i, 118, 508, 244, 44, 22, "#D9EFE0");
this.label(this.readyUI, "Ready best", "BEST SCORE  " + this.model.best, 240, 530, 18, p, !0);
this.button(this.readyUI, "Play", "PLAY", 240, 322, 300, 80, "#F8CE65", function() {
return t.startGame();
});
this.button(this.readyUI, "How to play", "HOW TO PLAY", 240, 218, 300, 80, d, function() {
t.helpOpen = !0;
t.syncUI();
});
this.label(this.readyUI, "Instruction", "One tap. One flap. A new adventure.", 240, 142, 17, p);
this.overUI = this.makeNode("Game over", this.world);
this.scrim(this.overUI);
var s = this.makeNode("Scorecard", this.overUI, 240, 410), o = s.addComponent(cc.Graphics);
this.roundRect(o, -195, -250, 390, 500, 22, "#2F6464");
this.roundRect(o, -195, -242, 390, 500, 22, d);
this.label(s, "Game over title", "NICE FLIGHT!", 0, 203, 34, p, !0);
this.resultHeading = this.label(s, "Result message", "", 0, 160, 14, "#507773", !0);
this.label(s, "Score caption", "SCORE", -80, 108, 17, "#507773", !0);
this.label(s, "Best caption", "BEST", 80, 108, 17, "#507773", !0);
this.resultScore = this.label(s, "Final score", "0", -80, 58, 52, p, !0);
this.resultBest = this.label(s, "Final best", "0", 80, 58, 52, p, !0);
this.roundRect(o, -66, -11, 132, 32, 16, "#F8DC8A");
this.medalLabel = this.label(s, "Medal", "ROOKIE", 0, 5, 15, p, !0);
this.button(s, "Restart", "PLAY AGAIN", 0, -80, 310, 80, "#F8CE65", function() {
t.overTime > .35 && t.startGame();
});
this.button(s, "Home", "MAIN MENU", 0, -184, 310, 80, "#D9EFE0", function() {
return t.restart();
});
this.pauseUI = this.makeNode("Paused", this.world);
this.scrim(this.pauseUI);
this.label(this.pauseUI, "Pause title", "PAUSED", 240, 620, 42, d, !0);
this.label(this.pauseUI, "Pause subtitle", "Your little bird will wait.", 240, 568, 20, d);
this.button(this.pauseUI, "Resume", "RESUME", 240, 470, 310, 80, "#F8CE65", function() {
t.model.togglePause();
t.syncUI();
});
this.button(this.pauseUI, "Restart run", "RESTART", 240, 366, 310, 80, d, function() {
return t.startGame();
});
this.button(this.pauseUI, "Home", "MAIN MENU", 240, 262, 310, 80, "#D9EFE0", function() {
return t.restart();
});
this.blockTouches(this.pauseUI);
this.helpUI = this.makeNode("How to play", this.world);
this.scrim(this.helpUI);
var r = this.makeNode("Instructions card", this.helpUI, 240, 420).addComponent(cc.Graphics);
this.roundRect(r, -200, -248, 400, 496, 22, d);
this.label(this.helpUI, "Help title", "HOW TO PLAY", 240, 610, 32, p, !0);
[ [ "01", "TAP TO FLAP", "Tap the screen to keep flying." ], [ "02", "FIND THE GAP", "Avoid the pipes and the ground." ], [ "03", "BEAT YOUR BEST", "Each cleared pipe earns a point." ] ].forEach(function(e, i) {
var s = 536 - 100 * i;
t.label(t.helpUI, "Step " + i, e[0], 96, s, 22, "#4E9F73", !0);
t.label(t.helpUI, "Step title " + i, e[1], 264, s + 6, 21, p, !0);
t.label(t.helpUI, "Step detail " + i, e[2], 240, s - 29, 17, "#507773");
});
this.button(this.helpUI, "Back", "GOT IT", 240, 232, 310, 80, "#F8CE65", function() {
t.helpOpen = !1;
t.syncUI();
});
this.blockTouches(this.helpUI);
this.label(this.world, "Game version", "v" + a.GAME_VERSION, 76, 48, 14, p, !0);
this.exitTrigger = this.button(this.world, "Exit game control", "EXIT", 400, 48, 120, 64, d, function() {
return t.showExitPrompt();
});
this.exitUI = this.makeNode("Host exit prompt", this.world);
this.scrim(this.exitUI);
this.label(this.exitUI, "Exit heading", "EXIT GAME?", 240, 550, 36, d, !0);
this.button(this.exitUI, "Confirm exit", "EXIT GAME", 240, 440, 310, 80, "#F8CE65", function() {
t.exitGame();
});
this.button(this.exitUI, "Cancel exit", "KEEP PLAYING", 240, 336, 310, 80, d, function() {
t.exitOpen = !1;
t.model.paused = t.exitWasPaused;
t.syncUI();
});
this.blockTouches(this.exitUI);
this.flash = this.makeNode("Impact flash", this.world);
var h = this.flash.addComponent(cc.Graphics);
this.rect(h, 0, 0, 480, 800, "#FFFFFF");
this.flash.opacity = 0;
};
e.prototype.createBird = function() {
this.bird = this.makeNode("Bird", this.world, h.WORLD.birdX, 420);
this.bird.addComponent(cc.Graphics);
this.wing = this.makeNode("Wing", this.bird, -9, -4);
this.wing.addComponent(cc.Graphics);
this.drawBird();
};
e.prototype.drawBird = function() {
var t = u[this.birdColor], e = this.bird.getComponent(cc.Graphics);
e.clear();
this.polygon(e, [ [ -18, 0 ], [ -34, 11 ], [ -29, -6 ], [ -16, -9 ] ], t.tail, p);
this.ellipse(e, 0, 0, 23, 20, t.body, p);
this.ellipse(e, 4, -7, 16, 10, t.belly);
this.ellipse(e, 10, 7, 9, 11, d, p);
this.ellipse(e, 13, 7, 3, 5, p);
this.polygon(e, [ [ 18, 0 ], [ 34, -2 ], [ 32, -9 ], [ 17, -8 ] ], "#ED8B4C", p);
var i = this.wing.getComponent(cc.Graphics);
i.clear();
this.ellipse(i, -3, 0, 13, 8, t.wing, p);
this.ellipse(i, -5, 2, 7, 3, t.highlight);
};
e.prototype.onHostMessage = function(t) {
var e = a.parseHostCommand(t);
if (e) if ("app:configure" === e.type) {
this.model.best = Math.max(this.model.best, e.highScore);
this.birdColor = e.birdColor;
this.hostConfigured = !0;
this.drawBird();
this.syncUI();
a.sendToHost({
type: "game:configured",
requestId: e.requestId,
birdColor: this.birdColor,
fullScreen: e.fullScreen,
highScore: this.model.best
});
} else "app:back" === e.type ? this.onSystemBack() : "app:pause" === e.type && this.onHide();
};
e.prototype.onSystemBack = function() {
if (this.exitOpen) {
this.exitOpen = !1;
this.model.paused = this.exitWasPaused;
this.syncUI();
} else if (this.helpOpen) {
this.helpOpen = !1;
this.syncUI();
} else if ("ready" !== this.model.state) {
this.reportHighScore();
this.restart();
} else this.exitGame();
};
e.prototype.exitGame = function() {
this.onHide();
this.reportHighScore();
a.sendToHost({
type: "game:exit"
});
};
e.prototype.showExitPrompt = function() {
if (!this.exitOpen) {
this.exitWasPaused = this.model.paused;
this.onHide();
this.exitOpen = !0;
this.syncUI();
}
};
e.prototype.reportHighScore = function() {
a.sendToHost({
type: "game:high-score",
highScore: this.model.best
});
};
e.prototype.drawWorld = function() {
this.drawScenery();
var t = this.obstacles;
t.clear();
for (var e = 0, i = this.model.pipes; e < i.length; e++) {
var s = i[e], o = s.gapY - s.gap / 2, r = s.gapY + s.gap / 2;
this.drawPipe(t, s.x, h.WORLD.ground, o - h.WORLD.ground, !1);
this.drawPipe(t, s.x, r, this.viewportHeight - r, !0);
}
this.drawGround();
if ("ready" === this.model.state) {
var a = Math.min(1, this.viewportHeight / 800);
this.bird.setPosition(240, this.viewportHeight / 2 + (20 + 9 * Math.sin(3.5 * this.model.elapsed)) * a);
this.bird.scale = a;
} else {
this.bird.setPosition(h.WORLD.birdX, this.model.birdY);
this.bird.scale = 1;
}
var n = "ready" === this.model.state ? 5 * Math.sin(3.5 * this.model.elapsed) - 5 : Math.max(-80, Math.min(25, .12 * this.model.velocity));
this.bird.angle = n;
this.wing.angle = "over" === this.model.state ? 0 : 28 * Math.sin(22 * this.model.elapsed);
};
e.prototype.drawScenery = function() {
var t = this.scenery;
t.clear();
this.rect(t, 0, 0, 480, this.viewportHeight, "#A8DCD2");
this.rect(t, 0, .66 * this.viewportHeight, 480, .34 * this.viewportHeight, "#B4E3D9");
this.ellipse(t, 393, this.viewportHeight - 133, 39, 39, "#E0F0D9");
this.ellipse(t, 393, this.viewportHeight - 133, 27, 27, "#FFF1BF");
for (var e = this.model.distance, i = 0; i < 4; i++) {
var s = ((175 * i + 45 - .12 * e) % 700 + 700) % 700 - 100, o = 490 + i % 3 * 115;
this.cloud(t, s, o, i % 2 ? .8 : 1.15);
}
for (i = 0; i < 7; i++) {
s = 105 * i - .18 * e % 105 - 50;
this.ellipse(t, s, 131, 100, 108 + i % 3 * 18, "#8AC7BB");
}
for (i = 0; i < 12; i++) {
s = 54 * i - .3 * e % 54 - 30;
var r = 45 + i % 4 * 17;
this.roundRect(t, s, 104, 39, r, 4, "#75B8AA");
this.rect(t, s + 8, 122, 5, r - 28, "#9ACFC0");
}
for (i = 0; i < 9; i++) {
s = 75 * i - .45 * e % 75;
this.ellipse(t, s, 105, 49, 29 + i % 2 * 9, "#5DAB91");
}
};
e.prototype.cloud = function(t, e, i, s) {
this.ellipse(t, e, i, 41 * s, 12 * s, "#E9F4E6");
this.ellipse(t, e - 13 * s, i + 8 * s, 18 * s, 18 * s, "#E9F4E6");
this.ellipse(t, e + 10 * s, i + 13 * s, 23 * s, 22 * s, "#E9F4E6");
};
e.prototype.drawPipe = function(t, e, i, s, o) {
var r = e - h.WORLD.pipeWidth / 2;
this.roundRect(t, r, i, h.WORLD.pipeWidth, s, 3, "#4E9F73", p, 3);
this.rect(t, r + 7, i + 2, 12, s - 4, "#8FD28A");
this.rect(t, r + 22, i + 2, 5, s - 4, "#6FBD7B");
this.rect(t, r + h.WORLD.pipeWidth - 10, i + 2, 7, s - 4, "#3F8764");
var a = o ? i : i + s - 24;
this.roundRect(t, r - 6, a, h.WORLD.pipeWidth + 12, 24, 4, "#65B77D", p, 3);
this.rect(t, r, a + 16, h.WORLD.pipeWidth, 5, "#A6DC91");
this.rect(t, r + h.WORLD.pipeWidth - 8, a + 3, 10, 12, "#438E66");
};
e.prototype.drawGround = function() {
var t = this.ground;
t.clear();
this.rect(t, 0, 0, 480, 104, "#E8D5A0");
this.rect(t, 0, 86, 480, 18, "#73B76F");
this.rect(t, 0, 100, 480, 4, p);
this.rect(t, 0, 86, 480, 4, "#477C55");
this.rect(t, 0, 78, 480, 8, "#FFF0C0");
for (var e = this.model.distance % 28, i = -1; i < 19; i++) {
var s = 28 * i - e;
this.polygon(t, [ [ s, 90 ], [ s + 9, 90 ], [ s + 18, 100 ], [ s + 9, 100 ] ], "#ACD182");
this.rect(t, s + 4, 38 + i % 3 * 9, 5, 3, "#C9B887");
}
this.rect(t, 0, 0, 480, 13, "#D4C08D");
};
e.prototype.button = function(t, e, i, s, o, r, h, a, n) {
var c = this.makeNode(e, t, s, o);
c.setContentSize(r, h);
var l = c.addComponent(cc.Graphics);
this.roundRect(l, -r / 2, -h / 2 - 5, r, h, 12, "#3F7770");
this.roundRect(l, -r / 2, -h / 2, r, h, 12, a, p, 2);
i && this.label(c, e + " label", i, 0, 1, 20, p, !0);
c.on(cc.Node.EventType.TOUCH_START, function(t) {
t.stopPropagation();
c.scale = .96;
});
c.on(cc.Node.EventType.TOUCH_CANCEL, function() {
c.scale = 1;
});
c.on(cc.Node.EventType.TOUCH_END, function(t) {
t.stopPropagation();
c.scale = 1;
n();
});
return c;
};
e.prototype.scrim = function(t) {
var e = this.makeNode("Shade", t).addComponent(cc.Graphics);
this.rect(e, 0, 0, 480, 800, "#244B4D", 160);
};
e.prototype.blockTouches = function(t) {
t.setContentSize(480, 800);
t.setAnchorPoint(0, 0);
t.on(cc.Node.EventType.TOUCH_START, function(t) {
return t.stopPropagation();
});
};
e.prototype.layoutViewport = function() {
if (!this.layoutBusy) {
this.layoutBusy = !0;
var t = this.getComponent(cc.Canvas), e = cc.view.getFrameSize();
t.fitWidth = !0;
t.fitHeight = e.width > e.height;
var i = this.getComponent(cc.Widget);
i && i.updateAlignment();
this.viewportHeight = cc.view.getVisibleSize().height;
this.model.viewportHeight = this.viewportHeight;
this.world.setPosition(-240, -this.viewportHeight / 2);
this.world.setContentSize(480, this.viewportHeight);
for (var s = Math.min(1, this.viewportHeight / 800), o = (480 - 480 * s) / 2, r = (this.viewportHeight - 800 * s) / 2, h = 0, a = [ this.readyUI, this.overUI, this.pauseUI, this.helpUI, this.exitUI ]; h < a.length; h++) {
var n = a[h];
n.scale = s;
n.setPosition(o, r);
var c = n.getChildByName("Shade");
if (c) {
var l = c.getComponent(cc.Graphics);
l.clear();
this.rect(l, -o / s, -r / s, 480 / s, this.viewportHeight / s, "#244B4D", 160);
}
}
var p = cc.sys.getSafeAreaRect(), d = Math.max(0, cc.winSize.height - p.y - p.height);
if (this.safeAreaProbe) {
var u = parseFloat(window.getComputedStyle(this.safeAreaProbe).paddingTop) || 0;
d = Math.max(d, u / cc.view.getScaleY());
}
this.hud.setPosition(0, this.viewportHeight - 800 - d);
var y = this.flash.getComponent(cc.Graphics);
y.clear();
this.rect(y, 0, 0, 480, this.viewportHeight, "#FFFFFF");
this.layoutBusy = !1;
}
};
e.prototype.makeNode = function(t, e, i, s) {
void 0 === i && (i = 0);
void 0 === s && (s = 0);
var o = new cc.Node(t);
e.addChild(o);
o.setPosition(i, s);
return o;
};
e.prototype.graphics = function(t) {
return this.makeNode(t, this.world).addComponent(cc.Graphics);
};
e.prototype.label = function(t, e, i, s, o, r, h, a, n) {
void 0 === a && (a = !1);
void 0 === n && (n = 0);
var c = this.makeNode(e, t, s, o);
c.color = new cc.Color().fromHEX(h);
var l = c.addComponent(cc.Label);
l.string = i;
l.fontFamily = "Arial";
l.fontSize = r;
l.lineHeight = 1.3 * r;
l.enableBold = a;
l.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
l.verticalAlign = cc.Label.VerticalAlign.CENTER;
l.enableWrapText = !1;
if (n) {
var d = c.addComponent(cc.LabelOutline);
d.color = new cc.Color().fromHEX(p);
d.width = n;
}
return l;
};
e.prototype.rect = function(t, e, i, s, o, r, h) {
void 0 === h && (h = 255);
t.fillColor = new cc.Color().fromHEX(r);
t.fillColor.a = h;
t.rect(e, i, s, o);
t.fill();
};
e.prototype.roundRect = function(t, e, i, s, o, r, h, a, n) {
void 0 === n && (n = 2);
t.fillColor = new cc.Color().fromHEX(h);
t.roundRect(e, i, s, o, r);
t.fill();
if (a) {
t.strokeColor = new cc.Color().fromHEX(a);
t.lineWidth = n;
t.stroke();
}
};
e.prototype.ellipse = function(t, e, i, s, o, r, h) {
t.fillColor = new cc.Color().fromHEX(r);
t.ellipse(e, i, s, o);
t.fill();
if (h) {
t.strokeColor = new cc.Color().fromHEX(h);
t.lineWidth = 2;
t.stroke();
}
};
e.prototype.polygon = function(t, e, i, s) {
t.fillColor = new cc.Color().fromHEX(i);
t.moveTo(e[0][0], e[0][1]);
for (var o = 1; o < e.length; o++) t.lineTo(e[o][0], e[o][1]);
t.close();
t.fill();
if (s) {
t.strokeColor = new cc.Color().fromHEX(s);
t.lineWidth = 2;
t.stroke();
}
};
r([ l({
tooltip: "Enable desktop keyboard controls: Space / Up / W, P / Escape, R."
}) ], e.prototype, "keyboardEnabled", void 0);
return r([ c ], e);
}(cc.Component);
i.default = y;
cc._RF.pop();
}, {
"./GameModel": "GameModel",
"./HostBridge": "HostBridge"
} ],
GameModel: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "06f9eBc7NNCebj0ZLCh3b0m", "GameModel");
Object.defineProperty(i, "__esModule", {
value: !0
});
i.WORLD = void 0;
i.WORLD = {
width: 480,
height: 800,
ground: 104,
birdX: 138,
birdRadius: 15,
pipeWidth: 72,
pipeLip: 6,
gravity: 1050,
flapVelocity: 350,
pipeSpacing: 260
};
var s = function() {
function t(t, e) {
void 0 === t && (t = 0);
void 0 === e && (e = Math.random);
this.random = e;
this.state = "ready";
this.paused = !1;
this.birdY = 420;
this.velocity = 0;
this.score = 0;
this.best = 0;
this.newBest = !1;
this.pipes = [];
this.distance = 0;
this.elapsed = 0;
this.viewportHeight = i.WORLD.height;
this.accumulator = 0;
this.step = 1 / 120;
this.best = isFinite(t) ? Math.max(0, Math.floor(t)) : 0;
}
Object.defineProperty(t.prototype, "speed", {
get: function() {
return 155 + 2 * Math.min(this.score, 25);
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "startingY", {
get: function() {
return Math.min(420, (this.viewportHeight + i.WORLD.ground) / 2);
},
enumerable: !1,
configurable: !0
});
t.prototype.reset = function() {
this.state = "ready";
this.paused = !1;
this.birdY = this.startingY;
this.velocity = 0;
this.score = 0;
this.newBest = !1;
this.pipes = [];
this.distance = 0;
this.elapsed = 0;
this.accumulator = 0;
};
t.prototype.flap = function() {
if (this.paused || "dying" === this.state || "over" === this.state) return !1;
if ("ready" === this.state) {
this.state = "playing";
this.pipes.push({
x: 550,
gapY: this.startingY,
gap: 190,
passed: !1
});
}
this.velocity = i.WORLD.flapVelocity;
return !0;
};
t.prototype.togglePause = function() {
"playing" === this.state && (this.paused = !this.paused);
};
t.prototype.update = function(t) {
if (!(this.paused || "over" === this.state || !isFinite(t) || t <= 0)) {
this.accumulator += Math.min(t, .1);
for (;this.accumulator + 1e-9 >= this.step; ) {
this.accumulator -= this.step;
this.tick(this.step);
}
}
};
t.prototype.tick = function(t) {
if ("over" !== this.state) {
this.elapsed += t;
if ("ready" !== this.state) {
this.velocity = Math.max(this.velocity - i.WORLD.gravity * t, -650);
this.birdY += this.velocity * t;
if (this.birdY - i.WORLD.birdRadius <= i.WORLD.ground) {
this.birdY = i.WORLD.ground + i.WORLD.birdRadius;
this.die();
this.state = "over";
} else if ("dying" !== this.state) if (this.birdY + i.WORLD.birdRadius >= this.viewportHeight) {
this.birdY = this.viewportHeight - i.WORLD.birdRadius;
this.die();
} else {
var e = this.speed * t;
this.distance += e;
for (var s = 0, o = this.pipes; s < o.length; s++) (d = o[s]).x -= e;
var r = this.pipes[this.pipes.length - 1];
if (r && r.x <= 550 - i.WORLD.pipeSpacing) {
var h = Math.max(166, 190 - this.score), a = Math.min(575, this.viewportHeight - h / 2 - 50), n = Math.min(285, a), c = Math.max(n, Math.min(a, r.gapY + 210 * (this.random() - .5)));
this.pipes.push({
x: r.x + i.WORLD.pipeSpacing,
gapY: c,
gap: h,
passed: !1
});
}
for (var l = 0, p = this.pipes; l < p.length; l++) {
var d, u = (d = p[l]).gapY - d.gap / 2, y = d.gapY + d.gap / 2, f = d.x - i.WORLD.pipeWidth / 2;
if (this.hitsRect(f, i.WORLD.ground, i.WORLD.pipeWidth, u - i.WORLD.ground) || this.hitsRect(f, y, i.WORLD.pipeWidth, this.viewportHeight - y) || this.hitsRect(f - i.WORLD.pipeLip, u - 24, i.WORLD.pipeWidth + 12, 24) || this.hitsRect(f - i.WORLD.pipeLip, y, i.WORLD.pipeWidth + 12, 24)) {
this.die();
return;
}
if (!d.passed && d.x + i.WORLD.pipeWidth / 2 + i.WORLD.pipeLip < i.WORLD.birdX - i.WORLD.birdRadius) {
d.passed = !0;
this.score++;
if (this.score > this.best) {
this.best = this.score;
this.newBest = !0;
}
}
}
this.pipes = this.pipes.filter(function(t) {
return t.x > -60;
});
}
} else {
this.distance += 55 * t;
this.birdY = this.startingY + 9 * Math.sin(3.5 * this.elapsed);
}
}
};
t.prototype.hitsRect = function(t, e, s, o) {
var r = i.WORLD.birdX - Math.max(t, Math.min(i.WORLD.birdX, t + s)), h = this.birdY - Math.max(e, Math.min(this.birdY, e + o));
return r * r + h * h <= i.WORLD.birdRadius * i.WORLD.birdRadius;
};
t.prototype.die = function() {
if ("playing" === this.state) {
this.state = "dying";
this.velocity = Math.min(this.velocity, 0);
}
};
return t;
}();
i.default = s;
cc._RF.pop();
}, {} ],
HostBridge: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "156c0orb85MyYAZkWSubFFW", "HostBridge");
Object.defineProperty(i, "__esModule", {
value: !0
});
i.installHostBridge = i.parseHostCommand = i.sendToHost = i.GAME_VERSION = void 0;
i.GAME_VERSION = "1.0.0";
var s = "homerun:cocos", o = null;
function r(t) {
cc.sys.isNative && "undefined" != typeof HomeRunNativeHost ? HomeRunNativeHost.send(JSON.stringify(t)) : cc.sys.isBrowser && o && window.parent.postMessage({
channel: s,
message: t
}, o);
}
i.sendToHost = r;
i.parseHostCommand = function(t) {
return !t || "object" != typeof t || Array.isArray(t) ? null : "app:pause" === t.type || "app:back" === t.type ? t : "app:configure" === t.type && "string" == typeof t.requestId && t.requestId.length > 0 && t.requestId.length <= 128 && ("red" === t.birdColor || "yellow" === t.birdColor || "green" === t.birdColor) && "boolean" == typeof t.fullScreen && "number" == typeof t.highScore && Math.floor(t.highScore) === t.highScore && t.highScore >= 0 && t.highScore <= 1e9 ? t : null;
};
i.installHostBridge = function(t, e) {
var h = function() {
return r({
type: "game:ready",
protocolVersion: 1,
gameVersion: i.GAME_VERSION,
highScore: e()
});
}, a = function(e) {
e && "object" == typeof e && !Array.isArray(e) && "app:connect" === e.type ? h() : t(e);
};
if (cc.sys.isNative) {
globalThis.HomeRunGameReceive = a;
h();
return function() {
delete globalThis.HomeRunGameReceive;
};
}
if (!cc.sys.isBrowser || window.parent === window) return function() {};
try {
var n = new URL(window.location.href).searchParams.get("hostOrigin"), c = new URL(n || "");
if ("https:" !== c.protocol && "http:" !== c.protocol) return function() {};
o = c.origin;
} catch (t) {
return function() {};
}
var l = function(t) {
t.source === window.parent && t.origin === o && t.data && t.data.channel === s && a(t.data.message);
};
window.addEventListener("message", l);
h();
return function() {
window.removeEventListener("message", l);
o = null;
};
};
cc._RF.pop();
}, {} ]
}, {}, [ "FlappyBird", "GameModel", "HostBridge" ]);