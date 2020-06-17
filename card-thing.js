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
            for (var i_1 = 1; i_1 <= numOfCards; i_1++) {
                if (!_this.cards[_this.cards.length - i_1].visible)
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
        var e_7, _a, e_8, _b, e_9, _c, e_10, _d, e_11, _e, e_12, _f, e_13, _g, e_14, _h, e_15, _j, e_16, _k, e_17, _l, e_18, _m, e_19, _o, e_20, _p, e_21, _q, e_22, _r, e_23, _s, e_24, _t;
        var _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
        // Strategy taken from https://www.bvssolitaire.com/rules/klondike-solitaire-strategy.htm
        console.log("Choosing move...");
        try {
            // Tip 1: We assume that a card from the draw pile is always turned up, as long as the
            //        drawpile isn't empty.
            // Tip 2A: Move available cards (Aces and Deuces) from play pile to foundation pile
            for (var _6 = __values(this._playPiles.entries()), _7 = _6.next(); !_7.done; _7 = _6.next()) {
                var _8 = __read(_7.value, 2), playPileIndex = _8[0], playPile = _8[1];
                if (((_u = playPile.top) === null || _u === void 0 ? void 0 : _u.value) === "Ace" || ((_v = playPile.top) === null || _v === void 0 ? void 0 : _v.value) === 2) {
                    try {
                        for (var _9 = (e_8 = void 0, __values(this._foundationPiles.entries())), _10 = _9.next(); !_10.done; _10 = _9.next()) {
                            var _11 = __read(_10.value, 2), foundationPileIndex = _11[0], foundationPile = _11[1];
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
                            if (_10 && !_10.done && (_b = _9.return)) _b.call(_9);
                        }
                        finally { if (e_8) throw e_8.error; }
                    }
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_7 && !_7.done && (_a = _6.return)) _a.call(_6);
            }
            finally { if (e_7) throw e_7.error; }
        }
        // Tip 2B: Move available cards (Aces and Deuces) from draw pile to foundation pile
        if (((_w = this.drawPile.top) === null || _w === void 0 ? void 0 : _w.value) === "Ace" || ((_x = this.drawPile.top) === null || _x === void 0 ? void 0 : _x.value) === 2) {
            try {
                for (var _12 = __values(this._foundationPiles.entries()), _13 = _12.next(); !_13.done; _13 = _12.next()) {
                    var _14 = __read(_13.value, 2), pileIndex = _14[0], pile = _14[1];
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
                    if (_13 && !_13.done && (_c = _12.return)) _c.call(_12);
                }
                finally { if (e_9) throw e_9.error; }
            }
        }
        var numKings = null;
        var blackKing = false;
        var redKing = false;
        var blackQueen = false;
        var redQueen = false;
        if (this.replacementKing()) {
            //tjekker drawpile
            if (((_y = this.drawPile.top) === null || _y === void 0 ? void 0 : _y.value) === "King") {
                numKings++;
                if (((_z = this.drawPile.top) === null || _z === void 0 ? void 0 : _z.suit) === ("Hearts" || "Diamonds")) {
                    redKing = true;
                }
                else {
                    blackKing = true;
                }
            }
            try {
                //tjekker playpile
                for (var _15 = __values(this._playPiles.entries()), _16 = _15.next(); !_16.done; _16 = _15.next()) {
                    var _17 = __read(_16.value, 2), index = _17[0], playPile = _17[1];
                    var visible = playPile.getVisibleCards();
                    var bottom = visible[0];
                    if (bottom) {
                        if (bottom.value === "King") {
                            numKings++;
                            if (bottom.suit === ("Hearts" || "Diamonds")) {
                                redKing = true;
                            }
                            else {
                                blackKing = true;
                            }
                        }
                        else if (bottom.value === "Queen") {
                            if (bottom.suit === ("Hearts" || "Diamonds")) {
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
                    if (_16 && !_16.done && (_d = _15.return)) _d.call(_15);
                }
                finally { if (e_10) throw e_10.error; }
            }
        }
        if (blackKing && redKing && redQueen && !blackQueen) {
            console.log(" 1 move black king");
            var hiddenCardsBehindKing = null;
            var viableKingMove = null;
            try {
                for (var _18 = __values(this._playPiles.entries()), _19 = _18.next(); !_19.done; _19 = _18.next()) {
                    var _20 = __read(_19.value, 2), targetIndex = _20[0], targetPile = _20[1];
                    if (targetPile.empty) {
                        try {
                            for (var _21 = (e_12 = void 0, __values(this._playPiles.entries())), _22 = _21.next(); !_22.done; _22 = _21.next()) {
                                var _23 = __read(_22.value, 2), index = _23[0], pile = _23[1];
                                //giver fejl (value undefined)- der skal være hidden cards
                                var visible = pile.getVisibleCards();
                                var bottom = visible[0];
                                if (bottom &&
                                    bottom.value === "King"
                                    //kun sorte kort
                                    && (bottom.suit === ("Clubs" || "Spades"))
                                    &&
                                        (viableKingMove === null ||
                                            hiddenCardsBehindKing === null ||
                                            pile.numberHiddenCards() >= hiddenCardsBehindKing)) {
                                    hiddenCardsBehindKing = pile.numberHiddenCards();
                                    // A King isn't moved if there aren't any hidden cards behind it
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
                        }
                        catch (e_12_1) { e_12 = { error: e_12_1 }; }
                        finally {
                            try {
                                if (_22 && !_22.done && (_f = _21.return)) _f.call(_21);
                            }
                            finally { if (e_12) throw e_12.error; }
                        }
                        if (viableKingMove) {
                            console.log("playpile black king to empty playpile");
                            return viableKingMove;
                        }
                    }
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (_19 && !_19.done && (_e = _18.return)) _e.call(_18);
                }
                finally { if (e_11) throw e_11.error; }
            }
            // Tip 5: Move King from draw pile to empty play pile
            if (((_0 = this.drawPile.top) === null || _0 === void 0 ? void 0 : _0.value) === "King"
                //kun sorte kort
                && (((_1 = this.drawPile.top) === null || _1 === void 0 ? void 0 : _1.suit) === ("Clubs" || "Spades"))) {
                try {
                    for (var _24 = __values(this._playPiles.entries()), _25 = _24.next(); !_25.done; _25 = _24.next()) {
                        var _26 = __read(_25.value, 2), index = _26[0], pile = _26[1];
                        if (pile.empty) {
                            console.log("drawpile black king to empty playpile");
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
                        if (_25 && !_25.done && (_g = _24.return)) _g.call(_24);
                    }
                    finally { if (e_13) throw e_13.error; }
                }
            }
        }
        else if (blackKing && redKing && !redQueen && blackQueen) {
            console.log(" 1 move red king");
            var hiddenCardsBehindKing = null;
            var viableKingMove = null;
            try {
                for (var _27 = __values(this._playPiles.entries()), _28 = _27.next(); !_28.done; _28 = _27.next()) {
                    var _29 = __read(_28.value, 2), targetIndex = _29[0], targetPile = _29[1];
                    if (targetPile.empty) {
                        try {
                            for (var _30 = (e_15 = void 0, __values(this._playPiles.entries())), _31 = _30.next(); !_31.done; _31 = _30.next()) {
                                var _32 = __read(_31.value, 2), index = _32[0], pile = _32[1];
                                //giver fejl (value undefined)- der skal være hidden cards
                                var visible = pile.getVisibleCards();
                                var bottom = visible[0];
                                if (bottom &&
                                    bottom.value === "King"
                                    //kun røde kort
                                    && (bottom.suit === ("Diamonds" || "Hearts"))
                                    &&
                                        (viableKingMove === null ||
                                            hiddenCardsBehindKing === null ||
                                            pile.numberHiddenCards() >= hiddenCardsBehindKing)) {
                                    hiddenCardsBehindKing = pile.numberHiddenCards();
                                    // A King isn't moved if there aren't any hidden cards behind it
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
                        }
                        catch (e_15_1) { e_15 = { error: e_15_1 }; }
                        finally {
                            try {
                                if (_31 && !_31.done && (_j = _30.return)) _j.call(_30);
                            }
                            finally { if (e_15) throw e_15.error; }
                        }
                        if (viableKingMove) {
                            console.log("drawpile red king to empty playpile");
                            return viableKingMove;
                        }
                    }
                }
            }
            catch (e_14_1) { e_14 = { error: e_14_1 }; }
            finally {
                try {
                    if (_28 && !_28.done && (_h = _27.return)) _h.call(_27);
                }
                finally { if (e_14) throw e_14.error; }
            }
            // Tip 5: Move King from draw pile to empty play pile
            if (((_2 = this.drawPile.top) === null || _2 === void 0 ? void 0 : _2.value) === "King"
                //kun røde kort
                && (((_3 = this.drawPile.top) === null || _3 === void 0 ? void 0 : _3.suit) === ("Diamonds" || "Hearts"))) {
                try {
                    for (var _33 = __values(this._playPiles.entries()), _34 = _33.next(); !_34.done; _34 = _33.next()) {
                        var _35 = __read(_34.value, 2), index = _35[0], pile = _35[1];
                        if (pile.empty) {
                            console.log("drawpile red king to empty playpile");
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
                catch (e_16_1) { e_16 = { error: e_16_1 }; }
                finally {
                    try {
                        if (_34 && !_34.done && (_k = _33.return)) _k.call(_33);
                    }
                    finally { if (e_16) throw e_16.error; }
                }
            }
        }
        else {
            // Tip 5: Move King from play pile to empty play pile
            var hiddenCardsBehindKing = null;
            var viableKingMove = null;
            try {
                for (var _36 = __values(this._playPiles.entries()), _37 = _36.next(); !_37.done; _37 = _36.next()) {
                    var _38 = __read(_37.value, 2), targetIndex = _38[0], targetPile = _38[1];
                    if (targetPile.empty) {
                        try {
                            for (var _39 = (e_18 = void 0, __values(this._playPiles.entries())), _40 = _39.next(); !_40.done; _40 = _39.next()) {
                                var _41 = __read(_40.value, 2), index = _41[0], pile = _41[1];
                                //giver fejl (value undefined)- der skal være hidden cards
                                var visible = pile.getVisibleCards();
                                var bottom = visible[0];
                                if (bottom &&
                                    bottom.value === "King"
                                    &&
                                        (viableKingMove === null ||
                                            hiddenCardsBehindKing === null ||
                                            pile.numberHiddenCards() >= hiddenCardsBehindKing)) {
                                    hiddenCardsBehindKing = pile.numberHiddenCards();
                                    // A King isn't moved if there aren't any hidden cards behind it
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
                        }
                        catch (e_18_1) { e_18 = { error: e_18_1 }; }
                        finally {
                            try {
                                if (_40 && !_40.done && (_m = _39.return)) _m.call(_39);
                            }
                            finally { if (e_18) throw e_18.error; }
                        }
                        if (viableKingMove) {
                            console.log("playpile king to empty playpile");
                            return viableKingMove;
                        }
                    }
                }
            }
            catch (e_17_1) { e_17 = { error: e_17_1 }; }
            finally {
                try {
                    if (_37 && !_37.done && (_l = _36.return)) _l.call(_36);
                }
                finally { if (e_17) throw e_17.error; }
            }
            // Tip 5: Move King from draw pile to empty play pile
            if (((_4 = this.drawPile.top) === null || _4 === void 0 ? void 0 : _4.value) === "King") {
                try {
                    for (var _42 = __values(this._playPiles.entries()), _43 = _42.next(); !_43.done; _43 = _42.next()) {
                        var _44 = __read(_43.value, 2), index = _44[0], pile = _44[1];
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
                catch (e_19_1) { e_19 = { error: e_19_1 }; }
                finally {
                    try {
                        if (_43 && !_43.done && (_o = _42.return)) _o.call(_42);
                    }
                    finally { if (e_19) throw e_19.error; }
                }
            }
        }
        // Tip 3: Expose hidden cards from the play pile with the most hidden cards
        var hiddenCards = null;
        var viableMove = null;
        var fromString = "";
        var toString = "";
        try {
            for (var _45 = __values(this._playPiles.entries()), _46 = _45.next(); !_46.done; _46 = _45.next()) {
                var _47 = __read(_46.value, 2), index = _47[0], pile = _47[1];
                if (!pile.empty) {
                    var visibleCards = pile.getVisibleCards();
                    var bottom = visibleCards[0];
                    if (bottom) {
                        try {
                            // Now we check if this bottom card can be moved somewhere else
                            for (var _48 = (e_21 = void 0, __values(this._playPiles.entries())), _49 = _48.next(); !_49.done; _49 = _48.next()) {
                                var _50 = __read(_49.value, 2), targetIndex = _50[0], targetPile = _50[1];
                                if (targetIndex !== index &&
                                    targetPile.canAdd(bottom) &&
                                    (viableMove === null ||
                                        hiddenCards === null ||
                                        pile.numberHiddenCards() >= hiddenCards)) {
                                    hiddenCards = pile.numberHiddenCards();
                                    // Tip 5: A play pile is only emptied if there is a King to put in it
                                    if (hiddenCards !== 0 || this.replacementKing()) {
                                        if (bottom.value !== "King" || (bottom.value === "King" && hiddenCards !== 0)) {
                                            fromString = bottom.toString();
                                            toString = (_5 = targetPile.top) === null || _5 === void 0 ? void 0 : _5.toString();
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
                        }
                        catch (e_21_1) { e_21 = { error: e_21_1 }; }
                        finally {
                            try {
                                if (_49 && !_49.done && (_q = _48.return)) _q.call(_48);
                            }
                            finally { if (e_21) throw e_21.error; }
                        }
                    }
                }
            }
        }
        catch (e_20_1) { e_20 = { error: e_20_1 }; }
        finally {
            try {
                if (_46 && !_46.done && (_p = _45.return)) _p.call(_45);
            }
            finally { if (e_20) throw e_20.error; }
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
                for (var _51 = __values(this._playPiles.entries()), _52 = _51.next(); !_52.done; _52 = _51.next()) {
                    var _53 = __read(_52.value, 2), index = _53[0], pile = _53[1];
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
            catch (e_22_1) { e_22 = { error: e_22_1 }; }
            finally {
                try {
                    if (_52 && !_52.done && (_r = _51.return)) _r.call(_51);
                }
                finally { if (e_22) throw e_22.error; }
            }
        }
        try {
            // Tip 6: If you have a choice between a black King and a red King to fill a space with,
            //        be cautious in your decision. Look at the color of the blocking cards and make the
            //        appropriate color choice. For example, if you have a red Jack that blocks some hidden
            //        cards, you have to select a red King and than wait for a black Queen.
            // Move cards from play piles and draw pile to foundation
            // TODO: extra checks before moving cards (e.g. cards from one red suit and one black suit
            // "buddy up")
            for (var _54 = __values(this._foundationPiles.entries()), _55 = _54.next(); !_55.done; _55 = _54.next()) {
                var _56 = __read(_55.value, 2), foundationIndex = _56[0], foundationPile = _56[1];
                if (foundationPile.top) {
                    try {
                        for (var _57 = (e_24 = void 0, __values(this._playPiles.entries())), _58 = _57.next(); !_58.done; _58 = _57.next()) {
                            var _59 = __read(_58.value, 2), playIndex = _59[0], playPile = _59[1];
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
                    catch (e_24_1) { e_24 = { error: e_24_1 }; }
                    finally {
                        try {
                            if (_58 && !_58.done && (_t = _57.return)) _t.call(_57);
                        }
                        finally { if (e_24) throw e_24.error; }
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
        catch (e_23_1) { e_23 = { error: e_23_1 }; }
        finally {
            try {
                if (_55 && !_55.done && (_s = _54.return)) _s.call(_54);
            }
            finally { if (e_23) throw e_23.error; }
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
        //No moves possible
        console.log("No move was possible");
        console.log("You lost, ignore errors");
        return null;
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
/*
const g = new Game();
g.printStatus();

while (g.gameOver === false) {
  g.doMove(g.suggestMove());
  
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


  g.printStatus();
  if (g.isGameWon()) g.gameOver = true;
}
if (g.isGameWon()) console.log(`Congratulations, you won!`);
else if (!g.isGameWon()) console.log(`Dumbass, you lost.`);
*/
var i = 0;
var gamesWon = 0;
while (i < 2000) {
    var numMoves = 0;
    var g = new Game();
    while (true) {
        g.printStatus();
        g.doMove(g.suggestMove());
        numMoves++;
        console.log(numMoves);
        //limit to moves
        if (numMoves > 500) {
            break;
        }
        if (g.isGameWon()) {
            gamesWon++;
            break;
        }
    }
    i++;
    console.log("Games won " + (gamesWon / i) * 100 + " %. Total games " + i + ". Total games won = " + gamesWon);
}
/*
const g = new Game()
let drawShift = 0;
g.printStatus();

while (g.gameOver === false) {
  const move = g.suggestMove()
  if (move) {
    g.doMove(move)
    if (move.from.pile === "draw" && move.to.pile === "draw") {
      drawShift++;
      console.log(`The draw pile has been shifted ${drawShift} time(s) in a row.`)
    } else drawShift = 0;
    g.printStatus()
  } else g.gameOver = true
  if (g.isGameWon()) g.gameOver = true
}

if (g.isGameWon()) console.log(`Congratulations, you won!`);
else if (!g.isGameWon()) console.log(`Dumbass, you lost.`);
*/ 
//# sourceMappingURL=card-thing.js.map