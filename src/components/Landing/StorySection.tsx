import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function StorySection() {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="w-full bg-[#0A0A0A] py-16 px-6 flex justify-center items-center relative z-10">
            <div className="max-w-4xl w-full border-t border-b border-[#E2C37B]/30 py-6">
                {/* Header */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex justify-between items-center bg-transparent group cursor-pointer"
                >
                    <h2 className="text-3xl font-serif-bold text-[#E2C37B] tracking-[0.2em] uppercase">
                        STORY
                    </h2>
                    <div className={`transform transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}>
                        <svg
                            className="w-8 h-8 text-[#E2C37B]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>

                {/* Expandable Content */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: '2rem' }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="border-l-[3px] border-[#E2C37B] pl-6 md:pl-10 space-y-6">
                                <p className="text-white/80 text-base md:text-lg leading-loose font-chulalongkorn tracking-[0.12em]">
                                    หลังจากการตายของพ่อในงานวันเกิดของเขา ชาร์ลได้รับสมุดลึกลับที่ได้พาเขาย้อนเวลากลับมาในยุคที่พ่อและแม่ของเขายังเป็นหนุ่มสาว แต่ทว่าโอกาสที่สองของเขาในการใช้เวลาที่เหลือกับพ่อนั้นไม่ได้ง่ายอย่างที่คิด เพราะทั้งพ่อและแม่ยังไม่ได้รู้จักกันด้วยซ้ำ ยิ่งไปกว่านั้น สมุดลึกลับเล่มนั้นที่พาชาร์ลกลับมายังไปอยู่ในมือของเอลเลน่าที่ทำงานให้นายกเทศมนตรีของเมืองที่ปกครองเมืองด้วยวิธีแปลกประหลาด
                                </p>
                                <p className="text-white/80 text-base md:text-lg leading-loose font-chulalongkorn tracking-[0.12em]">
                                    ชาร์ลที่ยังสับสน และเคว้งคว้าง กับสภาพเมือง และพยายามตามหาสมุดเพื่อกลับไปยังโลกปัจจุบัน ได้ถูกช่วยเหลือจากกลุ่มคนในบาร์ลับแห่งหนึ่ง จึงทำให้เขาได้รู้ถึงความลับของเมือง ว่ากำลังมีเวทมนตร์บางอย่างที่คอยควบคุมความคิดของผู้คนอยู๋ และไม่นานหลังจากนั้นเหตุการณ์ที่มีคนตาย โดยเกิดจากเวทมนตร์นี้ได้กลายมาเป็นชนวนเหตุให้เกิดการเปลี่ยนแปลงในเมืองเกิดขึ้น

                                    ชาร์ลจึงพยายามเข้าไปพูดคุยกับเอลเลน่า และได้ค้นพบความจริงเกี่ยวกับเวทมนตร์นี้ที่ถูกนายกเทศมนตรีนำไปใช้ในทางที่ผิด เขาจึงชักชวนเธอเข้าร่วมกลุ่มและวางแผนกับกลุ่มในบาร์ เพื่อแก้ไขเวทมนตร์นี้ในพิธีกรรมประจำเมืองที่กำลังจะเกิดขึ้นในไม่ช้านี้
                                    และทำให้ทุกคนในเมืองได้รับอิสระคืนจากการทำงานเยี่ยงทาส แต่ต้องแลกด้วยโศกนาฏกรรมและการสูญเสียครั้งยิ่งใหญ่
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
