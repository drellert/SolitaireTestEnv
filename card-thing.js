"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var suits = ["Hearts", "Spades", "Clubs", "Diamonds"];
var values = [
    "King",
    "Queen",
    "Jack",
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    "Ace",
];
var isValueNextOnResult = function (compare, to) {
    if (!compare)
        return true;
    switch (compare) {
        case "Ace":
            return to === 2;
        case 2:
            return to === 3;
        case 3:
            return to === 4;
        case 4:
            return to === 5;
        case 5:
            return to === 6;
        case 6:
            return to === 7;
        case 7:
            return to === 8;
        case 8:
            return to === 9;
        case 9:
            return to === 10;
        case 10:
            return to === "Jack";
        case "Jack":
            return to === "Queen";
        case "Queen":
            return to === "King";
    }
    return false;
};
var isValueNextOnPlay = function (compare, to) {
    if (!compare)
        return true;
    switch (compare) {
        case "King":
            return to === "Queen";
        case "Queen":
            return to === "Jack";
        case "Jack":
            return to === 10;
        case 10:
            return to === 9;
        case 9:
            return to === 8;
        case 8:
            return to === 7;
        case 7:
            return to === 6;
        case 6:
            return to === 5;
        case 5:
            return to === 4;
        case 4:
            return to === 3;
        case 3:
            return to === 2;
        case 2:
            return to === "Ace";
    }
    return false;
};
var isSuitOpposite = function (compare, to) {
    switch (compare) {
        case "Diamonds":
        case "Hearts":
            return to === "Clubs" || to === "Spades";
        case "Clubs":
        case "Spades":
            return to === "Diamonds" || to === "Hearts";
    }
};
var Card = /** @class */ (function () {
    function Card(suit, value) {
        this.suit = suit;
        this.value = value;
        this.visible = false;
    }
    Card.prototype.toString = function () {
        if (this.visible)
            return "(" + this.value + " of " + this.suit + ")";
        else
            return "Unknown";
    };
    return Card;
}());
var Pile = /** @class */ (function () {
    function Pile(cards) {
        var _this = this;
        if (cards === void 0) { cards = []; }
        this.cards = cards;
        this.add = function (card) {
            return _this.canAdd(card) ? _this.cards.push(card) : null;
        };
        this.addSeveral = function (cards) {
            return _this.canAdd(cards[0]) ? (_this.cards = _this.cards.concat(cards)) : null;
        };
        this.removeTop = function () { return _this.cards.pop(); };
        this.removeSeveral = function (numOfCards) {
            if (numOfCards > _this.cards.length)
                return;
            for (var i = 1; i <= numOfCards; i++) {
                if (!_this.cards[_this.cards.length - i].visible)
                    return;
            }
            return _this.cards.splice(-numOfCards);
        };
        this.fillPile = function (cards) { return (_this.cards = cards); };
        this.getVisibleCards = function () { return _this.cards.filter(function (c) { return c.visible; }); };
        this.numberHiddenCards = function () {
            return _this.cards.filter(function (c) { return !c.visible; }).length;
        };
        this.toString = function () {
            return _this.cards.length === 0
                ? "Empty"
                : _this.cards.reduce(function (pV, v) { return pV + " " + v; }, "");
        };
    }
    Object.defineProperty(Pile.prototype, "top", {
        get: function () {
            return this.cards.length === 0 ? null : this.cards[this.cards.length - 1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pile.prototype, "empty", {
        get: function () {
            return this.cards.length === 0;
        },
        enumerable: false,
        configurable: true
    });
    return Pile;
}());
var FoundationPile = /** @class */ (function (_super) {
    __extends(FoundationPile, _super);
    function FoundationPile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.canAdd = function (card) {
            var _a, _b;
            return (_this.top === null && card.value === "Ace") ||
                (card.suit === ((_a = _this.top) === null || _a === void 0 ? void 0 : _a.suit) &&
                    isValueNextOnResult((_b = _this.top) === null || _b === void 0 ? void 0 : _b.value, card.value));
        };
        _this.isFull = function () { return _this.cards.length === values.length; };
        return _this;
    }
    return FoundationPile;
}(Pile));
var PlayPile = /** @class */ (function (_super) {
    __extends(PlayPile, _super);
    function PlayPile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.canAdd = function (card) {
            var _a, _b;
            return (_this.top === null && card.value === "King") ||
                (isSuitOpposite((_a = _this.top) === null || _a === void 0 ? void 0 : _a.suit, card.suit) &&
                    isValueNextOnPlay((_b = _this.top) === null || _b === void 0 ? void 0 : _b.value, card.value));
        };
        return _this;
    }
    return PlayPile;
}(Pile));
var DrawPile = /** @class */ (function (_super) {
    __extends(DrawPile, _super);
    function DrawPile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.index = 0;
        _this.canAdd = function () { return false; };
        _this.removeTop = function () {
            if (_this.cards.length === 0)
                return undefined;
            var cardRemoved = _this.cards.splice(_this.index, 1)[0];
            _this.index = (_this.index === 0) ? 0 : _this.index - 1;
            return cardRemoved;
        };
        _this.shift = function () {
            return (_this.index =
                _this.cards.length === 1 ? 0 : (_this.index + 1) % (_this.cards.length));
        };
        return _this;
    }
    Object.defineProperty(DrawPile.prototype, "top", {
        get: function () {
            return this.cards.length === 0 ? null : this.cards[this.index];
        },
        enumerable: false,
        configurable: true
    });
    return DrawPile;
}(Pile));
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
var Game = /** @class */ (function () {
    function Game() {
        var e_1, _a, e_2, _b, e_3, _c, e_4, _d;
        var _this = this;
        this._drawPile = new DrawPile();
        this._foundationPiles = Array(4)
            .fill(null)
            .map(function () { return new FoundationPile(); });
        this._playPiles = Array(7)
            .fill(null)
            .map(function () { return new PlayPile(); });
        this._gameOver = false;
        this.getPile = function (_a) {
            var pile = _a.pile, index = _a.index;
            switch (pile) {
                case "draw":
                    return _this.drawPile;
                case "play":
                    return _this.playPiles[index];
                case "foundation":
                    return _this.foundationPiles[index];
            }
        };
        var allCards = [];
        try {
            for (var suits_1 = __values(suits), suits_1_1 = suits_1.next(); !suits_1_1.done; suits_1_1 = suits_1.next()) {
                var suit = suits_1_1.value;
                try {
                    for (var values_1 = (e_2 = void 0, __values(values)), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
                        var value = values_1_1.value;
                        allCards.push(new Card(suit, value));
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (values_1_1 && !values_1_1.done && (_b = values_1.return)) _b.call(values_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (suits_1_1 && !suits_1_1.done && (_a = suits_1.return)) _a.call(suits_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var shuffld = shuffle(allCards);
        try {
            // Now we put da cardz in da play zone
            for (var _e = __values(this._playPiles.entries()), _f = _e.next(); !_f.done; _f = _e.next()) {
                var _g = __read(_f.value, 2), index = _g[0], pile = _g[1];
                pile.fillPile(shuffld.splice(0, index + 1));
                pile.top.visible = true;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_c = _e.return)) _c.call(_e);
            }
            finally { if (e_3) throw e_3.error; }
        }
        try {
            // And da rest in da draw
            for (var shuffld_1 = __values(shuffld), shuffld_1_1 = shuffld_1.next(); !shuffld_1_1.done; shuffld_1_1 = shuffld_1.next()) {
                var card = shuffld_1_1.value;
                card.visible = true;
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (shuffld_1_1 && !shuffld_1_1.done && (_d = shuffld_1.return)) _d.call(shuffld_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        this._drawPile.fillPile(shuffld);
    }
    Object.defineProperty(Game.prototype, "drawPile", {
        get: function () {
            return this._drawPile;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "foundationPiles", {
        get: function () {
            return this._foundationPiles;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "playPiles", {
        get: function () {
            return this._playPiles;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "gameOver", {
        get: function () {
            return this._gameOver;
        },
        set: function (bool) {
            this._gameOver = bool;
        },
        enumerable: false,
        configurable: true
    });
    Game.prototype.printStatus = function () {
        var _a, _b;
        console.log("\n\nDraw Pile: " + ((_b = (_a = this.drawPile.top) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "No Draw Pile") + " \t\t Foundation Piles: " + this._foundationPiles
            .map(function (p) { var _a, _b; return (_b = (_a = p.top) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "Empty"; })
            .reduce(function (pV, v) { return pV + " " + v; }) + " \nPlay Piles: " + this._playPiles
            .map(function (p) { return "\n" + p.toString(); })
            .reduce(function (pV, v) { return "" + pV + v + " "; }) + "\n\n");
    };
    Game.prototype.doMove = function (_a) {
        var _this = this;
        var from = _a.from, to = _a.to, _b = _a.amount, amount = _b === void 0 ? 1 : _b;
        var _c = __read([from, to].map(function (m) { return _this.getPile(m); }), 2), fromPile = _c[0], toPile = _c[1];
        if (!fromPile || !toPile)
            throw new Error("Could not find pile for move " + JSON.stringify({
                from: from,
                to: to,
            }));
        //If both the draw pile is set as both the from and to piles, the draw pile is shifted
        if (fromPile instanceof DrawPile && toPile instanceof DrawPile) {
            this.drawPile.shift();
            console.log("Shifting draw pile.");
            return;
        }
        if (amount > 1) {
            var cards = fromPile.removeSeveral(amount);
            if (!toPile.canAdd(cards[0]))
                throw new Error("Illegal move, pile for move " + JSON.stringify({
                    from: from,
                    to: to,
                }) + " cannot recive cards " + cards
                    .map(function (c) { return c.toString(); })
                    .reduce(function (pV, v) { return pV + " " + v; }) + "\n                    , stack is currently " + toPile.toString());
            toPile.addSeveral(cards);
            console.log("Moving " + cards
                .map(function (c) { return c.toString(); })
                .reduce(function (pV, v) { return pV + " " + v; }) + " from pile: " + from.pile + " " + (from.index + 1) + ", to pile: " + to.pile + " " + (to.index + 1) + ".");
        }
        else {
            var card = fromPile.removeTop();
            if (!toPile.canAdd(card))
                throw new Error(
                //fik dette error
                "Illegal move, pile for move " + JSON.stringify({
                    from: from,
                    to: to,
                }) + " cannot recive card " + card.toString() + ", stack is currently " + toPile.toString());
            toPile.add(card);
            console.log("Moving " + card.toString() + " from pile: " + from.pile + " " + (from.index + 1) + ", to pile: " + to.pile + " " + (to.index + 1) + ".");
        }
        //gav fejl
        if (fromPile.top && !fromPile.top.visible)
            fromPile.top.visible = true;
    };
    Game.prototype.replacementKing = function () {
        var e_5, _a, e_6, _b;
        if (this._drawPile.top && this._drawPile.top.value === "King")
            return true;
        else {
            try {
                for (var _c = __values(this._playPiles), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var pile = _d.value;
                    var visible = pile.getVisibleCards();
                    var hiddenCards = pile.numberHiddenCards();
                    try {
                        for (var visible_1 = (e_6 = void 0, __values(visible)), visible_1_1 = visible_1.next(); !visible_1_1.done; visible_1_1 = visible_1.next()) {
                            var card = visible_1_1.value;
                            if (card.value === "King" && hiddenCards !== 0)
                                return true;
                        }
                    }
                    catch (e_6_1) { e_6 = { error: e_6_1 }; }
                    finally {
                        try {
                            if (visible_1_1 && !visible_1_1.done && (_b = visible_1.return)) _b.call(visible_1);
                        }
                        finally { if (e_6) throw e_6.error; }
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_5) throw e_5.error; }
            }
        }
        return false;
    };
    Game.prototype.suggestMove = function () {
        var e_7, _a, e_8, _b, e_9, _c, e_10, _d, e_11, _e, e_12, _f, e_13, _g, e_14, _h, e_15, _j;
        var _k, _l, _m, _o, _p;
        // Strategy taken from https://www.bvssolitaire.com/rules/klondike-solitaire-strategy.htm
        console.log("Choosing move...");
        try {
            // Tip 1: We assume that a card from the draw pile is always turned up, as long as the
            //        drawpile isn't empty.
            // Tip 2A: Move available cards (Aces and Deuces) from play pile to foundation pile
            for (var _q = __values(this._playPiles.entries()), _r = _q.next(); !_r.done; _r = _q.next()) {
                var _s = __read(_r.value, 2), playPileIndex = _s[0], playPile = _s[1];
                if (((_k = playPile.top) === null || _k === void 0 ? void 0 : _k.value) === "Ace" || ((_l = playPile.top) === null || _l === void 0 ? void 0 : _l.value) === 2) {
                    try {
                        for (var _t = (e_8 = void 0, __values(this._foundationPiles.entries())), _u = _t.next(); !_u.done; _u = _t.next()) {
                            var _v = __read(_u.value, 2), foundationPileIndex = _v[0], foundationPile = _v[1];
                            if (foundationPile.canAdd(playPile.top)) {
                                return {
                                    from: {
                                        pile: "play",
                                        index: playPileIndex,
                                    },
                                    to: {
                                        pile: "foundation",
                                        index: foundationPileIndex,
                                    },
                                };
                            }
                        }
                    }
                    catch (e_8_1) { e_8 = { error: e_8_1 }; }
                    finally {
                        try {
                            if (_u && !_u.done && (_b = _t.return)) _b.call(_t);
                        }
                        finally { if (e_8) throw e_8.error; }
                    }
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_r && !_r.done && (_a = _q.return)) _a.call(_q);
            }
            finally { if (e_7) throw e_7.error; }
        }
        // Tip 2B: Move available cards (Aces and Deuces) from draw pile to foundation pile
        if (((_m = this.drawPile.top) === null || _m === void 0 ? void 0 : _m.value) === "Ace" || ((_o = this.drawPile.top) === null || _o === void 0 ? void 0 : _o.value) === 2) {
            try {
                for (var _w = __values(this._foundationPiles.entries()), _x = _w.next(); !_x.done; _x = _w.next()) {
                    var _y = __read(_x.value, 2), pileIndex = _y[0], pile = _y[1];
                    if (pile.canAdd(this.drawPile.top)) {
                        console.log("Drawpile ace or deuce to foundation");
                        return {
                            from: {
                                pile: "draw",
                                index: 0,
                            },
                            to: {
                                pile: "foundation",
                                index: pileIndex,
                            },
                        };
                    }
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (_x && !_x.done && (_c = _w.return)) _c.call(_w);
                }
                finally { if (e_9) throw e_9.error; }
            }
        }
        // Tip 5: Move King from play pile to empty play pile
        // Consider carefully whether to fill a space with a  black King or a red King
        //tjek for konger i alle byggestabler med skjulte kort og i dækket,
        //hvis der er flere, så tjek dækket og de byggestabler der opfylder betingelsen at de ikke har en konge
        //og de har synlige kort. Hvis en af dem er en dronning, så vælg kongen med dem modsatte farve af dronningen.
        var numKings = null;
        var blackKing = false;
        var redKing = false;
        var blackQueen = false;
        var redQueen = false;
        var hiddenCardsBehindKing = null;
        var viableKingMove = null;
        if (this.replacementKing()) {
            //tjekker drawpile
            if (this.drawPile.top.value === "King") {
                numKings++;
                if (this.drawPile.top.suit === "Hearts" || this.drawPile.top.suit === "Diamonds") {
                    redKing = true;
                }
                else {
                    blackKing = true;
                }
            }
            try {
                //tjekker playpile
                for (var _z = __values(this._playPiles.entries()), _0 = _z.next(); !_0.done; _0 = _z.next()) {
                    var _1 = __read(_0.value, 2), index = _1[0], playPile = _1[1];
                    var visible = playPile.getVisibleCards();
                    var bottom = visible[visible.length - 1];
                    if (bottom) {
                        if (bottom.value === "King") {
                            numKings++;
                            if (this.drawPile.top.suit === "Hearts" || this.drawPile.top.suit === "Diamonds") {
                                redKing = true;
                            }
                            else {
                                blackKing = true;
                            }
                        }
                        else if (bottom.value === "Queen") {
                            if (this.drawPile.top.suit === "Hearts" || this.drawPile.top.suit === "Diamonds") {
                                redQueen = true;
                            }
                            else {
                                blackQueen = true;
                            }
                        }
                    }
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (_0 && !_0.done && (_d = _z.return)) _d.call(_z);
                }
                finally { if (e_10) throw e_10.error; }
            }
        }
        if (blackKing && redKing && redQueen && !blackQueen) {
            console.log(" 1 move black king");
            this.moveKingToEmpty(false, true);
        }
        else if (blackKing && redKing && !redQueen && blackQueen) {
            console.log(" 1 move red king");
            this.moveKingToEmpty(true, false);
        }
        else if (this.replacementKing()) {
            this.moveKingToEmpty(false, false);
        }
        // Tip 3: Expose hidden cards from the play pile with the most hidden cards
        var hiddenCards = null;
        var viableMove = null;
        var fromString = "";
        var toString = "";
        try {
            for (var _2 = __values(this._playPiles.entries()), _3 = _2.next(); !_3.done; _3 = _2.next()) {
                var _4 = __read(_3.value, 2), index = _4[0], pile = _4[1];
                if (!pile.empty) {
                    var visibleCards = pile.getVisibleCards();
                    var bottom = visibleCards[0];
                    if (bottom) {
                        try {
                            // Now we check if this bottom card can be moved somewhere else
                            for (var _5 = (e_12 = void 0, __values(this._playPiles.entries())), _6 = _5.next(); !_6.done; _6 = _5.next()) {
                                var _7 = __read(_6.value, 2), targetIndex = _7[0], targetPile = _7[1];
                                if (targetIndex !== index &&
                                    targetPile.canAdd(bottom) &&
                                    (viableMove === null ||
                                        hiddenCards === null ||
                                        pile.numberHiddenCards() >= hiddenCards)) {
                                    hiddenCards = pile.numberHiddenCards();
                                    // Tip 5: A play pile is only emptied if there is a King to put in it
                                    if (hiddenCards !== 0 || this.replacementKing()) {
                                        fromString = bottom.toString();
                                        toString = (_p = targetPile.top) === null || _p === void 0 ? void 0 : _p.toString();
                                        viableMove = {
                                            from: {
                                                pile: "play",
                                                index: index,
                                            },
                                            to: {
                                                pile: "play",
                                                index: targetIndex,
                                            },
                                            amount: visibleCards.length,
                                        };
                                    }
                                }
                            }
                        }
                        catch (e_12_1) { e_12 = { error: e_12_1 }; }
                        finally {
                            try {
                                if (_6 && !_6.done && (_f = _5.return)) _f.call(_5);
                            }
                            finally { if (e_12) throw e_12.error; }
                        }
                    }
                }
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_3 && !_3.done && (_e = _2.return)) _e.call(_2);
            }
            finally { if (e_11) throw e_11.error; }
        }
        if (viableMove) {
            console.log("Playpile card(" + fromString + ") to other playpile card " + toString);
            return viableMove;
        }
        // Tip 3: The best move provides you opportunity to make other moves or expose hidden cards
        // We see if a card from the draw pile can be added to the play piles
        var topDraw = this._drawPile.top;
        if (topDraw) {
            try {
                for (var _8 = __values(this._playPiles.entries()), _9 = _8.next(); !_9.done; _9 = _8.next()) {
                    var _10 = __read(_9.value, 2), index = _10[0], pile = _10[1];
                    if (pile.canAdd(topDraw)) {
                        console.log("Drawpile card to playpile");
                        return {
                            from: {
                                pile: "draw",
                                index: 0,
                            },
                            to: {
                                pile: "play",
                                index: index,
                            },
                        };
                    }
                }
            }
            catch (e_13_1) { e_13 = { error: e_13_1 }; }
            finally {
                try {
                    if (_9 && !_9.done && (_g = _8.return)) _g.call(_8);
                }
                finally { if (e_13) throw e_13.error; }
            }
        }
        try {
            // Tip 6: If you have a choice between a black King and a red King to fill a space with,
            //        be cautious in your decision. Look at the color of the blocking cards and make the
            //        appropriate color choice. For example, if you have a red Jack that blocks some hidden
            //        cards, you have to select a red King and than wait for a black Queen.
<<<<<<< HEAD
            // Move top cards to foundation
            for (var _11 = __values(this._foundationPiles.entries()), _12 = _11.next(); !_12.done; _12 = _11.next()) {
                var _13 = __read(_12.value, 2), foundationIndex = _13[0], foundationPile = _13[1];
=======
            // Move cards from play piles and draw pile to foundation
            // TODO: extra checks before moving cards (e.g. cards from one red suit and one black suit
            // "buddy up")
            for (var _20 = __values(this._foundationPiles.entries()), _21 = _20.next(); !_21.done; _21 = _20.next()) {
                var _22 = __read(_21.value, 2), foundationIndex = _22[0], foundationPile = _22[1];
>>>>>>> 62d3285c3713ea6b287a1abb5c1c36940689f1b0
                if (foundationPile.top) {
                    try {
                        for (var _14 = (e_15 = void 0, __values(this._playPiles.entries())), _15 = _14.next(); !_15.done; _15 = _14.next()) {
                            var _16 = __read(_15.value, 2), playIndex = _16[0], playPile = _16[1];
                            if (playPile.top && foundationPile.canAdd(playPile.top)) {
                                console.log("Playpile cards to foundation");
                                return {
                                    from: {
                                        pile: "play",
                                        index: playIndex,
                                    },
                                    to: {
                                        pile: "foundation",
                                        index: foundationIndex,
                                    },
                                };
                            }
                        }
                    }
                    catch (e_15_1) { e_15 = { error: e_15_1 }; }
                    finally {
                        try {
                            if (_15 && !_15.done && (_j = _14.return)) _j.call(_14);
                        }
                        finally { if (e_15) throw e_15.error; }
                    }
                    if (this.drawPile.top && foundationPile.canAdd(this.drawPile.top)) {
                        console.log("Drawpile cards to foundation");
                        return {
                            from: {
                                pile: "draw",
                                index: 0,
                            },
                            to: {
                                pile: "foundation",
                                index: foundationIndex,
                            },
                        };
                    }
                }
            }
        }
        catch (e_14_1) { e_14 = { error: e_14_1 }; }
        finally {
            try {
                if (_12 && !_12.done && (_h = _11.return)) _h.call(_11);
            }
            finally { if (e_14) throw e_14.error; }
        }
        // If no other move is found, the shifting of the draw pile is suggested.
        // This will create a loop, if the user continues to use the program, since we don't save an
        // internal state and therefore can't adjust the suggestion accordingly.
        if (!this.drawPile.empty) {
            return {
                from: {
                    pile: "draw",
                    index: 0,
                },
                to: {
                    pile: "draw",
                    index: 0,
                },
            };
        }
        else {
            // Do something
        }
        //No moves possible
        console.log("No move was possible");
        console.log("You lost, ignore errors");
    };
    Game.prototype.moveKingToEmpty = function (redKing, blackKing) {
        var e_16, _a, e_17, _b;
        //duplikeret kode
        var hiddenCardsBehindKing = null;
        var viableKingMove = null;
        try {
            for (var _c = __values(this._playPiles.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), targetIndex = _e[0], targetPile = _e[1];
                if (targetPile.empty) {
                    try {
                        for (var _f = (e_17 = void 0, __values(this._playPiles.entries())), _g = _f.next(); !_g.done; _g = _f.next()) {
                            var _h = __read(_g.value, 2), index = _h[0], pile = _h[1];
                            //giver fejl (value undefined)- der skal være hidden cards
                            var visible = pile.getVisibleCards();
                            var bottom = visible[0];
                            if (blackKing && !redKing) {
                                if (bottom &&
                                    bottom.value === "King" && (bottom.suit === "Clubs" || bottom.suit === "Spades") &&
                                    (viableKingMove === null ||
                                        hiddenCardsBehindKing === null ||
                                        pile.numberHiddenCards() >= hiddenCardsBehindKing)) {
                                    hiddenCardsBehindKing = pile.numberHiddenCards();
                                    // A King isn't moved if there aren't any hidden cards behind it
                                    console.log(" 2 move black king");
                                    if (hiddenCardsBehindKing !== 0) {
                                        viableKingMove = {
                                            from: {
                                                pile: "play",
                                                index: index,
                                            },
                                            to: {
                                                pile: "play",
                                                index: targetIndex,
                                            },
                                            amount: visible.length,
                                        };
                                    }
                                }
                            }
                            else if (redKing && !blackKing) {
                                if (bottom &&
                                    bottom.value === "King" && (bottom.suit === "Diamonds" || bottom.suit === "Hearts") &&
                                    (viableKingMove === null ||
                                        hiddenCardsBehindKing === null ||
                                        pile.numberHiddenCards() >= hiddenCardsBehindKing)) {
                                    hiddenCardsBehindKing = pile.numberHiddenCards();
                                    // A King isn't moved if there aren't any hidden cards behind it
                                    if (hiddenCardsBehindKing !== 0) {
                                        console.log(" 2 move red king");
                                        viableKingMove = {
                                            from: {
                                                pile: "play",
                                                index: index,
                                            },
                                            to: {
                                                pile: "play",
                                                index: targetIndex,
                                            },
                                            amount: visible.length,
                                        };
                                    }
                                }
                            }
                            else {
                                if (bottom &&
                                    bottom.value === "King" &&
                                    (viableKingMove === null ||
                                        hiddenCardsBehindKing === null ||
                                        pile.numberHiddenCards() >= hiddenCardsBehindKing)) {
                                    hiddenCardsBehindKing = pile.numberHiddenCards();
                                    // A King isn't moved if there aren't any hidden cards behind it
                                    if (hiddenCardsBehindKing !== 0) {
                                        console.log("2 move any king");
                                        viableKingMove = {
                                            from: {
                                                pile: "play",
                                                index: index,
                                            },
                                            to: {
                                                pile: "play",
                                                index: targetIndex,
                                            },
                                            amount: visible.length,
                                        };
                                    }
                                }
                            }
                        }
                    }
                    catch (e_17_1) { e_17 = { error: e_17_1 }; }
                    finally {
                        try {
                            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                        }
                        finally { if (e_17) throw e_17.error; }
                    }
                    if (viableKingMove)
                        return viableKingMove;
                }
            }
        }
        catch (e_16_1) { e_16 = { error: e_16_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_16) throw e_16.error; }
        }
    };
    Game.prototype.drawpileKingToEmpty = function () {
        var e_18, _a;
        try {
            for (var _b = __values(this._playPiles.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), index = _d[0], pile = _d[1];
                if (pile.empty) {
                    console.log("drawpile king to empty playpile");
                    return {
                        from: {
                            pile: "draw",
                            index: 0,
                        },
                        to: {
                            pile: "play",
                            index: index,
                        },
                    };
                }
            }
        }
        catch (e_18_1) { e_18 = { error: e_18_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_18) throw e_18.error; }
        }
    };
    Game.prototype.isGameWon = function () {
        var _a, _b, _c, _d;
        if (((_a = this._foundationPiles[0].top) === null || _a === void 0 ? void 0 : _a.value) === "King" &&
            ((_b = this._foundationPiles[1].top) === null || _b === void 0 ? void 0 : _b.value) === "King" &&
            ((_c = this._foundationPiles[2].top) === null || _c === void 0 ? void 0 : _c.value) === "King" &&
            ((_d = this._foundationPiles[3].top) === null || _d === void 0 ? void 0 : _d.value) === "King")
            return true;
        else
            return false;
    };
    return Game;
}());
var moveString = "Type your desired move:\n                    \n - 'SD': Shift drawpile\n                    \n - 'M x y': Move card from x to y\n                    \n - 'X': Exit game\n                    \n\nPiles should be named as follows:\n                    \n'draw+' for the draw pile.\n                    \n'play+' followed by a number 1-7 for the seven play piles. If you want to move several cards, add the number of cards to the end of your move.\n                    \n'foundation+' followed by a number 1-4 for the four foundation piles.\n";
var g = new Game();
g.printStatus();
while (g.gameOver === false) {
    g.doMove(g.suggestMove());
    /*
  let move = read.question(moveString).split(" ");
  
  switch (move[0]) {
    case "SD":
      g.drawPile.shift();
      break;
    case "M":
      const fromPile = move[1].split("+");
      const toPile = move[2].split("+");
      const numOfCards = move.length === 4 ? parseInt(move[3]) : 1;
      g.doMove(
        {
          from: {
            pile: fromPile[0] as PileType,
            index: parseInt(fromPile[1]) - 1 ?? -1,
          },
          to: {
            pile: toPile[0] as PileType,
            index: parseInt(toPile[1]) - 1 ?? -1,
          },
          
        },
        
      );
      break;
    case "X":
      g.gameOver = true;
      break;
      
  }
  */
    g.printStatus();
    if (g.isGameWon())
        g.gameOver = true;
}
if (g.isGameWon())
    console.log("Congratulations, you won!");
else if (!g.isGameWon())
    console.log("Dumbass, you lost.");
//# sourceMappingURL=card-thing.js.map