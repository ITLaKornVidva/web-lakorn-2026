import { Navigate, useParams } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';

interface RouteGuardProps {
    children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
    const { levelId } = useParams();
    const { unlockedLevels } = useGameStore();

    // Default to level-1 if no ID provided (though route structure usually enforces it)
    // If levelId is undefined, let the child handle it or redirect? 
    // The route is /game/:levelId, so levelId should be present.
    if (!levelId) {
        return <Navigate to="/" replace />;
    }

    // Always allow level-1
    if (levelId === 'level-1') {
        return <>{children}</>;
    }

    // Check if the level is in the unlocked list
    if (unlockedLevels.includes(levelId)) {
        return <>{children}</>;
    }

    // If we get here, access is denied
    return <Navigate to="/" replace />;
};
