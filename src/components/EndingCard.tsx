import type { Item } from '../types';

interface EndingCardProps {
    userName: string;
    userAvatar: string;
    items?: Item[]; // Optional: show used items or favorite characters?
    className?: string;
    id?: string;
}

export const EndingCard = ({ userName, userAvatar, className = '', id }: EndingCardProps) => {
    return (
        <div
            id={id}
            className={`bg-white p-8 rounded-xl shadow-2xl border-4 border-emerald-100 max-w-md mx-auto aspect-[4/5] flex flex-col items-center justify-between ${className}`}
            style={{
                backgroundImage: 'radial-gradient(circle at center, #ffffff 0%, #f0fdf4 100%)'
            }}
        >
            <div className="text-center w-full">
                <div className="text-sm font-bold tracking-widest text-emerald-600 uppercase mb-2">
                    Story Completed
                </div>
                <h2 className="text-3xl font-serif text-slate-800 mb-1">
                    The Storyteller
                </h2>
                <div className="h-1 w-20 bg-emerald-400 mx-auto rounded-full mb-6"></div>
            </div>

            <div className="flex flex-col items-center justify-center flex-grow">
                <div className="w-32 h-32 text-8xl flex items-center justify-center bg-emerald-100 rounded-full border-4 border-white shadow-lg mb-6">
                    {userAvatar}
                </div>
                <h3 className="text-2xl font-bold text-slate-700">
                    {userName}
                </h3>
                <p className="text-slate-500 italic mt-2 text-center px-4">
                    "Through pages of time and twists of fate, a new legend is written."
                </p>
            </div>

            <div className="w-full text-center mt-6 pt-6 border-t border-emerald-100">
                <p className="text-xs text-slate-400 font-serif">
                    Lakorn Vidva 2026
                </p>
            </div>
        </div>
    );
};
