import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AudioController } from './components/UI/AudioController'
import { LevelSelect } from './components/LevelSelect'
import { GamePage } from './components/GamePage'
import { RouteGuard } from './components/RouteGuard'
import { OrientationGuard } from './components/OrientationGuard'

function App() {
  return (
    <BrowserRouter>
      <OrientationGuard>
        <AudioController bgmSrc="" />
        <Routes>
          <Route path="/" element={<LevelSelect />} />
          <Route path="/game/:levelId" element={
            <RouteGuard>
              <GamePage />
            </RouteGuard>
          } />
        </Routes>
      </OrientationGuard>
    </BrowserRouter>
  )
}

export default App
