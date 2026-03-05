export function VideoSection() {
    return (
        <div className="w-full bg-[#0A0A0A] py-20 px-6 flex justify-center items-center relative z-10">
            <div className="max-w-5xl w-full border-[3px] border-[#851C20] p-1 
                transform transition-transform duration-500 ease-out bg-black overflow-hidden">
                <div className="relative w-full aspect-video bg-black">
                    {/* YouTube Embed with parameters to minimize interface/off-site clicks */}
                    <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/ngpJE8-mUkg?rel=0&modestbranding=1&controls=1&showinfo=0&iv_load_policy=3"
                        title="LA DERNIÈRE Official Trailer"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>

                    {/* Subtle Overlay to catch some accidental title clicks while allowing play/pause */}
                    <div className="absolute top-0 left-0 w-full h-16 pointer-events-none bg-gradient-to-b from-black/40 to-transparent z-10" />
                </div>
            </div>
        </div>
    );
}
