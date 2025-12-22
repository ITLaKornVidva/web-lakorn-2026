import { Navigate, useParams } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { levels } from '../data/levels';

interface RouteGuardProps {
    children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
    const { levelId } = useParams();
    const { solvedLevels } = useGameStore();

    if (!levelId) {
        return <Navigate to="/" replace />;
    }

    // Always allow level-1
    if (levelId === 'level-1') {
        return <>{children}</>;
    }

    // Find level index
    const levelIndex = levels.findIndex(l => l.id === levelId);

    // If level not found, redirect
    if (levelIndex === -1) {
        return <Navigate to="/" replace />;
    }

    const prevLevel = levels[levelIndex - 1];

    // Check if the PREVIOUS level is in the solved list
    if (prevLevel && solvedLevels.includes(prevLevel.id)) {
        return <>{children}</>;
    }

    // If we get here, access is denied
    return <Navigate to="/" replace />;
};
