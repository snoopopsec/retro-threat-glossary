import { useState, useMemo } from "react";
import { ThreatActorCard } from "@/components/ThreatActorCard";
import { ThreatActorModal } from "@/components/ThreatActorModal";
import { ThreatActorManager } from "@/components/ThreatActorManager";
import { SearchBox } from "@/components/SearchBox";
import { Button } from "@/components/ui/button";
import { threatActors as initialThreatActors, ThreatActor } from "@/data/threatActors";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActor, setSelectedActor] = useState<ThreatActor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const [threatActors, setThreatActors] = useState<ThreatActor[]>(initialThreatActors);

  const filteredActors = useMemo(() => {
    if (!searchQuery.trim()) return threatActors;
    
    const query = searchQuery.toLowerCase();
    return threatActors.filter(actor => 
      actor.name.toLowerCase().includes(query) ||
      actor.aliases.some(alias => alias.toLowerCase().includes(query)) ||
      actor.description.toLowerCase().includes(query) ||
      actor.malwareUsed.some(malware => malware.toLowerCase().includes(query)) ||
      actor.targetIndustries.some(industry => industry.toLowerCase().includes(query)) ||
      actor.targetCountries.some(country => country.toLowerCase().includes(query)) ||
      actor.origin.toLowerCase().includes(query) ||
      actor.type.toLowerCase().includes(query) ||
      actor.motivation.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleActorClick = (actor: ThreatActor) => {
    setSelectedActor(actor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedActor(null);
  };

  const handleAddActor = (actor: ThreatActor) => {
    setThreatActors(prev => [...prev, actor]);
  };

  const handleUpdateActor = (updatedActor: ThreatActor) => {
    setThreatActors(prev => prev.map(actor => 
      actor.id === updatedActor.id ? updatedActor : actor
    ));
  };

  const handleImportActors = (newActors: ThreatActor[]) => {
    setThreatActors(prev => {
      const existingIds = new Set(prev.map(a => a.id));
      const uniqueNewActors = newActors.filter(a => !existingIds.has(a.id));
      return [...prev, ...uniqueNewActors];
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Scrolling Header */}
      <div className="bg-destructive border-b-4 border-accent overflow-hidden">
        <div className="marquee py-2">
          <span className="retro-title text-xl text-destructive-foreground">
            🚨 THREAT ACTOR DATABASE - ACTIVE ADVERSARIES DETECTED 🚨 
            APT GROUPS - RANSOMWARE GANGS - NATION STATE ACTORS 🚨 
            CLASSIFIED INTELLIGENCE BRIEFING 🚨
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="retro-title text-4xl md:text-6xl mb-4">
            🕷️ RETRO THREAT GLOSSARY 🕷️
          </h1>
          <p className="cyber-text text-xl mb-6">
            Your 90s Style Cyber Threat Intelligence Database
          </p>
          <div className="neon-border p-4 mx-auto max-w-2xl mb-6">
            <p className="font-body text-foreground">
              Welcome to the most radical threat actor database on the web! 
              Search through our collection of APT groups, ransomware gangs, 
              and cyber adversaries with all the 90s flair you can handle! 🎮
            </p>
          </div>
        </div>

        {/* Management Toggle */}
        <div className="text-center mb-6">
          <Button
            onClick={() => setShowManager(!showManager)}
            className="bg-accent hover:bg-accent/80 font-cyber text-accent-foreground"
          >
            {showManager ? "👁️ VIEW DATABASE" : "⚙️ MANAGE ACTORS"}
          </Button>
        </div>

        {showManager ? (
          <ThreatActorManager
            actors={threatActors}
            onAddActor={handleAddActor}
            onUpdateActor={handleUpdateActor}
            onImportActors={handleImportActors}
          />
        ) : (
          <>
            {/* Search */}
            <div className="mb-8">
              <SearchBox 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search threat actors, malware, countries..."
              />
            </div>

            {/* Results Count */}
            <div className="text-center mb-6">
              <div className="inline-block neon-border p-2">
                <span className="cyber-text font-bold">
                  {filteredActors.length} THREAT ACTORS FOUND
                </span>
              </div>
            </div>

            {/* Threat Actor Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredActors.map((actor) => (
                <ThreatActorCard
                  key={actor.id}
                  actor={actor}
                  onClick={() => handleActorClick(actor)}
                />
              ))}
            </div>

            {/* No Results */}
            {filteredActors.length === 0 && (
              <div className="text-center py-12">
                <div className="threat-card p-8 inline-block">
                  <h3 className="retro-title text-2xl mb-4">
                    🚫 NO THREATS DETECTED 🚫
                  </h3>
                  <p className="font-body text-muted-foreground">
                    No threat actors match your search criteria. 
                    Try searching for APT groups, ransomware, or country names!
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-card border-t-4 border-accent mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <div className="cyber-text text-sm mb-2">
            🎮 POWERED BY 90s WEB TECHNOLOGY 🎮
          </div>
          <div className="font-body text-xs text-muted-foreground">
            For educational and research purposes only. 
            All threat intelligence data is publicly available information.
          </div>
        </div>
      </footer>

      {/* Modal */}
      <ThreatActorModal
        actor={selectedActor}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;
