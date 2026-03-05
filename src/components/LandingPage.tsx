import { Navbar } from './Landing/Navbar';
import { HeroSection } from './Landing/HeroSection';
import { VideoSection } from './Landing/VideoSection';
import { StorySection } from './Landing/StorySection';
import { CastGrid } from './Landing/CastGrid';
import { Footer } from './Landing/Footer';

export function LandingPage() {
    return (
        <div className="min-h-dvh w-full flex flex-col relative overflow-x-hidden bg-[#0A0A0A]">
            <Navbar />

            <main className="flex-grow w-full">
                <HeroSection />
                <VideoSection />
                <StorySection />
                <CastGrid />
            </main>

            <Footer />
        </div>
    );
}
