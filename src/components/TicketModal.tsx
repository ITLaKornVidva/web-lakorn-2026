import React from 'react';

interface TicketModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#f5e6d3] w-full max-w-md rounded-lg shadow-2xl p-8 text-center border-2 border-[#2c1810]">
                <h2 className="text-3xl font-serif-bold text-[#2c1810] mb-4 uppercase tracking-widest">
                    The End
                </h2>
                <p className="text-[#5d3a37] font-serif text-lg mb-8 leading-relaxed">
                    Your story has ended.<br />
                    Do you wish to know more about<br />
                    <span className="font-bold">LA DERNIÈRE?</span>
                </p>

                <div className="flex flex-col gap-3">
                    <a
                        href="https://ticketmelon.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#2c1810] hover:bg-[#4a2c2a] text-[#f5e6d3] font-serif-bold py-3 px-6 rounded-sm uppercase tracking-wide transition-colors"
                    >
                        Buy Ticket
                    </a>

                    <button
                        onClick={onClose}
                        className="w-full border-2 border-[#2c1810] text-[#2c1810] hover:bg-[#2c1810]/5 font-serif-bold py-3 px-6 rounded-sm uppercase tracking-wide transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
