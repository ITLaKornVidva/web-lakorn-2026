import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll event to add a background to the navbar when scrolled
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'LAKORN TELLER', href: '/game', external: false },
        { name: 'PERSONALITEST', href: '#', external: true },
    ];

    const BUY_TICKETS_URL = "https://www.ticketmelon.com/th/lakornvidva_official/lakornvidva2026?utm_source=ig&utm_medium=social&utm_content=link_in_bio";

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled || isMobileMenuOpen ? 'bg-[#1A1A1A]' : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <a href="/" className="block">
                            <img src="/assets/images/nav-logo-gold.png" alt="LA DERNIÈRE" className="h-8 lg:h-10 w-auto object-contain" />
                        </a>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-white text-sm tracking-widest font-semibold hover:text-[#E2C37B] transition-colors flex items-center gap-1 uppercase"
                                target={link.external ? '_blank' : '_self'}
                                rel={link.external ? 'noopener noreferrer' : ''}
                            >
                                {link.name}
                                {link.external && (
                                    <svg
                                        className="w-4 h-4 opacity-70"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                )}
                            </a>
                        ))}

                        <a
                            href={BUY_TICKETS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#851C20] hover:bg-[#6b1519] text-white px-6 py-2 rounded-full font-serif-bold tracking-widest text-sm transition-all transform active:scale-95 whitespace-nowrap"
                        >
                            BUY TICKETS
                        </a>
                    </div>

                    {/* Mobile Hamburger */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-white focus:outline-none p-2"
                            aria-label="Toggle menu"
                        >
                            <div className="w-6 h-5 flex flex-col justify-between items-end">
                                <span className={`h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`}></span>
                                <span className={`h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'w-6'}`}></span>
                                <span className={`h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'w-6 -rotate-45 -translate-y-2.5' : 'w-6'}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed top-[72px] left-0 right-0 bg-[#1A1A1A] z-40 border-t border-white/10 overflow-hidden md:hidden shadow-xl"
                    >
                        <div className="px-6 py-8 flex flex-col gap-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-white flex items-center justify-between text-sm tracking-widest font-semibold hover:text-[#E2C37B] transition-colors uppercase"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                    {link.external && (
                                        <svg
                                            className="w-4 h-4 opacity-70"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    )}
                                </a>
                            ))}

                            <a
                                href={BUY_TICKETS_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#851C20] hover:bg-[#6b1519] text-white w-full py-4 rounded-full font-serif-bold tracking-widest text-sm transition-all shadow-md mt-4 text-center block"
                            >
                                BUY TICKETS
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
