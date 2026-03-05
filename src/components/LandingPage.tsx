import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-dvh w-full flex flex-col items-center justify-center relative overflow-hidden bg-slate-900 border-box">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)] animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            <motion.div
                className="z-10 flex flex-col items-center gap-12 text-center p-6 w-full max-w-4xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="space-y-4">
                    <motion.h1
                        className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-200 via-white to-blue-200 tracking-tight drop-shadow-lg"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    >
                        The Journey Begins
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-2xl text-blue-100/80 font-medium max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        A heroic quest awaits. Will you answer the call and discover what lies beyond?
                    </motion.p>
                </div>

                <motion.button
                    onClick={() => navigate('/game')}
                    className="group relative px-10 py-5 bg-white text-slate-900 font-bold text-xl rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] cursor-pointer"
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <span className="relative z-10 flex items-center gap-3">
                        Enter Game
                        <svg
                            className="w-6 h-6 transform transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
            </motion.div>

            {/* Decorative footer text */}
            <motion.div
                className="absolute bottom-8 text-blue-200/40 text-sm tracking-widest uppercase font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
            >
                © 2026 Lakorn Vidva Chula
            </motion.div>
        </div>
    );
}
