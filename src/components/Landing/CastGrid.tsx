import { useState } from 'react';
import { motion } from 'framer-motion';
import { CastModal, type Cast } from './CastModal';

const casts: Cast[] = [
    {
        id: 1, name: 'CHARLES', role: 'Lead', image: '/assets/images/cast-charles-portrait.png', cardImage: '/assets/images/cast-charles-card.png', message: '“ถ้าเรื่องวันนั้นเป็นแค่ความฝันที่ตื่นมาแล้วหายไปก็คงดี”',
        imageConfig: { scale: 1.0, offset: { x: 0, y: 18 }, rotate: 0 }
    },
    {
        id: 2, name: 'ARSHA', role: 'Support', image: '/assets/images/cast-arsha-portrait.png', cardImage: '/assets/images/cast-arsha-card.png', message: '“ ถ้านายคิดจะหักหลังพวกเราละก็… ฉันไม่ปล่อยนายไว้แน่ ”',
        imageConfig: { scale: 0.95, offset: { x: 0, y: 15 }, rotate: 0 }
    },
    {
        id: 3, name: 'DUSTIN', role: 'Support', image: '/assets/images/cast-dustin-portrait.png', cardImage: '/assets/images/cast-dustin-card.png', message: '“ ผมแค่หวังว่าจะมีใครสักคนที่รับฟังความคิดของผม… ”',
        imageConfig: { scale: 0.73, offset: { x: 0, y: 25 }, rotate: 0 }
    },
    {
        id: 4, name: 'ELLENA', role: 'Support', image: '/assets/images/cast-ellena-portrait.png', cardImage: '/assets/images/cast-ellena-card.png', message: '“ แค่คุณเทพธิดาเห็นรอยยิ้มที่มีความสุขของทุกคน ก็ถือเป็นรางวัลอันแสนล้ำค่าของเธอแล้วละ ”',
        imageConfig: { scale: 0.95, offset: { x: -5, y: 15 }, rotate: 0 }
    },
    {
        id: 5, name: 'RICHARD', role: 'Support', image: '/assets/images/cast-richard-portrait.png', cardImage: '/assets/images/cast-richard-card.png', message: '“ ทุกคนมีหน้าที่ของตัวเองทั้งนั้นแหละครับ ”',
        imageConfig: { scale: 0.7, offset: { x: 0, y: 10 }, rotate: 0 }
    },
    {
        id: 6, name: 'FENRIC', role: 'Support', image: '/assets/images/cast-fenric-portrait.png', cardImage: '/assets/images/cast-fenric-card.png', message: '“ หนังสือพิมพ์ไหมคร้าบบบบบ พี่สาวสุดสวยที่อ่านข้อความนี้อยู่อ่ะครับ หนังสือพิมพ์สักฉบับไหม? ”',
        imageConfig: { scale: 0.95, offset: { x: -30, y: 5 }, rotate: 0 }
    },
    {
        id: 7, name: 'WILLIAM', role: 'Support', image: '/assets/images/cast-william-portrait.png', cardImage: '/assets/images/cast-william-card.png', message: '“ ทำงานกันมาเหนื่อย ๆ อยากกินอะไรกันล่ะ เดียวฉันชงให้เอง ”',
        imageConfig: { scale: 0.9, offset: { x: -5, y: 10 }, rotate: 0 }
    },
];

export function CastGrid() {
    const [selectedCast, setSelectedCast] = useState<Cast | null>(null);

    return (
        <div className="w-full bg-[#0A0A0A] py-20 px-6 relative overflow-hidden flex flex-col items-center">
            {/* Decorative Gear Background */}
            <div className="absolute top-1/2 -left-[5%] w-[300px] h-[300px] opacity-20 z-0">
                <img src="/assets/images/bg-gear-rotate.png" alt="" className="w-full h-full object-contain animate-[spin_60s_linear_infinite]" />
            </div>

            <div className="relative z-10 w-full max-w-5xl">
                <h2 className="text-2xl md:text-3xl font-serif-bold text-[#E2C37B] tracking-[0.2em] text-center mb-16 uppercase">
                    MEET OUR CASTS
                </h2>

                {/* Grid Layout Container */}
                <div className="flex flex-col items-center gap-12 w-full">
                    {/* Top Row: 1 item (Charles) */}
                    <div className="flex justify-center w-full">
                        <CastItem cast={casts[0]} onClick={() => setSelectedCast(casts[0])} />
                    </div>

                    {/* Device specific layouts */}
                    {/* Desktop Layout: rows of 3 */}
                    <div className="hidden md:flex flex-col gap-12 w-full">
                        <div className="flex justify-center gap-16">
                            {casts.slice(1, 4).map(cast => <CastItem key={cast.id} cast={cast} onClick={() => setSelectedCast(cast)} />)}
                        </div>
                        <div className="flex justify-center gap-16">
                            {casts.slice(4, 7).map(cast => <CastItem key={cast.id} cast={cast} onClick={() => setSelectedCast(cast)} />)}
                        </div>
                    </div>

                    {/* Mobile Layout: rows of 2 */}
                    <div className="md:hidden flex flex-col gap-10 w-full">
                        <div className="flex flex-wrap justify-center gap-8">
                            {casts.slice(1, 7).map(cast => <CastItem key={cast.id} cast={cast} onClick={() => setSelectedCast(cast)} />)}
                        </div>
                    </div>
                </div>
            </div>

            <CastModal cast={selectedCast} onClose={() => setSelectedCast(null)} />
        </div>
    );
}

function CastItem({ cast, onClick }: { cast: Cast; onClick: () => void }) {
    return (
        <motion.div
            className="flex flex-col items-center group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onClick={onClick}
        >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full relative mb-4">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-white opacity-20 rounded-full blur-xl group-hover:bg-[#E2C37B] group-hover:opacity-40 transition-all duration-500" />

                {/* Portrait container */}
                <div className="absolute inset-0 rounded-full overflow-hidden bg-[radial-gradient(circle,white_0%,#e5e7eb_100%)] z-10 flex items-center justify-center transform group-hover:scale-[1.03] transition-transform duration-300">
                    {cast.image ? (
                        <img
                            src={cast.image}
                            alt={cast.name}
                            className="absolute w-full h-auto min-h-full max-w-none transition-transform duration-300"
                            style={{
                                transform: `
                                    translate(${cast.imageConfig?.offset?.x || 0}px, ${cast.imageConfig?.offset?.y || 0}px)
                                    scale(${cast.imageConfig?.scale || 1})
                                    rotate(${cast.imageConfig?.rotate || 0}deg)
                                `
                            }}
                        />
                    ) : (
                        <span className="text-4xl text-black/20 font-serif-bold">{cast.name.charAt(0)}</span>
                    )}
                </div>
            </div>
            <h3 className="text-white font-serif-bold tracking-widest text-sm md:text-base group-hover:text-[#E2C37B] transition-colors">{cast.name}</h3>
            <span className="font-serif-bold tracking-widest text-[9px] md:text-[10px] text-slate-700">Click to view</span>
        </motion.div>
    );
}
