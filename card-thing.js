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
        this.getVisibleCards = function () {
            var e_1, _a;
            var visibleCards = [];
            try {
                for (var _b = __values(_this.cards), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var card = _c.value;
                    if (card.visible)
                        visibleCards.push(card);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return visibleCards !== null && visibleCards !== void 0 ? visibleCards : [];
        };
        this.numberHiddenCards = function () { return _this.cards.filter(function (c) { return !c.visible; }).length; };
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
    return Pile;
}());
var FoundationPile = /** @class */ (function (_super) {
    __extends(FoundationPile, _super);
    function FoundationPile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.canAdd = function (card) {
            return (_this.top === null && card.value === "Ace") ||
                (card.suit === _this.top.suit &&
                    isValueNextOnResult(_this.top.value, card.value));
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
            return (_this.top === null && card.value === "King") ||
                (isSuitOpposite(_this.top.suit, card.suit) &&
                    isValueNextOnPlay(_this.top.value, card.value));
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
            _this.index = (_this.index + 1) % (_this.cards.length - 1);
            return cardRemoved;
        };
        _this.shift = function () {
            return (_this.index = (_this.index + 1) % (_this.cards.length - 1));
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
        var e_2, _a, e_3, _b, e_4, _c, e_5, _d;
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
                    for (var values_1 = (e_3 = void 0, __values(values)), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
                        var value = values_1_1.value;
                        allCards.push(new Card(suit, value));
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (values_1_1 && !values_1_1.done && (_b = values_1.return)) _b.call(values_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (suits_1_1 && !suits_1_1.done && (_a = suits_1.return)) _a.call(suits_1);
            }
            finally { if (e_2) throw e_2.error; }
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
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_c = _e.return)) _c.call(_e);
            }
            finally { if (e_4) throw e_4.error; }
        }
        try {
            // And da rest in da draw
            for (var shuffld_1 = __values(shuffld), shuffld_1_1 = shuffld_1.next(); !shuffld_1_1.done; shuffld_1_1 = shuffld_1.next()) {
                var card = shuffld_1_1.value;
                card.visible = true;
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (shuffld_1_1 && !shuffld_1_1.done && (_d = shuffld_1.return)) _d.call(shuffld_1);
            }
            finally { if (e_5) throw e_5.error; }
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
            .map(function (p) { var _a, _b; return (_b = (_a = p.top) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "Empty"; })
            .reduce(function (pV, v) { return pV + " " + v; }) + "\n\n");
    };
    Game.prototype.doMove = function (_a) {
        var _this = this;
        var _b;
        var from = _a.from, to = _a.to, _c = _a.amount, amount = _c === void 0 ? 1 : _c;
        var _d = __read([from, to].map(function (m) { return _this.getPile(m); }), 2), fromPile = _d[0], toPile = _d[1];
        if (!fromPile || !toPile)
            throw new Error("Could not find pile for move " + JSON.stringify({
                from: from,
                to: to,
            }));
        if (amount > 1) {
            var cards = fromPile.removeSeveral(amount);
            if (!toPile.canAdd(cards[0]))
                throw new Error("Illegal move, pile for move " + JSON.stringify({
                    from: from,
                    to: to,
                }) + " cannot recive card " + cards
                    .map(function (c) { return c.toString(); })
                    .reduce(function (pV, v) { return pV + " " + v; }) + "\n                    , stack is currently " + toPile.toString());
            toPile.addSeveral(cards);
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
        }
        //gav fejl
        if (((_b = fromPile.top) === null || _b === void 0 ? void 0 : _b.visible) === false)
            fromPile.top.visible = true;
    };
    Game.prototype.suggestMove = function () {
        var e_6, _a, e_7, _b, e_8, _c, e_9, _d, e_10, _e, e_11, _f, e_12, _g, e_13, _h, e_14, _j, e_15, _k, e_16, _l, e_17, _m;
        var _o, _p, _q, _r, _s;
        console.log("choosing move");
        try {
            // Step 1a: available cards(aces and deuces) from drawpile to foundation
            for (var _t = __values(this._foundationPiles.entries()), _u = _t.next(); !_u.done; _u = _t.next()) {
                var _v = __read(_u.value, 2), pileIndex = _v[0], pile = _v[1];
                var top_1 = pile.top;
                if (top_1) {
                    var suit = top_1.suit, value = top_1.value;
                    var drawPileTop = this.drawPile.top;
                    if (drawPileTop.value === 2 && value === 2 && drawPileTop.suit === suit) {
                        console.log("Drawpile deuce to foundation");
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
                    else if (drawPileTop.value === "Ace") {
                        console.log("Drawpile ace to foundation");
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
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_u && !_u.done && (_a = _t.return)) _a.call(_t);
            }
            finally { if (e_6) throw e_6.error; }
        }
        try {
            // Step 1b: available cards(aces and deuces) from playpile to foundation
            for (var _w = __values(this._foundationPiles.entries()), _x = _w.next(); !_x.done; _x = _w.next()) {
                var _y = __read(_x.value, 2), pileIndex = _y[0], pile = _y[1];
                var top_2 = pile.top;
                if (top_2) {
                    var suit = top_2.suit, value = top_2.value;
                    try {
                        for (var _z = (e_8 = void 0, __values(this._playPiles.entries())), _0 = _z.next(); !_0.done; _0 = _z.next()) {
                            var _1 = __read(_0.value, 2), index = _1[0], playPile = _1[1];
                            if (((_o = playPile.top) === null || _o === void 0 ? void 0 : _o.suit) === suit &&
                                isValueNextOnResult((_p = playPile.top) === null || _p === void 0 ? void 0 : _p.value, value)) {
                                console.log("Playpile() to foundation");
                                return {
                                    from: {
                                        pile: "play",
                                        index: index,
                                    },
                                    to: {
                                        pile: "foundation",
                                        index: pileIndex,
                                    },
                                };
                            }
                        }
                    }
                    catch (e_8_1) { e_8 = { error: e_8_1 }; }
                    finally {
                        try {
                            if (_0 && !_0.done && (_c = _z.return)) _c.call(_z);
                        }
                        finally { if (e_8) throw e_8.error; }
                    }
                }
                else {
                    try {
                        for (var _2 = (e_9 = void 0, __values(this._playPiles.entries())), _3 = _2.next(); !_3.done; _3 = _2.next()) {
                            var _4 = __read(_3.value, 2), index = _4[0], playPile = _4[1];
                            if (((_q = playPile.top) === null || _q === void 0 ? void 0 : _q.value) === "Ace") {
                                console.log("Playpile ace to foundation");
                                return {
                                    from: {
                                        pile: "play",
                                        index: index,
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
                            if (_3 && !_3.done && (_d = _2.return)) _d.call(_2);
                        }
                        finally { if (e_9) throw e_9.error; }
                    }
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_x && !_x.done && (_b = _w.return)) _b.call(_w);
            }
            finally { if (e_7) throw e_7.error; }
        }
        //Step 2 : move drawpile king to empty playpile
        if (this.drawPile.top.value === "King") {
            var isPlayPileEmpty_1 = false;
            var emptyPlayPile_1 = null;
            try {
                for (var _5 = __values(this._playPiles.entries()), _6 = _5.next(); !_6.done; _6 = _5.next()) {
                    var _7 = __read(_6.value, 2), index = _7[0], pile = _7[1];
                    if (pile.top === null) {
                        isPlayPileEmpty_1 = true;
                        emptyPlayPile_1 = index;
                        console.log("drawpile king to empty playpile");
                        return {
                            from: {
                                pile: "draw",
                                index: 0,
                            },
                            to: {
                                pile: "play",
                                index: emptyPlayPile_1,
                            },
                        };
                    }
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (_6 && !_6.done && (_e = _5.return)) _e.call(_5);
                }
                finally { if (e_10) throw e_10.error; }
            }
        }
        //Step 2a: move playpile king to empty playpile
        var isPlayPileEmpty = false;
        var emptyPlayPile = null;
        try {
            for (var _8 = __values(this._playPiles.entries()), _9 = _8.next(); !_9.done; _9 = _8.next()) {
                var _10 = __read(_9.value, 2), index = _10[0], pile = _10[1];
                if (pile.top === null) {
                    isPlayPileEmpty = true;
                    emptyPlayPile = index;
                    try {
                        for (var _11 = (e_12 = void 0, __values(this._playPiles.entries())), _12 = _11.next(); !_12.done; _12 = _11.next()) {
                            var _13 = __read(_12.value, 2), index_1 = _13[0], pile_1 = _13[1];
                            var hiddenCards_1 = null;
                            //giver fejl (value undefined)- der skal være hidden cards 
                            if (pile_1.numberHiddenCards() > hiddenCards_1) {
                                var visible = pile_1.getVisibleCards();
                                var bottom = visible[visible.length - 1];
                                if (bottom) {
                                    if (bottom.value === "King") {
                                        console.log("Playpile card king to empty playpile");
                                        return {
                                            from: {
                                                pile: "play",
                                                index: index_1,
                                            },
                                            to: {
                                                pile: "play",
                                                index: emptyPlayPile,
                                            },
                                            amount: visible.length
                                        };
                                    }
                                }
                            }
                        }
                    }
                    catch (e_12_1) { e_12 = { error: e_12_1 }; }
                    finally {
                        try {
                            if (_12 && !_12.done && (_g = _11.return)) _g.call(_11);
                        }
                        finally { if (e_12) throw e_12.error; }
                    }
                }
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_9 && !_9.done && (_f = _8.return)) _f.call(_8);
            }
            finally { if (e_11) throw e_11.error; }
        }
        // Step 2b: expose hidden cards from column with the most hidden cards
        var hiddenCards = null;
        var viableMove = null;
        var fromString = "";
        var toString = "";
        try {
            for (var _14 = __values(this._playPiles.entries()), _15 = _14.next(); !_15.done; _15 = _14.next()) {
                var _16 = __read(_15.value, 2), index = _16[0], pile = _16[1];
                if (hiddenCards === null || pile.numberHiddenCards() > hiddenCards) {
                    var visible = pile.getVisibleCards();
                    //problemer med nedenstående
                    var bottom = visible[visible.length - 1];
                    if (bottom) {
                        try {
                            // Now we check if this bottom card can be moved somewhere else
                            for (var _17 = (e_14 = void 0, __values(this._playPiles.entries())), _18 = _17.next(); !_18.done; _18 = _17.next()) {
                                var _19 = __read(_18.value, 2), targetIndex = _19[0], targetPile = _19[1];
                                if (targetIndex !== index && targetPile.canAdd(bottom)) {
                                    fromString = bottom.value + " of " + bottom.suit;
                                    toString = targetPile.top.value + " of " + targetPile.top.suit;
                                    viableMove = {
                                        from: {
                                            pile: "play",
                                            index: index,
                                        },
                                        to: {
                                            pile: "play",
                                            index: targetIndex,
                                        },
                                        amount: visible.length
                                    };
                                    break;
                                }
                            }
                        }
                        catch (e_14_1) { e_14 = { error: e_14_1 }; }
                        finally {
                            try {
                                if (_18 && !_18.done && (_j = _17.return)) _j.call(_17);
                            }
                            finally { if (e_14) throw e_14.error; }
                        }
                    }
                }
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_15 && !_15.done && (_h = _14.return)) _h.call(_14);
            }
            finally { if (e_13) throw e_13.error; }
        }
        if (viableMove) {
            console.log("Playpile card(" + fromString + ") to other playpile card " + toString);
            return viableMove;
        }
        // Step 3: The best move provides you opportunity to make other moves or expose hidden cards
        // We see if a card from the draw pile can be added to the play piles
        var topDraw = this._drawPile.top;
        if (topDraw) {
            try {
                for (var _20 = __values(this._playPiles.entries()), _21 = _20.next(); !_21.done; _21 = _20.next()) {
                    var _22 = __read(_21.value, 2), index = _22[0], pile = _22[1];
                    if (pile.canAdd(topDraw)) {
                        console.log("Drawpile card to playpile");
                        return {
                            from: {
                                pile: "draw",
                                index: 0
                            },
                            to: {
                                pile: "play",
                                index: index
                            },
                        };
                    }
                }
            }
            catch (e_15_1) { e_15 = { error: e_15_1 }; }
            finally {
                try {
                    if (_21 && !_21.done && (_k = _20.return)) _k.call(_20);
                }
                finally { if (e_15) throw e_15.error; }
            }
        }
        try {
            // Step 4: Don't empty a tableau pile without a King to replace.
            //tjek for konger i alle byggestabler med skjulte kort og i dækket.
            // Step 5: Consider carefully whether to fill a space with a  black King or a red King
            // Step 6: Move top cards to foundation
            for (var _23 = __values(this._foundationPiles.entries()), _24 = _23.next(); !_24.done; _24 = _23.next()) {
                var _25 = __read(_24.value, 2), pileIndex = _25[0], pile = _25[1];
                var top_3 = pile.top;
                if (top_3) {
                    var suit = top_3.suit, value = top_3.value;
                    try {
                        for (var _26 = (e_17 = void 0, __values(this._playPiles.entries())), _27 = _26.next(); !_27.done; _27 = _26.next()) {
                            var _28 = __read(_27.value, 2), index = _28[0], playPile = _28[1];
                            if (((_r = playPile.top) === null || _r === void 0 ? void 0 : _r.suit) === suit &&
                                isValueNextOnResult((_s = playPile.top) === null || _s === void 0 ? void 0 : _s.value, value)) {
                                console.log("Playpile cards to foundation");
                                return {
                                    from: {
                                        pile: "play",
                                        index: index,
                                    },
                                    to: {
                                        pile: "foundation",
                                        index: pileIndex,
                                    },
                                };
                            }
                        }
                    }
                    catch (e_17_1) { e_17 = { error: e_17_1 }; }
                    finally {
                        try {
                            if (_27 && !_27.done && (_m = _26.return)) _m.call(_26);
                        }
                        finally { if (e_17) throw e_17.error; }
                    }
                }
            }
        }
        catch (e_16_1) { e_16 = { error: e_16_1 }; }
        finally {
            try {
                if (_24 && !_24.done && (_l = _23.return)) _l.call(_23);
            }
            finally { if (e_16) throw e_16.error; }
        }
        //No moves possible
        console.log("No move was possible");
        console.log("You lost, ignore errors");
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