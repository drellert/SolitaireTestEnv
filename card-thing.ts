import * as read from "readline-sync";

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

  public getVisibleCards = (): Card[] => {
    let visibleCards: Card[] = [];
    for (const card of this.cards) {
      if (card.visible) visibleCards.push(card);
    }
    return visibleCards ?? [];
  };

  public numberHiddenCards = () => this.cards.filter((c) => !c.visible).length;

  public toString = () =>
    this.cards.length === 0
      ? "Empty"
      : this.cards.reduce((pV, v) => `${pV} ${v}`, "");
}

class FoundationPile extends Pile {
  public canAdd = (card: Card) =>
    (this.top === null && card.value === "Ace") ||
    (card.suit === this.top.suit &&
      isValueNextOnResult(this.top.value, card.value));

  public isFull = (): boolean => this.cards.length === values.length;
}

class PlayPile extends Pile {
  public canAdd = (card: Card) =>
    (this.top === null && card.value === "King") ||
    (isSuitOpposite(this.top.suit, card.suit) &&
      isValueNextOnPlay(this.top.value, card.value));
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

type PileType = "draw" | "foundation" | "play";

interface MovePile {
  pile: PileType;
  index: number;
}

export interface Move {
  from: MovePile;
  to: MovePile;
  amount?: number
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
      pile.top.visible = true;
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
    if (amount > 1) {
      const cards = fromPile.removeSeveral(amount);
      if (!toPile.canAdd(cards[0]))
        throw new Error(
          `Illegal move, pile for move ${JSON.stringify({
            from,
            to,
          })} cannot recive card ${cards
            .map((c) => c.toString())
            .reduce((pV, v) => `${pV} ${v}`)}
                    , stack is currently ${toPile.toString()}`
        );
      toPile.addSeveral(cards);
    } else {
      const card = fromPile.removeTop();
      if (!toPile.canAdd(card))
        throw new Error(
          //fik dette error
          `Illegal move, pile for move ${JSON.stringify({
            from,
            to,
          })} cannot recive card ${card.toString()}, stack is currently ${toPile.toString()}`
        );
      toPile.add(card);
    }
    //gav fejl
    if (fromPile.top?.visible===false) fromPile.top.visible = true;
  }

