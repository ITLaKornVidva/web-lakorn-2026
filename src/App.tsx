import { Book } from './components/Game/Book'

import { Summary } from './components/Summary';
import { useGameStore } from './store/gameStore';

function App() {
  const { isGameCompleted } = useGameStore();

  return (
    isGameCompleted ? <Summary /> : <Book />
  )
}

export default App
