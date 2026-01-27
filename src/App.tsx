import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react';
import { AudioController } from './components/UI/AudioController'
import { LevelSelect } from './components/LevelSelect'
import { GamePage } from './components/GamePage'
import { LobbyPage } from './components/LobbyPage'
import { CharacterSelectionPage } from './components/CharacterSelectionPage'
import { RouteGuard } from './components/RouteGuard'
import { OrientationGuard } from './components/OrientationGuard'

import { Summary } from './components/Summary';
import { useGameStore } from './store/gameStore';

function App() {
  const { isGameCompleted, tickAnimation } = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => {
      tickAnimation();
    }, 500); // Global 500ms Beat
    return () => clearInterval(interval);
  }, [tickAnimation]);

  return (
    <BrowserRouter>
      <OrientationGuard>
        <AudioController />
        {isGameCompleted ? (
          <Summary />
        ) : (
          <Routes>
            <Route path="/" element={<LobbyPage />} />
            <Route path="/character-select" element={<CharacterSelectionPage />} />
            <Route path="/level-select" element={<LevelSelect />} />
            <Route path="/game/:levelId" element={
              <RouteGuard>
                <GamePage />
              </RouteGuard>
            } />
          </Routes>
        )}
      </OrientationGuard>
    </BrowserRouter>
  )
}

export default App
