import { motion } from 'framer-motion';

export function HeroSection() {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0A] pt-20">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3A2A10]/40 via-[#0A0A0A] to-[#0A0A0A] z-0" />

            {/* Decorative Gears (Left and Right) */}
            <div className="absolute top-1/4 -left-[20%] md:-left-[10%] w-[250px] h-[250px] lg:w-[500px] lg:h-[500px] opacity-20 z-0">
                <img src="/assets/images/bg-gear-rotate.png" alt="" className="w-full h-full object-contain animate-[spin_60s_linear_infinite]" />
            </div>

            <div className="absolute bottom-1/4 -right-[20%] md:-right-[10%] w-[275px] h-[275px] lg:w-[600px] lg:h-[600px] opacity-20 z-0">
                <img src="/assets/images/bg-gear-rotate.png" alt="" className="w-full h-full object-contain animate-[spin_80s_reverse_linear_infinite]" />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl px-6 text-center">
                {/* Main Title & Subtitle */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="mb-16 flex flex-col items-center"
                >
                    <img src="/assets/images/hero-title-en.png" alt="LA DERNIÈRE" className="h-16 md:h-24 lg:h-32 w-auto mb-6 object-contain drop-shadow-2xl" />
                    <img src="/assets/images/hero-title-th.png" alt="กาลสลับพบพาน วันวานพบเธอ" className="h-8 md:h-12 lg:h-16 w-auto object-contain drop-shadow-xl mx-auto" />
                </motion.div>

                {/* Quote Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mb-16 max-w-2xl"
                >
                    <p className="text-white text-lg md:text-2xl font-sketchy italic leading-relaxed">
                        “อาจเป็นเพราะการเล่นกล ได้พาคนในวันวาน ให้มาพานพบอีกครั้ง”
                    </p>
                </motion.div>

                {/* Call to Action Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <a
                        href="https://www.ticketmelon.com/th/lakornvidva_official/lakornvidva2026?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#851C20] text-white px-10 py-4 md:px-14 md:py-5 rounded-full font-times font-bold tracking-[0.2em] text-lg md:text-xl transition-all shadow-xl hover:bg-[#4f0d10] active:scale-95 inline-block"
                    >
                        BUY TICKETS
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
