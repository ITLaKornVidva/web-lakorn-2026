import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { levels } from '../data/levels';
import { MiniScene } from './MiniScene';

export const LevelSelect = () => {
    const navigate = useNavigate();
    const { unlockedLevels, completedScenes, levelPlacements, solvedLevels } = useGameStore();

    const handleLevelClick = (levelId: string) => {
        // Accessible check is done on render, so if clicked it implies accessible? 
        // But good to double check.
        const levelIndex = levels.findIndex(l => l.id === levelId);
        const prevLevel = levels[levelIndex - 1];
        // Logic: Unlocked explicitly OR Previous level solved OR First level
        const isAccessible =
            unlockedLevels.includes(levelId) ||
            levelIndex === 0 ||
            (prevLevel && solvedLevels.includes(prevLevel.id));

        if (isAccessible) {
            navigate(`/game/${levelId}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5e6d3] text-[#2c1810] font-serif p-8 md:p-12 overflow-hidden landscape:flex hidden flex-col">
            {/* Header */}
            <div className="text-center mb-8 relative z-10">
                <h1 className="text-4xl md:text-6xl font-serif-bold uppercase tracking-widest mb-2">It's Lakorn Vidva</h1>
                <p className="text-xl md:text-2xl italic opacity-80">Select a chapter to begin</p>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-12 max-w-7xl mx-auto w-full relative z-10">
                {/* Left Column: Collection / Completed Scenes */}
                <div className="flex flex-col gap-6 p-6 border-r-2 border-[#2c1810]/10">
                    <h2 className="text-3xl font-serif-bold uppercase tracking-widest border-b-2 border-[#2c1810] pb-2 mb-4 inline-block self-start">
                        Collection
                    </h2>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 max-h-[60vh] custom-scrollbar">
                        {levels.flatMap(level => level.scenes.map(scene => ({ scene, level }))).map(({ scene, level }) => {
                            const isCompleted = completedScenes.includes(scene.id);

                            // Find saved placement if exists
                            const savedLevelScenes = levelPlacements[level.id];
                            const savedScene = savedLevelScenes?.find(s => s.id === scene.id) || scene;

                            return (
                                <div key={scene.id} className={`p-3 rounded border flex flex-col items-center gap-2 transition-all ${isCompleted ? 'bg-white/80 border-[#2c1810]/20 shadow-sm hover:scale-105' : 'bg-[#e6d5bc] border-[#2c1810]/5 opacity-60'}`}>
                                    <div className="w-full aspect-[4/3] rounded overflow-hidden relative bg-[#dccfb9]">
                                        {isCompleted ? (
                                            <MiniScene
                                                scene={savedScene}
                                                levelItems={level.availableItems}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-2xl opacity-20">?</span>
                                            </div>
                                        )}
                                    </div>
                                    <span className={`text-sm font-bold truncate w-full text-center ${isCompleted ? '' : 'opacity-0'}`}>
                                        {scene.title || '???'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Level List */}
                <div className="flex flex-col gap-6 p-6">
                    <h2 className="text-3xl font-serif-bold uppercase tracking-widest border-b-2 border-[#2c1810] pb-2 mb-4 inline-block self-end">
                        Chapters
                    </h2>

                    <div className="flex flex-col gap-4">
                        {levels.map((level, index) => {
                            // Logic: Unlocked explicitly OR Previous level solved OR First level
                            const prevLevelId = levels[index - 1]?.id;
                            const isUnlocked = unlockedLevels.includes(level.id);
                            const prevLevelSolved = prevLevelId ? solvedLevels.includes(prevLevelId) : false;

                            const accessible = index === 0 || isUnlocked || prevLevelSolved;

                            return (
                                <button
                                    key={level.id}
                                    onClick={() => accessible && handleLevelClick(level.id)}
                                    disabled={!accessible}
                                    className={`
                                        group relative p-6 rounded-lg border-2 text-left transition-all duration-300
                                        ${accessible
                                            ? 'bg-[#EFE5D5] border-[#4a2c2a] hover:bg-[#4a2c2a] hover:text-[#EFE5D5] hover:shadow-xl cursor-pointer hover:-translate-y-1'
                                            : 'bg-[#cfc0aa] border-transparent opacity-50 cursor-not-allowed grayscale'
                                        }
                                    `}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xs uppercase tracking-widest opacity-70 block mb-1">Chapter {index + 1}</span>
                                            <h3 className="text-2xl font-serif-bold">{accessible ? level.title : 'Locked ???'}</h3>
                                            <p className={`text-sm mt-2 italic ${accessible ? 'opacity-80' : 'opacity-0'}`}>{level.goal}</p>
                                        </div>

                                        <div className="text-3xl">
                                            {accessible ? (
                                                <span className="transform group-hover:translate-x-2 transition-transform inline-block">→</span>
                                            ) : (
                                                <span>🔒</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress Bar (green or some color) */}
                                    {accessible && (
                                        <div className="absolute bottom-0 left-0 h-1 bg-[#2c1810]/10 w-full rounded-b-lg overflow-hidden">
                                            <div
                                                className="h-full bg-[#4a2c2a] transition-all"
                                                style={{
                                                    width: `${(level.scenes.filter(s => completedScenes.includes(s.id)).length / level.scenes.length) * 100}%`
                                                }}
                                            />
                                        </div>
                                    )}
                                    {/* Solved Indicator */}
                                    {solvedLevels.includes(level.id) && (
                                        <div className="absolute top-2 right-2 text-green-700 bg-white/50 rounded-full p-1" title="Level Complete">
                                            ✓
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Mobile / Portrait Warning */}
            <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center p-8 text-center landscape:hidden w-screen h-screen">
                <div className="text-6xl mb-4 animate-pulse">↻</div>
                <h2 className="text-3xl font-serif mb-2">Please Rotate Device</h2>
            </div>
        </div>
    );
};
