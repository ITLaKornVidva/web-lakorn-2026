import React from 'react';

interface DiscountCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProceed: () => void;
}

export const DiscountCodeModal: React.FC<DiscountCodeModalProps> = ({ isOpen, onClose, onProceed }) => {
    if (!isOpen) return null;

    const discountCode = '5PERCENTMISSINGSCENE';
    const ticketUrl = 'https://www.ticketmelon.com/th/lakornvidva_official/lakornvidva2026?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnYmZVPGy-7xnMwvhDjlG3TVkM8eZQP8oPZabo2LW1p5wK1HGAl6Z557TzaLg_aem_mVeCv3jjvneT3N-gui9Elw';

    const handleBuyTicket = () => {
        window.open(ticketUrl, '_blank', 'noopener,noreferrer');
        onProceed();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#f5e6d3] w-full max-w-md rounded-lg shadow-2xl p-8 text-center border-2 border-[#2c1810] relative overflow-hidden">

                {/* Background Texture Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-multiply bg-[url('/assets/parchment-texture.png')] bg-cover" />

                {/* Content */}
                <div className="relative z-10">
                    {/* Headline */}
                    <h2 className="text-3xl font-serif-bold text-[#2c1810] mb-6 uppercase tracking-widest">
                        Don't Forget!
                    </h2>

                    <p className="text-[#5d3a37] font-serif text-lg mb-6 leading-relaxed">
                        Use this exclusive discount code<br />
                        to save on your ticket:
                    </p>

                    {/* Discount Code Display */}
                    <div className="mb-8 bg-gradient-to-br from-[#2c1810] to-[#4a2c2a] p-6 rounded-sm shadow-lg border-2 border-[#2c1810]">
                        <div className="bg-[#f5e6d3] rounded px-4 py-3 border-2 border-dashed border-[#8d2a2a]">
                            <p className="text-xs uppercase tracking-wider text-[#5d3a37] font-serif-bold mb-1">
                                Discount Code
                            </p>
                            <p className="text-2xl font-serif-bold text-[#2c1810] tracking-wider select-all break-all">
                                {discountCode}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleBuyTicket}
                            className="w-full bg-[#2c1810] hover:bg-[#4a2c2a] text-[#f5e6d3] font-serif-bold py-3 px-6 rounded-sm uppercase tracking-wide transition-colors cursor-pointer shadow-lg transform hover:scale-105"
                        >
                            Buy Ticket Now
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full border-2 border-[#2c1810] text-[#2c1810] hover:bg-[#2c1810]/5 font-serif-bold py-3 px-6 rounded-sm uppercase tracking-wide transition-colors cursor-pointer"
                        >
                            Close
                        </button>
                    </div>

                    {/* Hint */}
                    <p className="text-xs text-[#5d3a37]/70 font-serif mt-4 italic">
                        Tap the code to select and copy
                    </p>
                </div>
            </div>
        </div>
    );
};