  public suggestMove(): Move {
    console.log("choosing move");
    // Step 1a: available cards(aces and deuces) from drawpile to foundation
    for (const [pileIndex, pile] of this._foundationPiles.entries()) {
      const top = pile.top;
      if (top) {
        const { suit, value } = top;
        const drawPileTop = this.drawPile.top;
        if(drawPileTop.value===2&&value===2&&drawPileTop.suit===suit){
          console.log("Drawpile deuce to foundation");
          return {
            from: {
              pile: "draw",
              index:0,
            },
            to: {
              pile: "foundation",
              index: pileIndex,
            },
          };
        }else if (drawPileTop.value==="Ace"){
          console.log("Drawpile ace to foundation");
          return {
            from: {
              pile: "draw",
              index:0,
            },
            to: {
              pile: "foundation",
              index: pileIndex,
            },
          }
        }
      }
    }
    
    // Step 1b: available cards(aces and deuces) from playpile to foundation
    for (const [pileIndex, pile] of this._foundationPiles.entries()) {
      const top = pile.top;
      if (top) {
        const { suit, value } = top;
        for (const [index, playPile] of this._playPiles.entries()) {
          if (
            playPile.top?.suit === suit &&
            isValueNextOnResult(playPile.top?.value, value)
          ) {
            console.log("Playpile() to foundation");
            return {
              from: {
                pile: "play",
                index,
              },
              to: {
                pile: "foundation",
                index: pileIndex,
              },
            };
          }
        }
      } else {
        for (const [index, playPile] of this._playPiles.entries()) {
          if (playPile.top?.value === "Ace") {
            console.log("Playpile ace to foundation");
            return {
              from: {
                pile: "play",
                index,
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
    //Step 2 : move drawpile king to empty playpile
    if(this.drawPile.top.value==="King"){
      let isPlayPileEmpty : boolean = false;
    let emptyPlayPile : number = null;
    for(const [index, pile] of this._playPiles.entries()){
      if(pile.top===null){
        isPlayPileEmpty = true;
        emptyPlayPile = index;
              console.log("drawpile king to empty playpile");
              return{
              from: {
                pile: "draw",
                index:0,
              },
              to: {
                pile: "play",
                index: emptyPlayPile,
              },
            };
          }
        }
  
  
    }
    //Step 2a: move playpile king to empty playpile
    let isPlayPileEmpty : boolean = false;
    let emptyPlayPile : number = null;
    for(const [index, pile] of this._playPiles.entries()){
      if(pile.top===null){
        isPlayPileEmpty = true;
        emptyPlayPile = index;
        for(const [index, pile] of this._playPiles.entries()){
          let hiddenCards : number = null;
          //giver fejl (value undefined)- der skal være hidden cards 
            if(pile.numberHiddenCards() > hiddenCards){
              const visible = pile.getVisibleCards();
              const bottom = visible[visible.length - 1];
              if(bottom){
              if(bottom.value==="King"){
              console.log("Playpile card king to empty playpile");
              return{
              from: {
                pile: "play",
                index,
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
  }
  
    
    // Step 2b: expose hidden cards from column with the most hidden cards
    let hiddenCards: number = null;
    let viableMove: Move = null;
    let fromString = "";
    let toString = "";
    for (const [index, pile] of this._playPiles.entries()) {
      if (hiddenCards === null || pile.numberHiddenCards() > hiddenCards) {
        const visible = pile.getVisibleCards();
        //problemer med nedenstående
        const bottom = visible[visible.length-1];
        if (bottom) {
          // Now we check if this bottom card can be moved somewhere else
          for (const [targetIndex, targetPile] of this._playPiles.entries()) {
            if (targetIndex !== index && targetPile.canAdd(bottom)) {
              fromString=bottom.value+" of "+bottom.suit;
              toString=targetPile.top.value+" of "+targetPile.top.suit;
              viableMove = {
                from: {
                  pile: "play",
                  index,
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
      }
    }
    if (viableMove){ 
      console.log("Playpile card("+fromString+") to other playpile card "+toString);
      return viableMove;}
    // Step 3: The best move provides you opportunity to make other moves or expose hidden cards
    // We see if a card from the draw pile can be added to the play piles
    const topDraw = this._drawPile.top
    if (topDraw) {
        for (const [index, pile] of this._playPiles.entries()) {
            if (pile.canAdd(topDraw)){
            console.log("Drawpile card to playpile");
            return {
                from: {
                    pile: "draw",
                    index: 0
                },
                to: {
                    pile: "play",
                    index
                },
            };
        }
    }
  }
    // Step 4: Don't empty a tableau pile without a King to replace.
    //tjek for konger i alle byggestabler med skjulte kort og i dækket.
  
    // Step 5: Consider carefully whether to fill a space with a  black King or a red King
    // Step 6: Move top cards to foundation
    for (const [pileIndex, pile] of this._foundationPiles.entries()) {
      const top = pile.top;
      if (top) {
        const { suit, value } = top;
        for (const [index, playPile] of this._playPiles.entries()) {
          if (
            playPile.top?.suit === suit &&
            isValueNextOnResult(playPile.top?.value, value)
          ) {
            console.log("Playpile cards to foundation");
            return {
              from: {
                pile: "play",
                index,
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
    //No moves possible
    console.log("No move was possible")
    console.log("You lost, ignore errors")
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

const g = new Game();
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
  if (g.isGameWon()) g.gameOver = true;
}
if (g.isGameWon()) console.log(`Congratulations, you won!`);
else if (!g.isGameWon()) console.log(`Dumbass, you lost.`);


