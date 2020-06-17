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
  public visible: boolean;

  constructor(public suit: Suit, public value: Value) {
    this.visible = false;
  }

  public toString(): string {
    if (this.visible) return `(${this.value} of ${this.suit})`;
    else return `Unknown`;
  }
}

abstract class Pile {
  constructor(protected cards: Card[] = []) {}

  public get top(): Card | null {
    return this.cards.length === 0 ? null : this.cards[this.cards.length - 1];
  }

  public add = (card: Card) =>
    this.canAdd(card) ? this.cards.push(card) : null;

  public addSeveral = (cards: Card[]) =>
    this.canAdd(cards[0]) ? (this.cards = this.cards.concat(cards)) : null;

  public removeTop = (): Card | undefined => this.cards.pop();

  public removeSeveral = (numOfCards: number): Card[] | undefined => {
    if (numOfCards > this.cards.length) return;
    for (let i = 1; i <= numOfCards; i++) {
      if (!this.cards[this.cards.length - i].visible) return;
    }
    return this.cards.splice(-numOfCards);
  };

  public abstract canAdd(card: Card): boolean;

  public fillPile = (cards: Card[]) => (this.cards = cards);

  public getVisibleCards = (): Card[] => this.cards.filter((c) => c.visible);

  public numberHiddenCards = (): number =>
    this.cards.filter((c) => !c.visible).length;

  public get empty() {
    return this.cards.length === 0;
  }

  public get oneCardLeft() {
    return this.cards.length === 1;
  }

  public toString = () =>
    this.cards.length === 0
      ? "Empty"
      : this.cards.reduce((pV, v) => `${pV} ${v}`, "");
}

class FoundationPile extends Pile {
  public canAdd = (card: Card) =>
    (this.top === null && card.value === "Ace") ||
    (card.suit === this.top?.suit &&
      isValueNextOnResult(this.top?.value, card.value));

  public isFull = (): boolean => this.cards.length === values.length;
}

class PlayPile extends Pile {
  public canAdd = (card: Card) =>
    ((this.top === null && card.value === "King") ||
      (this.top &&
        isSuitOpposite(this.top!.suit, card.suit) &&
        isValueNextOnPlay(this.top!.value, card.value))) ??
    false;
}

class DrawPile extends Pile {
  private index = 0;

  public get top(): Card | null {
    return this.cards.length === 0 ? null : this.cards[this.index];
  }

  public canAdd = () => false;

  public removeTop = () => {
    if (this.cards.length === 0) return undefined;
    const cardRemoved = this.cards.splice(this.index, 1)[0];
    this.index = this.index === 0 ? 0 : this.index - 1;
    return cardRemoved;
  };

