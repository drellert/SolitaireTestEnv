import * as read from 'readline-sync';

const suits = <const>["Hearts", "Spades", "Clubs", "Diamonds"];
type Suit = typeof suits[number];
const values = <const>[
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
type Value = typeof values[number];

const isValueNextOnResult = (compare: Value | null, to: Value) => {
    if (!compare) return true;
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

const isValueNextOnPlay = (compare: Value | null, to: Value) => {
    if (!compare) return true;
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

const isSuitOpposite = (compare: Suit, to: Suit) => {
    switch (compare) {
        case "Diamonds":
        case "Hearts":
            return to === "Clubs" || to === "Spades";
        case "Clubs":
        case "Spades":
            return to === "Diamonds" || to === "Hearts";
    }
};

class Card {
    constructor(public suit: Suit, public value: Value) {}

    public toString(): string {
        return `(${this.value} of ${this.suit})`;
    }
}

abstract class Pile {
    constructor(protected cards: Card[] = []) {}

    public get top(): Card | null {
        return this.cards.length === 0
            ? null
            : this.cards[this.cards.length - 1];
    }

    public add = (card: Card) =>
        this.canAdd(card) ? this.cards.push(card) : null;

    public removeTop = (): Card | undefined => this.cards.pop();

    public abstract canAdd(card: Card): boolean;

    public fillPile = (cards: Card[]) => (this.cards = cards);

    public toString = () =>
        this.cards.length === 0
            ? "Empty"
            : this.cards.reduce((pV, v) => `${pV} ${v}`, "");
}

class ResultPile extends Pile {
    public canAdd = (card: Card) =>
        this.top === null ||
        (card.suit === this.top.suit &&
            isValueNextOnResult(this.top.value, card.value));

    public isFull(): boolean {
        if (this.cards.length === values.length) return true;
        else return false;
    }
}

class PlayPile extends Pile {
    public canAdd = (card: Card) =>
        this.top === null ||
        (isSuitOpposite(this.top.suit, card.suit) &&
            isValueNextOnPlay(this.top.value, card.value));
}

class DrawPile extends Pile {
    private index = 0;

    public get top(): Card | null {
        return this.cards.length === 0
            ? null
            : this.cards[this.index];
    }

    public canAdd = () => false;

    public removeTop = () => {
        if (this.cards.length === 0) return undefined;
        const cardRemoved = this.cards.splice(this.index, 1)[0];
        this.index = (this.index + 1) % (this.cards.length - 1);
        return cardRemoved;
    };

    public shift = () =>
        (this.index = (this.index + 1) % (this.cards.length - 1));
}

function shuffle<T>(array: T[]): T[] {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

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

type PileType = "draw" | "result" | "play";

interface MovePile {
    pile: PileType;
    index: number;
}

export interface Move {
    from: MovePile;
    to: MovePile;
}

class Game {
    private _drawPile = new DrawPile();
    private _resultPiles = Array(4).fill(null).map(() => new ResultPile());
    private _playPiles = Array(7).fill(null).map(() => new PlayPile());
    private _gameOver = false;

    constructor() {
        const allCards: Card[] = [];
        for (const suit of suits) {
            for (const value of values) {
                allCards.push(new Card(suit, value));
            }
        }
        const shuffld = shuffle(allCards);
        // Now we put da cardz in da play zone
        for (const [index, pile] of this._playPiles.entries()) {
            pile.fillPile(shuffld.splice(0, index));
        }
        // And da rest in da draw
        this._drawPile.fillPile(shuffld);
    }

    public get drawPile() {
        return this._drawPile;
    }

    public get resultPiles() {
        return this._resultPiles;
    }

    public get playPiles() {
        return this._playPiles;
    }

    public get gameOver() {
        return this._gameOver;
    }

    public set gameOver(bool: boolean) {
        this._gameOver = bool;
    }

    public printStatus() {
        console.log(
            `\n\nDraw Pile: ${
                this.drawPile.top?.toString() ?? "No Draw Pile"
            } \t\t Result Piles: ${this._resultPiles
                .map((p) => p.top?.toString() ?? "Empty")
                .reduce(
                    (pV, v) => `${pV} ${v}`
                )} \nPlay Piles: ${this._playPiles
                .map((p) => p.top?.toString() ?? "Empty")
                .reduce((pV, v) => `${pV} ${v}`)}\n\n`
        );
    }

    private getPile = ({ pile, index }: MovePile): Pile => {
        switch (pile) {
            case "draw":
                return this.drawPile;
            case "play":
                return this.playPiles[index];
            case "result":
                return this.resultPiles[index];
        }
    };

    public doMove({ from, to }: Move) {
        const [fromPile, toPile] = [from, to].map((m) =>
            this.getPile(m)
        );
        if (!fromPile || !toPile)
            throw new Error(
                `Could not find pile for move ${JSON.stringify({
                    from,
                    to,
                })}`
            );
        const card = fromPile.removeTop();
        if (!toPile.canAdd(card))
            throw new Error(
                `Illegal move, pile for move ${JSON.stringify({
                    from,
                    to,
                })} cannot recive card ${card.toString()}, stack is currently ${toPile.toString()}`
            );
        toPile.add(card);
    }

    public isGameWon(): boolean {
        if (this._resultPiles[0].isFull() &&
            this._resultPiles[1].isFull() &&
            this._resultPiles[2].isFull() &&
            this._resultPiles[3].isFull()
            ) return true;
        else return false;
    }
}

const moveString = `Type your desired move:
                    \n - \'SD\': Shift drawpile
                    \n - \'M x y\': Move card from x to y
                    \n - \'X\': Exit game
                    \n\nPiles should be named as follows:
                    \n\'draw+\' for the draw pile.
                    \n\'play+\' followed by a number 1-7 for the seven play piles.
                    \n\'result+\' followed by a number 1-4 for the four result piles.\n`

const g = new Game();
g.printStatus();

while (g.gameOver === false) {
    let move = read.question(moveString).split(' ');

    switch (move[0]) {
        case "SD":
            g.drawPile.shift();
            break;
        case "M":
            const fromPile = move[1].split('+');
            const toPile = move[2].split('+');
            g.doMove({
                from: { pile: fromPile[0] as PileType, index: parseInt(fromPile[1]) - 1 ?? -1},
                to: { pile: toPile[0] as PileType, index: parseInt(toPile[1]) - 1 ?? -1}
            })
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