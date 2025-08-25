import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThreatActor } from "@/data/threatActors";

interface ThreatActorCardProps {
  actor: ThreatActor;
  onClick: () => void;
}

export const ThreatActorCard = ({ actor, onClick }: ThreatActorCardProps) => {
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
    <Card 
      className="threat-card p-4 cursor-pointer hover:bg-card/80 transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-retro text-lg font-bold text-foreground mb-1">
              {actor.name}
            </h3>
            <div className="flex flex-wrap gap-1 mb-2">
              {actor.aliases.slice(0, 2).map((alias, index) => (
                <span key={index} className="text-xs text-muted-foreground">
                  {alias}{index < actor.aliases.slice(0, 2).length - 1 && ','}
                </span>
              ))}
            </div>
          </div>
          <Badge className={`${getTypeColor(actor.type)} font-cyber text-xs border-2`}>
            {actor.type}
          </Badge>
        </div>

        {/* Stats Row */}
        <div className="flex justify-between items-center border-2 border-border p-2 bg-card/50">
          <div className="text-center">
            <div className="cyber-text text-sm font-bold">{actor.intelReports}</div>
            <div className="text-xs text-muted-foreground">Intel Reports</div>
          </div>
          <div className="text-center">
            <div className="cyber-text text-sm font-bold">{actor.vulnerabilities}</div>
            <div className="text-xs text-muted-foreground">Vulnerabilities</div>
          </div>
          <div className="text-center">
            <div className={`text-sm font-bold ${getStatusColor(actor.status)}`}>
              {actor.status}
            </div>
            <div className="text-xs text-muted-foreground">Status</div>
          </div>
        </div>

        {/* Description Preview */}
        <p className="text-sm text-foreground line-clamp-3 font-body">
          {actor.description.substring(0, 150)}...
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs neon-border">
            {actor.origin}
          </Badge>
          <Badge variant="outline" className="text-xs neon-border cyber-text">
            {actor.motivation}
          </Badge>
          <Badge variant="outline" className="text-xs neon-border">
            {actor.firstSeen}
          </Badge>
        </div>
      </div>
    </Card>
  );
};