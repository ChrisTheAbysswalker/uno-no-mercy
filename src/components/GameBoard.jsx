import React, { useState } from "react";
import Card from "./Card";
import { canPlayCard } from "../logic/gameRules";
import { createDeck, generateRandomCard } from "../logic/Deck";

export default function GameBoard() {
  const numPlayers = 4;
  const [gameOver, setGameOver] = useState(false);
  const [winnerId, setWinnerId] = useState(null);

  // 1. Crear mazo completo y dividirlo correctamente
  const fullDeck = createDeck();
  const initialDeck = [...fullDeck];
  const initialPlayers = [];

  for (let i = 0; i < numPlayers; i++) {
    const hand = initialDeck.splice(0, 7);
    initialPlayers.push({ id: i, hand });
  }

  const initialTopCard = initialDeck.pop();
  const [deck, setDeck] = useState(initialDeck);
  const [players, setPlayers] = useState(initialPlayers);
  const [topCard, setTopCard] = useState(initialTopCard);
  const [drawStack, setDrawStack] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [direction, setDirection] = useState(1);

  function checkDisqualification(players) {
    const updated = [...players];
    const disqualifiedIds = [];

    for (const player of updated) {
      if (!player.isOut && player.hand.length >= 25) {
        player.isOut = true;
        disqualifiedIds.push(player.id);
      }
    }

    return { updatedPlayers: updated, disqualifiedIds };
  }

  function handleDraw() {
    if (gameOver) return;
    const updatedPlayers = [...players];
    const hand = [...updatedPlayers[currentPlayer].hand];
    const newDeck = [...deck];

    let card = newDeck.pop();
    if (!card) {
      card = generateRandomCard();
    }

    hand.push(card);
    updatedPlayers[currentPlayer].hand = hand;

    // Revisión de descalificación
    const { updatedPlayers: checkedPlayers, disqualifiedIds } = checkDisqualification(updatedPlayers);

    if (disqualifiedIds.length > 0) {
      alert(`Jugador(s) descalificado(s): ${disqualifiedIds.map(i => i + 1).join(", ")}`);
      setPlayers(checkedPlayers);
      setDeck(newDeck);
      nextPlayer(); // Avanzar turno automáticamente si fue descalificado
      return;
    }

    setPlayers(checkedPlayers);
    if (checkForWinner(checkedPlayers)) {
      return;
    }

    setDeck(newDeck);
  }


  function nextPlayer(skipped = false) {
    let next = currentPlayer;
    const total = players.length;

    do {
      next = (next + (skipped ? 2 : 1) * direction + total) % total;
    } while (players[next]?.isOut);

    setCurrentPlayer(next);
  }


  function checkForWinner(players) {
    const winnerByEmptyHand = players.find(p => !p.isOut && p.hand.length === 0);
    if (winnerByEmptyHand) {
      setWinnerId(winnerByEmptyHand.id);
      setGameOver(true);
      return true;
    }

    const activePlayers = players.filter(p => !p.isOut);
    if (activePlayers.length === 1) {
      setWinnerId(activePlayers[0].id);
      setGameOver(true);
      return true;
    }

    return false;
  }


  function playCard(card, index) {
    if (!canPlayCard(card, topCard)) {
      alert("¡No puedes jugar esa carta!");
      return;
    }

    const updatedPlayers = [...players];
    const hand = [...updatedPlayers[currentPlayer].hand];
    hand.splice(index, 1);
    updatedPlayers[currentPlayer].hand = hand;

    if (card.type === "wild") {
      const newColor = prompt("¿Qué color eliges? (red, blue, green, yellow)");
      card.color = newColor;
    }

    setTopCard(card);
    setPlayers(updatedPlayers);

    if (card.value === "Reversa") {
      setDirection(direction * -1);
      nextPlayer();
    } else if (card.value === "Salta") {
      nextPlayer(true);
    } else if (card.value === "+2") {
      setDrawStack(drawStack + 2);
      nextPlayer();
    } else if (card.value === "+4") {
      setDrawStack(drawStack + 4);
      nextPlayer();
    } else {
      setDrawStack(0);
      nextPlayer();
    }
    if (checkForWinner(updatedPlayers)) {
      return; // termina ejecución
    }

  }

  function restartGame() {
    const fullDeck = createDeck();
    const tempDeck = [...fullDeck];
    const newPlayers = [];

    for (let i = 0; i < numPlayers; i++) {
      const hand = tempDeck.splice(0, 7);
      newPlayers.push({ id: i, hand });
    }

    const top = tempDeck.pop();

    setDeck(tempDeck);
    setPlayers(newPlayers);
    setTopCard(top);
    setCurrentPlayer(0);
    setDirection(1);
    setDrawStack(0);
    setGameOver(false);
    setWinnerId(null);
  }

  if (gameOver) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>🎉 ¡Jugador {winnerId + 1} ha ganado! 🎉</h1>
        <button onClick={restartGame} style={{ fontSize: "1.2rem", padding: "10px 20px" }}>
          Jugar otra vez
        </button>
      </div>
    );
  }
  return (

    <div style={{ display: "flex", height: "100vh" }}>
      {/* Panel izquierdo */}
      <div style={{
        width: "250px",
        backgroundColor: "#f0f0f0",
        padding: "20px",
        borderRight: "1px solid #ccc"
      }}>
        <h3 style={{ textAlign: "center", color: '#333' }}>Jugadores</h3>
        {players.map((player) => (
          <div key={player.id} style={{ marginBottom: "15px", color: player.hand.length >= 25 ? "red" : "black" }}>
            <strong>Jugador {player.id + 1}</strong><br />
            Cartas: {player.hand.length}
          </div>
        ))}

        <h3 style={{ marginTop: "10px", color: '#333' }}>
          Acumulación: {drawStack > 0 ? `+${drawStack}` : "ninguna"}
        </h3>
      </div>

      {/* Panel derecho */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2 style={{ textAlign: "center" }}>Carta en mesa</h2>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <Card color={topCard.color} value={topCard.value} />
        </div>

        <h2 style={{ textAlign: "center" }}>Turno de Jugador {currentPlayer + 1}</h2>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {players[currentPlayer].hand.map((card, index) => (
            <Card
              key={index}
              color={card.color}
              value={card.value}
              onClick={() => playCard(card, index)}
            />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button onClick={handleDraw}>Tomar carta</button>
        </div>
      </div>
    </div>
  );
}
