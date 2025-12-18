import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Smartphone } from 'lucide-react'

interface OrientationGuardProps {
    children: ReactNode
}

export function OrientationGuard({ children }: OrientationGuardProps) {
    return (
        <>
            {/* Portrait Mode Overlay */}
            <div className="fixed inset-0 z-[9999] bg-black text-white flex flex-col items-center justify-center block landscape:hidden">
                <motion.div
                    animate={{ rotate: 90 }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 1,
                        ease: "easeInOut"
                    }}
                    className="mb-8"
                >
                    <Smartphone size={64} className="text-white" />
                </motion.div>

                <h2 className="text-2xl font-bold mb-4 text-center px-4">
                    Please Rotate Your Device
                </h2>
                <p className="text-gray-400 text-center px-8 max-w-md">
                    This game is designed to be played in landscape mode for the best experience.
                </p>
            </div>

            {/* Main Content - Only visible in landscape */}
            <div className="h-dvh w-screen overflow-hidden hidden landscape:block game-bg">
                {children}
            </div>
        </>
    )
}
