export function Footer() {
    const sponsors = [
        { name: 'GIS', img: '/assets/images/sponsor-gis.png' },
        { name: 'CP ALL', img: '/assets/images/sponsor-cp.png' },
        { name: 'LANNA', img: '/assets/images/sponsor-3.png' },
        { name: 'XXX', img: '/assets/images/sponsor-4.png' },
    ];

    return (
        <footer className="w-full bg-[#0A0A0A] pt-12 pb-6 px-6 flex flex-col items-center border-t border-white/5 relative z-10 overflow-hidden">
            {/* Red Background Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-full w-full bg-gradient-to-t from-red-900/40 via-red-900/10 to-transparent z-[-1] pointer-events-none" />

            {/* Date & Venue */}
            <div className="text-center mb-10 max-w-2xl">
                <p className="text-white/80 text-sm md:text-base tracking-widest leading-loose font-sketchy">
                    มาร่วมเดินทางไปพร้อมกันในวันที่ 20-22 มีนาคม 2569<br />
                    ณ หอประชุมคณะวิศวกรรมศาสตร์
                </p>
            </div>

            <div className="w-full max-w-3xl border-t border-white/10 mb-10" />

            {/* Social Icons */}
            <div className="flex gap-6 mb-12">
                <SocialIcon platform="instagram" />
                <SocialIcon platform="tiktok" />
                <SocialIcon platform="facebook" />
            </div>

            {/* Sponsors Grid */}
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 w-full max-w-5xl opacity-80">
                {sponsors.map((sponsor, idx) => (
                    <div key={idx} className="w-24 h-12 flex items-center justify-center transition-all duration-300">
                        {sponsor.img ? (
                            <img src={sponsor.img} alt={sponsor.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                            <div className="text-white/40 text-xs font-bold tracking-widest border border-white/20 px-4 py-2 rounded">
                                {sponsor.name}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </footer>
    );
}

function SocialIcon({ platform }: { platform: 'instagram' | 'tiktok' | 'facebook' }) {
    const images = {
        instagram: '/assets/images/social-ig.png',
        tiktok: '/assets/images/social-tiktok.png',
        facebook: '/assets/images/social-fb.png'
    };

    const links = {
        instagram: 'https://www.instagram.com/lakornvidva/',
        tiktok: 'https://www.tiktok.com/@culakornvidva',
        facebook: 'https://www.facebook.com/culakornvidva/'
    };

    return (
        <a
            href={links[platform]}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-[#F2C94C] flex items-center justify-center hover:bg-white hover:scale-110 transition-all p-[10px]"
        >
            <img src={images[platform]} alt={platform} className="w-full h-full object-contain" />
        </a>
    );
}
