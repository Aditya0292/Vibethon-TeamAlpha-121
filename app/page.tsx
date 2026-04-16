import Navbar from "@/components/Navbar";
import HeroContent from "@/components/HeroContent";
import AccessTerminal from "@/components/AccessTerminal";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      {/* CRT scanline overlay */}
      <Navbar />

      <main className="min-h-screen pt-16 relative">
        {/* Hero background radial glow */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
          <img 
            alt="Matrix Background" 
            className="w-full h-full object-cover opacity-20 mix-blend-screen grayscale brightness-50" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuANhVPsTXsZi-k7Hp9zsOiqBIA3vtCstulxSfZw4dqvgiA7pCkbzSG4E60noLc4PkHwepq3Aasa3NtcQDbal8C-s6HBD6ecvxwp6fyrKo7KjGQOcKojs-EiDV5qJRGAdm6Dkz0mniHGBTtBO5earJdoDIX0PIGqGCgOTmpcyzDYW_4K1EwODl19h1p14wXglJJyV651EdNrkoux8_GEOIraezB5eDWnrWTXV1a0yHvvdpu66wTgsnvIYT05TJtuvYoCjXSU8cp36E4"
          />
        </div>

        {/* Hero section */}
        <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16">
          <HeroContent />
          <AccessTerminal />
        </div>
      </main>

      <Footer />

      {/* Side decorations */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 h-64 w-1 bg-primary/20" />
      <div className="fixed right-2 top-1/2 -translate-y-1/2 h-48 w-px bg-primary/40" />
    </>
  );
}
