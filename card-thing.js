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
    Object.defineProperty(Pile.prototype, "oneCardLeft", {
        get: function () {
            return this.cards.length === 1;
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
            _this.index = _this.index === 0 ? 0 : _this.index - 1;
            return cardRemoved;
        };
        _this.shift = function () {
            return (_this.index =
                _this.cards.length === 1 ? 0 : (_this.index + 1) % _this.cards.length);
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
            //console.log(`Shifting draw pile.`);
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
            /* console.log(
              `Moving ${cards
                .map((c) => c.toString())
                .reduce((pV, v) => `${pV} ${v}`)} from pile: ${from.pile} ${
                from.index + 1
              }, to pile: ${to.pile} ${to.index + 1}.`
            ); */
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
            /* console.log(
              `Moving ${card.toString()} from pile: ${from.pile} ${
                from.index + 1
              }, to pile: ${to.pile} ${to.index + 1}.`
            ); */
        }
        //gav fejl
        if (fromPile.top && !fromPile.top.visible)
            fromPile.top.visible = true;
    };
    Game.prototype.replacementKing = function () {
        var e_5, _a;
        if (this._drawPile.top && this._drawPile.top.value === "King")
            return true;
        else {
            try {
                for (var _b = __values(this._playPiles), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var pile = _c.value;
                    var bottom = pile.getVisibleCards()[0];
                    var hiddenCards = pile.numberHiddenCards();
                    if (bottom && bottom.value === "King" && hiddenCards !== 0)
                        return true;
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_5) throw e_5.error; }
            }
        }
        return false;
    };
    Game.prototype.suggestMove = function () {
        // Strategy taken from https://www.bvssolitaire.com/rules/klondike-solitaire-strategy.htm
        // console.log("Choosing move...\n");
        // Tip 1: We assume that a card from the draw pile is always turned up, as long as the
        //        drawpile isn't empty.
        var e_6, _a, e_7, _b, e_8, _c, e_9, _d, e_10, _e, e_11, _f, e_12, _g, e_13, _h, e_14, _j, e_15, _k, e_16, _l;
        var _m, _o, _p, _q, _r;
        try {
            // Tip 2A: Move available cards (Aces and Deuces) from play pile to foundation pile
            for (var _s = __values(this._playPiles.entries()), _t = _s.next(); !_t.done; _t = _s.next()) {
                var _u = __read(_t.value, 2), playPileIndex = _u[0], playPile = _u[1];
                if (((_m = playPile.top) === null || _m === void 0 ? void 0 : _m.value) === "Ace" || ((_o = playPile.top) === null || _o === void 0 ? void 0 : _o.value) === 2) {
                    try {
                        for (var _v = (e_7 = void 0, __values(this._foundationPiles.entries())), _w = _v.next(); !_w.done; _w = _v.next()) {
                            var _x = __read(_w.value, 2), foundationPileIndex = _x[0], foundationPile = _x[1];
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
                    catch (e_7_1) { e_7 = { error: e_7_1 }; }
                    finally {
                        try {
                            if (_w && !_w.done && (_b = _v.return)) _b.call(_v);
                        }
                        finally { if (e_7) throw e_7.error; }
                    }
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_t && !_t.done && (_a = _s.return)) _a.call(_s);
            }
            finally { if (e_6) throw e_6.error; }
        }
        // Tip 2B: Move available cards (Aces and Deuces) from draw pile to foundation pile
        if (((_p = this.drawPile.top) === null || _p === void 0 ? void 0 : _p.value) === "Ace" || ((_q = this.drawPile.top) === null || _q === void 0 ? void 0 : _q.value) === 2) {
            try {
                for (var _y = __values(this._foundationPiles.entries()), _z = _y.next(); !_z.done; _z = _y.next()) {
                    var _0 = __read(_z.value, 2), pileIndex = _0[0], pile = _0[1];
                    if (pile.canAdd(this.drawPile.top)) {
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
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_z && !_z.done && (_c = _y.return)) _c.call(_y);
                }
                finally { if (e_8) throw e_8.error; }
            }
        }
        // Tip 5: Move King from play pile to empty play pile
        var hiddenCardsBehindKing = null;
        var viableKingMove = null;
        try {
            for (var _1 = __values(this._playPiles.entries()), _2 = _1.next(); !_2.done; _2 = _1.next()) {
                var _3 = __read(_2.value, 2), targetIndex = _3[0], targetPile = _3[1];
                if (targetPile.empty) {
                    try {
                        for (var _4 = (e_10 = void 0, __values(this._playPiles.entries())), _5 = _4.next(); !_5.done; _5 = _4.next()) {
                            var _6 = __read(_5.value, 2), index = _6[0], pile = _6[1];
                            //giver fejl (value undefined)- der skal være hidden cards
                            var visible = pile.getVisibleCards();
                            var bottom = visible[0];
                            if (bottom &&
                                bottom.value === "King" &&
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
                    catch (e_10_1) { e_10 = { error: e_10_1 }; }
                    finally {
                        try {
                            if (_5 && !_5.done && (_e = _4.return)) _e.call(_4);
                        }
                        finally { if (e_10) throw e_10.error; }
                    }
                    if (viableKingMove)
                        return viableKingMove;
                }
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_2 && !_2.done && (_d = _1.return)) _d.call(_1);
            }
            finally { if (e_9) throw e_9.error; }
        }
        // Tip 5: Move King from draw pile to empty play pile
        if (((_r = this.drawPile.top) === null || _r === void 0 ? void 0 : _r.value) === "King") {
            try {
                for (var _7 = __values(this._playPiles.entries()), _8 = _7.next(); !_8.done; _8 = _7.next()) {
                    var _9 = __read(_8.value, 2), index = _9[0], pile = _9[1];
                    if (pile.empty) {
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
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (_8 && !_8.done && (_f = _7.return)) _f.call(_7);
                }
                finally { if (e_11) throw e_11.error; }
            }
        }
        // Tip 3: Expose hidden cards from the play pile with the most hidden cards
        var hiddenCards = null;
        var viableMove = null;
        try {
            for (var _10 = __values(this._playPiles.entries()), _11 = _10.next(); !_11.done; _11 = _10.next()) {
                var _12 = __read(_11.value, 2), index = _12[0], pile = _12[1];
                if (!pile.empty) {
                    var visibleCards = pile.getVisibleCards();
                    var bottom = visibleCards[0];
                    if (bottom) {
                        try {
                            // Now we check if this bottom card can be moved somewhere else
                            for (var _13 = (e_13 = void 0, __values(this._playPiles.entries())), _14 = _13.next(); !_14.done; _14 = _13.next()) {
                                var _15 = __read(_14.value, 2), targetIndex = _15[0], targetPile = _15[1];
                                if (targetIndex !== index &&
                                    targetPile.canAdd(bottom) &&
                                    (viableMove === null ||
                                        hiddenCards === null ||
                                        pile.numberHiddenCards() >= hiddenCards)) {
                                    hiddenCards = pile.numberHiddenCards();
                                    // Tip 5: A play pile is only emptied if there is a King to put in it
                                    if (hiddenCards !== 0 || this.replacementKing()) {
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
                        catch (e_13_1) { e_13 = { error: e_13_1 }; }
                        finally {
                            try {
                                if (_14 && !_14.done && (_h = _13.return)) _h.call(_13);
                            }
                            finally { if (e_13) throw e_13.error; }
                        }
                    }
                }
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_11 && !_11.done && (_g = _10.return)) _g.call(_10);
            }
            finally { if (e_12) throw e_12.error; }
        }
        if (viableMove)
            return viableMove;
        // Tip 3: The best move provides you opportunity to make other moves or expose hidden cards
        // We see if a card from the draw pile can be added to the play piles
        var topDraw = this._drawPile.top;
        if (topDraw) {
            try {
                for (var _16 = __values(this._playPiles.entries()), _17 = _16.next(); !_17.done; _17 = _16.next()) {
                    var _18 = __read(_17.value, 2), index = _18[0], pile = _18[1];
                    if (pile.canAdd(topDraw)) {
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
            catch (e_14_1) { e_14 = { error: e_14_1 }; }
            finally {
                try {
                    if (_17 && !_17.done && (_j = _16.return)) _j.call(_16);
                }
                finally { if (e_14) throw e_14.error; }
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
            for (var _19 = __values(this._foundationPiles.entries()), _20 = _19.next(); !_20.done; _20 = _19.next()) {
                var _21 = __read(_20.value, 2), foundationIndex = _21[0], foundationPile = _21[1];
                if (foundationPile.top) {
                    try {
                        for (var _22 = (e_16 = void 0, __values(this._playPiles.entries())), _23 = _22.next(); !_23.done; _23 = _22.next()) {
                            var _24 = __read(_23.value, 2), playIndex = _24[0], playPile = _24[1];
                            if (playPile.top && foundationPile.canAdd(playPile.top)) {
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
                    catch (e_16_1) { e_16 = { error: e_16_1 }; }
                    finally {
                        try {
                            if (_23 && !_23.done && (_l = _22.return)) _l.call(_22);
                        }
                        finally { if (e_16) throw e_16.error; }
                    }
                    if (this.drawPile.top && foundationPile.canAdd(this.drawPile.top)) {
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
        catch (e_15_1) { e_15 = { error: e_15_1 }; }
        finally {
            try {
                if (_20 && !_20.done && (_k = _19.return)) _k.call(_19);
            }
            finally { if (e_15) throw e_15.error; }
        }
        // If no other move is found, the shifting of the draw pile is suggested.
        // This will create a loop, if the user continues to use the program, since we don't save an
        // internal state and therefore can't adjust the suggestion accordingly.
        if (!this.drawPile.oneCardLeft) {
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
// PLAY MANUALLY:
/*
const g = new Game();
g.printStatus();

while (g.gameOver === false) {
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
// PLAY AUTOMATICALLY WITH SUGGESTED MOVES:
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
// PLAY SEVERAL GAMES AUTOMATICALLY
var i = 0;
var gamesWon = 0;
while (i < 1000) {
    var g = new Game();
    var numMoves = 0;
    var drawShift = 0;
    while (!g.gameOver) {
        if (drawShift > 24) {
            g.gameOver = true;
        }
        else {
            var move = g.suggestMove();
            if (move !== null) {
                g.doMove(move);
                numMoves++;
                if (move.from.pile === "draw" && move.to.pile === "draw") {
                    drawShift++;
                }
                else
                    drawShift = 0;
            }
            else
                g.gameOver = true;
            if (g.isGameWon()) {
                g.gameOver = true;
                gamesWon++;
            }
        }
    }
    var winLoseString = g.isGameWon() ? "won!" : "lost.";
    console.log("Game #" + (i + 1) + " " + winLoseString + " " + numMoves + " moves made.");
    i++;
}
console.log(gamesWon + " games won out of " + i + " played (" + (gamesWon / i) * 100 + " %).");
//# sourceMappingURL=card-thing.js.map