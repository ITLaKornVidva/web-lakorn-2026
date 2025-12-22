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
        <div className="h-[100dvh] w-[100dvw] bg-[#f5e6d3] text-[#2c1810] font-serif overflow-hidden landscape:flex hidden flex-col safe-padding pt-2 lg:pt-6">
            {/* Header */}
            <div className="text-center mb-1 lg:mb-4 flex-none relative z-10">
                <h1 className="text-xl lg:text-4xl xl:text-5xl font-serif-bold uppercase tracking-widest mb-0.5 leading-tight">It's Lakorn Vidva</h1>
                <p className="text-[10px] lg:text-lg italic opacity-80">Select a chapter to begin</p>
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-[0.8fr_1.2fr] lg:grid-cols-2 gap-3 lg:gap-8 max-w-7xl mx-auto w-full relative z-10 pb-2 px-2 lg:px-6">
                {/* Left Column: Collection / Completed Scenes */}
                <div className="flex flex-col gap-2 p-1 lg:p-4 border-r-2 border-[#2c1810]/10 overflow-hidden">
                    <h2 className="text-sm lg:text-2xl font-serif-bold uppercase tracking-widest border-b-2 border-[#2c1810] pb-1 lg:pb-2 mb-1 lg:mb-2 inline-block self-start flex-none">
                        Collection
                    </h2>

                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-2 overflow-y-auto pr-1 no-scrollbar flex-1 content-start">
                        {levels.flatMap(level => level.scenes.map(scene => ({ scene, level }))).map(({ scene, level }) => {
                            const isCompleted = completedScenes.includes(scene.id);

                            // Find saved placement if exists
                            const savedLevelScenes = levelPlacements[level.id];
                            const savedScene = savedLevelScenes?.find(s => s.id === scene.id) || scene;

                            return (
                                <div key={scene.id} className={`p-1 lg:p-2 rounded border flex flex-col items-center gap-1 transition-all ${isCompleted ? 'bg-white/80 border-[#2c1810]/20 shadow-sm hover:scale-105' : 'bg-[#e6d5bc] border-[#2c1810]/5 opacity-60'}`}>
                                    <div className="w-full aspect-[4/3] rounded overflow-hidden relative bg-[#dccfb9]">
                                        {isCompleted ? (
                                            <MiniScene
                                                scene={savedScene}
                                                levelItems={level.availableItems}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-sm lg:text-xl opacity-20">?</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Level List */}
                <div className="flex flex-col gap-2 p-1 lg:p-4 overflow-hidden">
                    <h2 className="text-sm lg:text-2xl font-serif-bold uppercase tracking-widest border-b-2 border-[#2c1810] pb-1 lg:pb-2 mb-1 lg:mb-2 inline-block self-end flex-none">
                        Chapters
                    </h2>

                    <div className="flex flex-col gap-2 overflow-y-auto pr-1 no-scrollbar flex-1">
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
                                        group relative p-3 lg:p-5 rounded-lg border-2 text-left transition-all duration-300 flex-none
                                        ${accessible
                                            ? 'bg-[#EFE5D5] border-[#4a2c2a] hover:bg-[#4a2c2a] hover:text-[#EFE5D5] hover:shadow-lg cursor-pointer hover:-translate-y-0.5'
                                            : 'bg-[#cfc0aa] border-transparent opacity-50 cursor-not-allowed grayscale'
                                        }
                                    `}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <span className="text-[8px] lg:text-[10px] uppercase tracking-widest opacity-70 block mb-0.5">Chapter {index + 1}</span>
                                            <h3 className="text-xs lg:text-xl font-serif-bold truncate leading-tight">{accessible ? level.title : 'Locked ???'}</h3>
                                            <p className={`text-[9px] lg:text-xs mt-0.5 italic truncate ${accessible ? 'opacity-80' : 'opacity-0'}`}>{level.goal}</p>
                                        </div>

                                        <div className="text-sm lg:text-2xl flex-none">
                                            {accessible ? (
                                                <span className="transform group-hover:translate-x-1 transition-transform inline-block">→</span>
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
                                        <div className="absolute top-1 right-1 lg:top-2 lg:right-2 text-green-700 bg-white/50 rounded-full p-0.5 text-[10px] lg:text-sm leading-none" title="Level Complete">
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
