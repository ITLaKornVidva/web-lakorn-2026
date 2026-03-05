import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from "@vercel/analytics/react"

import { GameApp } from './components/GameApp'
import { LandingPage } from './components/LandingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game/*" element={<GameApp />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  )
}

export default App
