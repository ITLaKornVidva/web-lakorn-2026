import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AudioController } from './components/UI/AudioController'
import { LevelSelect } from './components/LevelSelect'
import { GamePage } from './components/GamePage'
import { RouteGuard } from './components/RouteGuard'
import { OrientationGuard } from './components/OrientationGuard'

import { Summary } from './components/Summary';
import { useGameStore } from './store/gameStore';

function App() {
  const { isGameCompleted } = useGameStore();

  return (
    <BrowserRouter>
      <OrientationGuard>
        <AudioController bgmSrc="" />
        {isGameCompleted ? (
          <Summary />
        ) : (
          <Routes>
            <Route path="/" element={<LevelSelect />} />
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