  public shift = () =>
    (this.index =
      this.cards.length === 1 ? 0 : (this.index + 1) % this.cards.length);
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

type PileType = "draw" | "foundation" | "play";

interface MovePile {
  pile: PileType;
  index: number;
}

export interface Move {
  from: MovePile;
  to: MovePile;
  amount?: number;
}

class Game {
  private _drawPile = new DrawPile();
  private _foundationPiles = Array(4)
    .fill(null)
    .map(() => new FoundationPile());
  private _playPiles = Array(7)
    .fill(null)
    .map(() => new PlayPile());
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
      pile.fillPile(shuffld.splice(0, index + 1));
      if (pile.top) pile.top.visible = true;
    }
    // And da rest in da draw
    for (const card of shuffld) {
      card.visible = true;
    }
    this._drawPile.fillPile(shuffld);
  }

  public get drawPile() {
    return this._drawPile;
  }

  public get foundationPiles() {
    return this._foundationPiles;
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
      } \t\t Foundation Piles: ${this._foundationPiles
        .map((p) => p.top?.toString() ?? "Empty")
        .reduce((pV, v) => `${pV} ${v}`)} \nPlay Piles: ${this._playPiles
        .map((p) => `\n${p.toString()}`)
        .reduce((pV, v) => `${pV}${v} `)}\n\n`
    );
  }

  private getPile = ({ pile, index }: MovePile): Pile => {
    switch (pile) {
      case "draw":
        return this.drawPile;
      case "play":
        return this.playPiles[index];
      case "foundation":
        return this.foundationPiles[index];
    }
  };

  public doMove({ from, to, amount = 1 }: Move) {
    const [fromPile, toPile] = [from, to].map((m) => this.getPile(m));
    if (!fromPile || !toPile)
      throw new Error(
        `Could not find pile for move ${JSON.stringify({
          from,
          to,
        })}`
      );
    //If both the draw pile is set as both the from and to piles, the draw pile is shifted
    if (fromPile instanceof DrawPile && toPile instanceof DrawPile) {
      this.drawPile.shift();
      // console.log(`Shifting draw pile.`); // Removed for testing purposes
      return;
    }
    if (amount > 1) {
      const cards = fromPile.removeSeveral(amount) ?? [];
      if (!toPile.canAdd(cards[0]))
        throw new Error(
          `Illegal move, pile for move ${JSON.stringify({
            from,
            to,
          })} cannot recive cards ${cards
            .map((c) => c.toString())
            .reduce((pV, v) => `${pV} ${v}`)}
                    , stack is currently ${toPile.toString()}`
        );
      toPile.addSeveral(cards);
      /* console.log(
        `Moving ${cards
          .map((c) => c.toString())
          .reduce((pV, v) => `${pV} ${v}`)} from pile: ${from.pile} ${
          from.index + 1
        }, to pile: ${to.pile} ${to.index + 1}.`
      ); */ // Removed for testing purposes
    } else {
      const card = fromPile.removeTop();
      if (card) {
        if (!toPile.canAdd(card))
          throw new Error(
            //fik dette error
            `Illegal move, pile for move ${JSON.stringify({
              from,
              to,
            })} cannot recive card ${
              card?.toString() ?? "No Card"
            }, stack is currently ${toPile.toString()}`
          );
        toPile.add(card);
      }
      /* console.log(
        `Moving ${card.toString()} from pile: ${from.pile} ${
          from.index + 1
        }, to pile: ${to.pile} ${to.index + 1}.`
      ); */ // Removed for testing purposes
    }
    //gav fejl
    if (fromPile.top && !fromPile.top.visible) fromPile.top.visible = true;
  }

  public replacementKing(): boolean {
    if (this._drawPile.top && this._drawPile.top.value === "King") return true;
    else {
      for (const pile of this._playPiles) {
        const bottom = pile.getVisibleCards()[0];
        const hiddenCards = pile.numberHiddenCards();
        if (bottom && bottom.value === "King" && hiddenCards !== 0) return true;
      }
    }
    return false;
  }

  public suggestMove(): Move | null {
    // Strategy taken from https://www.bvssolitaire.com/rules/klondike-solitaire-strategy.htm

    // console.log("Choosing move...\n"); // Removed for testing purposes

    // Tip 1: We assume that a card from the draw pile is always turned up, as long as the
    //        drawpile isn't empty.

    // Tip 2A: Move available cards (Aces and Deuces) from play pile to foundation pile
    for (const [playPileIndex, playPile] of this._playPiles.entries()) {
      if (playPile.top?.value === "Ace" || playPile.top?.value === 2) {
        for (const [
          foundationPileIndex,
          foundationPile,
        ] of this._foundationPiles.entries()) {
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
    }

    // Tip 2B: Move available cards (Aces and Deuces) from draw pile to foundation pile
    if (this.drawPile.top?.value === "Ace" || this.drawPile.top?.value === 2) {
      for (const [pileIndex, pile] of this._foundationPiles.entries()) {
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

    // Tip 5: Move King from play pile to empty play pile
    let hiddenCardsBehindKing: number | null = null;
    let viableKingMove: Move | null = null;

    for (const [targetIndex, targetPile] of this._playPiles.entries()) {
      if (targetPile.empty) {
        for (const [index, pile] of this._playPiles.entries()) {
          //giver fejl (value undefined)- der skal være hidden cards
          const visible = pile.getVisibleCards();
          const bottom = visible[0];
          if (
            bottom &&
            bottom.value === "King" &&
            (viableKingMove === null ||
              hiddenCardsBehindKing === null ||
              pile.numberHiddenCards() >= hiddenCardsBehindKing)
          ) {
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
        if (viableKingMove) return viableKingMove;
      }
    }

    // Tip 5: Move King from draw pile to empty play pile
    if (this.drawPile.top?.value === "King") {
      for (const [index, pile] of this._playPiles.entries()) {
        if (pile.empty) {
          return {
            from: {
              pile: "draw",
              index: 0,
            },
            to: {
              pile: "play",
              index,
            },
          };
        }
      }
    }

    // Tip 3: Expose hidden cards from the play pile with the most hidden cards
    let hiddenCards: number | null = null;
    let viableMove: Move | null = null;

    for (const [index, pile] of this._playPiles.entries()) {
      if (!pile.empty) {
        const visibleCards = pile.getVisibleCards();
        const bottom = visibleCards[0];
        if (bottom) {
          // Now we check if this bottom card can be moved somewhere else
          for (const [targetIndex, targetPile] of this._playPiles.entries()) {
            if (
              targetIndex !== index &&
              targetPile.canAdd(bottom) &&
              (viableMove === null ||
                hiddenCards === null ||
                pile.numberHiddenCards() >= hiddenCards)
            ) {
              hiddenCards = pile.numberHiddenCards();

              // Tip 5: A play pile is only emptied if there is a King to put in it
              if (hiddenCards !== 0 || this.replacementKing()) {
                viableMove = {
                  from: {
                    pile: "play",
                    index,
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
    }
    if (viableMove) return viableMove;

    // Tip 3: The best move provides you opportunity to make other moves or expose hidden cards
    // We see if a card from the draw pile can be added to the play piles
    const topDraw = this._drawPile.top;
    if (topDraw) {
      for (const [index, pile] of this._playPiles.entries()) {
        if (pile.canAdd(topDraw)) {
          return {
            from: {
              pile: "draw",
              index: 0,
            },
            to: {
              pile: "play",
              index,
            },
          };
        }
      }
    }

    // Tip 6: If you have a choice between a black King and a red King to fill a space with,
    //        be cautious in your decision. Look at the color of the blocking cards and make the
    //        appropriate color choice. For example, if you have a red Jack that blocks some hidden
    //        cards, you have to select a red King and than wait for a black Queen.

    // Move cards from play piles and draw pile to foundation
    // TODO: extra checks before moving cards (e.g. cards from one red suit and one black suit
    // "buddy up")
    for (const [
      foundationIndex,
      foundationPile,
    ] of this._foundationPiles.entries()) {
      if (foundationPile.top) {
        for (const [playIndex, playPile] of this._playPiles.entries()) {
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
    //console.log("No move was possible"); // Removed for testing purposes
    return null;
  }

  public isGameWon(): boolean {
    if (
      this._foundationPiles[0].top?.value === "King" &&
      this._foundationPiles[1].top?.value === "King" &&
      this._foundationPiles[2].top?.value === "King" &&
      this._foundationPiles[3].top?.value === "King"
    )
      return true;
    else return false;
  }
}

const moveString = `Type your desired move:
                    \n - \'SD\': Shift drawpile
                    \n - \'M x y\': Move card from x to y
                    \n - \'X\': Exit game
                    \n\nPiles should be named as follows:
                    \n\'draw+\' for the draw pile.
                    \n\'play+\' followed by a number 1-7 for the seven play piles. If you want to move several cards, add the number of cards to the end of your move.
                    \n\'foundation+\' followed by a number 1-4 for the four foundation piles.\n`;
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

// PLAY SEVERAL GAMES AUTOMATICALLY:
let i = 0;
let gamesWon = 0;
let totalMovesFromGamesWon = 0;
while (i < 10000) {
  const g = new Game();
  let numMoves = 0;
  let drawShift = 0;
  while (!g.gameOver) {
    if (drawShift > 24) {
      g.gameOver = true;
    } else {
      const move = g.suggestMove();
      if (move !== null) {
        g.doMove(move);
        numMoves++;
        if (move.from.pile === "draw" && move.to.pile === "draw") {
          drawShift++;
        } else drawShift = 0;
      } else g.gameOver = true;
      if (g.isGameWon()) {
        g.gameOver = true;
        gamesWon++;
        totalMovesFromGamesWon += numMoves;
      }
    }
  }
  const winLoseString = g.isGameWon() ? "won!" : "lost.";
  console.log(`Game #${i + 1} ${winLoseString} ${numMoves} moves made.`);
  i++;
}
console.log(
  `\n${gamesWon} games won out of ${i} played (${
    (gamesWon / i) * 100
  } %).\nAn average of ${Math.round(
    totalMovesFromGamesWon / gamesWon
  )} moves made in games won.\n`
);
