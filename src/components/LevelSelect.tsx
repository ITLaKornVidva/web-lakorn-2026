import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { levels } from '../data/levels';

export const LevelSelect = () => {
    const navigate = useNavigate();
    const { unlockedLevels, completedScenes } = useGameStore();

    const handleLevelClick = (levelId: string) => {
        if (unlockedLevels.includes(levelId)) {
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
                        {levels.flatMap(l => l.scenes).map(scene => {
                            const isCompleted = completedScenes.includes(scene.id);

                            return (
                                <div key={scene.id} className={`p-3 rounded border flex flex-col items-center gap-2 transition-all ${isCompleted ? 'bg-white/80 border-[#2c1810]/20 shadow-sm hover:scale-105' : 'bg-[#e6d5bc] border-[#2c1810]/5 opacity-60'}`}>
                                    <div className="w-full aspect-video rounded overflow-hidden relative bg-[#dccfb9]">
                                        {isCompleted && scene.backgroundImage ? (
                                            <img src={scene.backgroundImage} alt={scene.id} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                {isCompleted ? (
                                                    <span className="text-2xl">✓</span>
                                                ) : (
                                                    <span className="text-2xl opacity-20">?</span>
                                                )}
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
                            const isUnlocked = unlockedLevels.includes(level.id);
                            // Level 1 (index 0) is always accessible if unlocks fail, but store should handle it.
                            const accessible = isUnlocked || index === 0;

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
