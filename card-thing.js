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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var read = require("readline-sync");
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
            return _this.canAdd(cards[0]) ? _this.cards = _this.cards.concat(cards) : null;
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
        this.toString = function () {
            return _this.cards.length === 0
                ? "Empty"
                : _this.cards.reduce(function (pV, v) { return pV + " " + v; }, "");
        };
    }
    Object.defineProperty(Pile.prototype, "top", {
        get: function () {
            return this.cards.length === 0
                ? null
                : this.cards[this.cards.length - 1];
        },
        enumerable: false,
        configurable: true
    });
    return Pile;
}());
var ResultPile = /** @class */ (function (_super) {
    __extends(ResultPile, _super);
    function ResultPile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.canAdd = function (card) {
            return _this.top === null ||
                (card.suit === _this.top.suit &&
                    isValueNextOnResult(_this.top.value, card.value));
        };
        _this.isFull = function () { return _this.cards.length === values.length; };
        return _this;
    }
    return ResultPile;
}(Pile));
var PlayPile = /** @class */ (function (_super) {
    __extends(PlayPile, _super);
    function PlayPile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.canAdd = function (card) {
            return _this.top === null ||
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
            return this.cards.length === 0
                ? null
                : this.cards[this.index];
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
        this._resultPiles = Array(4).fill(null).map(function () { return new ResultPile(); });
        this._playPiles = Array(7).fill(null).map(function () { return new PlayPile(); });
        this._gameOver = false;
        this.getPile = function (_a) {
            var pile = _a.pile, index = _a.index;
            switch (pile) {
                case "draw":
                    return _this.drawPile;
                case "play":
                    return _this.playPiles[index];
                case "result":
                    return _this.resultPiles[index];
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
                pile.fillPile(shuffld.splice(0, (index + 1)));
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
    Object.defineProperty(Game.prototype, "resultPiles", {
        get: function () {
            return this._resultPiles;
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
        console.log("\n\nDraw Pile: " + ((_b = (_a = this.drawPile.top) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "No Draw Pile") + " \t\t Result Piles: " + this._resultPiles
            .map(function (p) { var _a, _b; return (_b = (_a = p.top) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "Empty"; })
            .reduce(function (pV, v) { return pV + " " + v; }) + " \nPlay Piles: " + this._playPiles
            .map(function (p) { var _a, _b; return (_b = (_a = p.top) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "Empty"; })
            .reduce(function (pV, v) { return pV + " " + v; }) + "\n\n");
    };
    Game.prototype.doMove = function (_a, numOfCards) {
        var _this = this;
        var from = _a.from, to = _a.to;
        var _b = __read([from, to].map(function (m) {
            return _this.getPile(m);
        }), 2), fromPile = _b[0], toPile = _b[1];
        if (!fromPile || !toPile)
            throw new Error("Could not find pile for move " + JSON.stringify({
                from: from,
                to: to,
            }));
        if (numOfCards > 1) {
            var cards = fromPile.removeSeveral(numOfCards);
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
                throw new Error("Illegal move, pile for move " + JSON.stringify({
                    from: from,
                    to: to,
                }) + " cannot recive card " + card.toString() + ", stack is currently " + toPile.toString());
            toPile.add(card);
        }
        if (!fromPile.top.visible)
            fromPile.top.visible = true;
    };
    Game.prototype.isGameWon = function () {
        if (this._resultPiles[0].isFull() &&
            this._resultPiles[1].isFull() &&
            this._resultPiles[2].isFull() &&
            this._resultPiles[3].isFull())
            return true;
        else
            return false;
    };
    return Game;
}());
var moveString = "Type your desired move:\n                    \n - 'SD': Shift drawpile\n                    \n - 'M x y': Move card from x to y\n                    \n - 'X': Exit game\n                    \n\nPiles should be named as follows:\n                    \n'draw+' for the draw pile.\n                    \n'play+' followed by a number 1-7 for the seven play piles. If you want to move several cards, add the number of cards to the end of your move.\n                    \n'result+' followed by a number 1-4 for the four result piles.\n";
var g = new Game();
g.printStatus();
while (g.gameOver === false) {
    var move = read.question(moveString).split(' ');
    switch (move[0]) {
        case "SD":
            g.drawPile.shift();
            break;
        case "M":
            var fromPile = move[1].split('+');
            var toPile = move[2].split('+');
            var numOfCards = (move.length === 4) ? parseInt(move[3]) : 1;
            g.doMove({
                from: { pile: fromPile[0], index: (_a = parseInt(fromPile[1]) - 1) !== null && _a !== void 0 ? _a : -1 },
                to: { pile: toPile[0], index: (_b = parseInt(toPile[1]) - 1) !== null && _b !== void 0 ? _b : -1 },
            }, numOfCards);
            break;
        case "X":
            g.gameOver = true;
            break;
    }
    g.printStatus();
    if (g.isGameWon())
        g.gameOver = true;
}
if (g.isGameWon())
    console.log("Congratulations, you won!");
else if (!g.isGameWon())
    console.log("Dumbass, you lost.");
//# sourceMappingURL=card-thing.js.map