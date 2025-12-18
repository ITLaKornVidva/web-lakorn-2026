import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Book } from './Game/Book';
import { levels } from '../data/levels';

export const GamePage = () => {
    const { levelId } = useParams();
    const navigate = useNavigate();
    const { loadLevel, currentLevelId } = useGameStore();

    useEffect(() => {
        if (!levelId) {
            navigate('/');
            return;
        }

        const levelExists = levels.some(l => l.id === levelId);
        if (!levelExists) {
            navigate('/');
            return;
        }

        if (levelId !== currentLevelId) {
            loadLevel(levelId);
        }

    }, [levelId, loadLevel, navigate, currentLevelId]);

    if (!levelId) return null;

    return <Book />;
};
