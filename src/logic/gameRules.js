//export function canPlay(card, topCard) {
//  return card.color === topCard.color || card.value === topCard.value || card.type === 'wild';
//}

// src/logic/gameRules.js

export function canPlayCard(card, topCard) {
  if (card.type === "wild") return true;

  return (
    card.color === topCard.color ||
    card.value === topCard.value
  );
}

export function isStackable(card) {
  return card.value === "+2" || card.value === "+4";
}
