import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { LevelSelect } from './LevelSelect';
import { GamePage } from './GamePage';
import { LobbyPage } from './LobbyPage';
import { CharacterSelectionPage } from './CharacterSelectionPage';
import { RouteGuard } from './RouteGuard';
import { OrientationGuard } from './OrientationGuard';
import { Summary } from './Summary';
import { useGameStore } from '../store/gameStore';

export function GameApp() {
    const { isGameCompleted, tickAnimation } = useGameStore();

    useEffect(() => {
        const interval = setInterval(() => {
            tickAnimation();
        }, 500); // Global 500ms Beat

        // Add class to body to disable SOV_YeeHor font in game route
        document.body.classList.add('game-route');

        return () => {
            clearInterval(interval);
            document.body.classList.remove('game-route');
        };
    }, [tickAnimation]);

    return (
        <>
            <div className="fixed inset-0 z-[-1] w-full h-dvh">
                <img
                    src="/assets/main_bg.png"
                    alt="Background"
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/10" /> {/* Optional overlay if needed for contrast */}
            </div>

            <OrientationGuard>
                {isGameCompleted ? (
                    <Summary />
                ) : (
                    <Routes>
                        <Route path="/" element={<LobbyPage />} />
                        <Route path="character-select" element={<CharacterSelectionPage />} />
                        <Route path="level-select" element={<LevelSelect />} />
                        <Route path="play/:levelId" element={
                            <RouteGuard>
                                <GamePage />
                            </RouteGuard>
                        } />
                    </Routes>
                )}
            </OrientationGuard>
        </>
    );
}
