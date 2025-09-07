// src/components/Card.jsx
import React from "react";
import "./Card.css";

export default function Card({ color, value, onClick }) {
  return (
    <div className={`card ${color}`} onClick={onClick}>
      {value}
    </div>
  );
}
