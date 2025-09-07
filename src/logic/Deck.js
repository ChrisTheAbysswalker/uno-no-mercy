// src/logic/Deck.js
export function generateRandomCard() {
  const colors = ["red", "blue", "green", "yellow"];
  const values = [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "Salta", "Reversa", "+2"
  ];

  const allCards = [];

  for (const color of colors) {
    for (const value of values) {
      allCards.push({ color, value, type: "normal" });
    }
  }

  allCards.push({ color: "wild", value: "+4", type: "wild" });
  allCards.push({ color: "wild", value: "Cambio color", type: "wild" });

  return allCards[Math.floor(Math.random() * allCards.length)];
}


// src/logic/Deck.js

const colors = ["red", "blue", "green", "yellow"];
const values = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "Salta", "Reversa", "+2"
];

export function createDeck() {
  const deck = [];

  // Cartas normales (2 de cada excepto 0)
  colors.forEach(color => {
    values.forEach(value => {
      deck.push({ color, value, type: "normal" });
      if (value !== "0") {
        deck.push({ color, value, type: "normal" });
      }
    });
  });

  // Comodines (4 de cada)
  for (let i = 0; i < 4; i++) {
    deck.push({ color: "wild", value: "Cambio color", type: "wild" });
    deck.push({ color: "wild", value: "+4", type: "wild" });
  }

  return shuffle(deck);
}

function shuffle(deck) {
  return deck.sort(() => Math.random() - 0.5);
}
