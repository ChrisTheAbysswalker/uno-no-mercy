import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import GameBoard from './components/GameBoard';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>UNO No Mercy</h1>
      <GameBoard />
    </div>
  );
}

export default App;
