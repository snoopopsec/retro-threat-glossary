import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ThreatActor } from "@/data/threatActors";
import { X, AlertTriangle, Globe, Calendar, Target, Zap } from "lucide-react";

interface ThreatActorModalProps {
  actor: ThreatActor | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ThreatActorModal = ({ actor, isOpen, onClose }: ThreatActorModalProps) => {
  if (!actor) return null;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'APT': return 'bg-destructive text-destructive-foreground';
      case 'Ransomware': return 'bg-primary text-primary-foreground';
      case 'eCrime': return 'bg-accent text-accent-foreground';
      case 'Nation State': return 'bg-secondary text-secondary-foreground';
      case 'Hacktivist': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-destructive blink';
      case 'Inactive': return 'text-muted-foreground';
      default: return 'text-accent';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-4 border-destructive">
        <DialogHeader className="neon-border p-4 mb-4">
          <DialogTitle className="retro-title text-2xl text-center">
            🕷️ {actor.name} 🕷️
          </DialogTitle>
          <div className="flex justify-center gap-2 mt-2">
            <Badge className={`${getTypeColor(actor.type)} font-cyber border-2`}>
              {actor.type}
            </Badge>
            <Badge className={`${getStatusColor(actor.status)} font-cyber border-2`}>
              {actor.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Aliases */}
          <div className="neon-border p-4">
            <h3 className="cyber-text text-lg font-bold mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              ALIASES
            </h3>
            <div className="flex flex-wrap gap-2">
              {actor.aliases.map((alias, index) => (
                <Badge key={index} variant="outline" className="neon-border cyber-text">
                  {alias}
                </Badge>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="threat-card p-4">
              <h3 className="cyber-text text-lg font-bold mb-3 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                ORIGIN & TIMELINE
              </h3>
              <div className="space-y-2 font-body">
                <div><strong>Origin:</strong> {actor.origin}</div>
                <div><strong>First Seen:</strong> {actor.firstSeen}</div>
                <div><strong>Last Seen:</strong> {actor.lastSeen}</div>
                <div><strong>Motivation:</strong> {actor.motivation}</div>
              </div>
            </div>

            <div className="threat-card p-4">
              <h3 className="cyber-text text-lg font-bold mb-3 flex items-center gap-2">
                <Target className="h-5 w-5" />
                THREAT METRICS
              </h3>
              <div className="space-y-2 font-body">
                <div><strong>Intel Reports:</strong> <span className="cyber-text">{actor.intelReports}</span></div>
                <div><strong>Vulnerabilities:</strong> <span className="cyber-text">{actor.vulnerabilities}</span></div>
                <div><strong>Status:</strong> <span className={getStatusColor(actor.status)}>{actor.status}</span></div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="neon-border p-4">
            <h3 className="cyber-text text-lg font-bold mb-3">DESCRIPTION</h3>
            <p className="font-body text-foreground leading-relaxed">
              {actor.description}
            </p>
          </div>

          {/* Malware Used */}
          <div className="threat-card p-4">
            <h3 className="cyber-text text-lg font-bold mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              MALWARE ARSENAL
            </h3>
            <div className="flex flex-wrap gap-2">
              {actor.malwareUsed.map((malware, index) => (
                <Badge key={index} className="bg-destructive text-destructive-foreground border-2">
                  {malware}
                </Badge>
              ))}
            </div>
          </div>

          {/* Target Industries */}
          <div className="neon-border p-4">
            <h3 className="cyber-text text-lg font-bold mb-3">TARGET INDUSTRIES</h3>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {actor.targetIndustries.map((industry, index) => (
                <Badge key={index} variant="outline" className="neon-border text-xs">
                  {industry}
                </Badge>
              ))}
            </div>
          </div>

          {/* Target Countries */}
          <div className="neon-border p-4">
            <h3 className="cyber-text text-lg font-bold mb-3">TARGET COUNTRIES</h3>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {actor.targetCountries.map((country, index) => (
                <Badge key={index} variant="outline" className="neon-border text-xs">
                  {country}
                </Badge>
              ))}
            </div>
          </div>

          {/* MITRE ATT&CK Techniques */}
          <div className="threat-card p-4">
            <h3 className="cyber-text text-lg font-bold mb-3">MITRE ATT&CK TECHNIQUES</h3>
            <div className="flex flex-wrap gap-2">
              {actor.techniques.map((technique, index) => (
                <Badge key={index} className="bg-primary text-primary-foreground border-2 font-mono">
                  {technique}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};