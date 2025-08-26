import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ThreatActor } from "@/data/threatActors";
import { ThreatActorParser } from "@/utils/ThreatActorParser";
import { Badge } from "@/components/ui/badge";

interface ThreatActorImporterProps {
  onImport: (actors: ThreatActor[]) => void;
}

export const ThreatActorImporter = ({ onImport }: ThreatActorImporterProps) => {
  const [htmlContent, setHtmlContent] = useState("");
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedActors, setParsedActors] = useState<ThreatActor[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setHtmlContent(content);
        parseContent(content);
      };
      reader.readAsText(file);
    }
  };

  const handleUrlFetch = async () => {
    if (!url.trim()) return;
    
    setIsProcessing(true);
    try {
      // In a real implementation, you'd use a CORS proxy or backend service
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      const content = data.contents;
      setHtmlContent(content);
      parseContent(content);
      
      toast({
        title: "✅ URL Fetched",
        description: "Content retrieved and parsed successfully!",
      });
    } catch (error) {
      toast({
        title: "❌ Fetch Failed",
        description: "Could not retrieve content from URL",
        variant: "destructive",
      });
    }
    setIsProcessing(false);
  };

  const parseContent = (content: string) => {
    try {
      const actors = ThreatActorParser.parseHtml(content);
      setParsedActors(actors);
      
      if (actors.length > 0) {
        toast({
          title: "🕷️ Threat Actors Detected",
          description: `Found ${actors.length} threat actor(s) in the content!`,
        });
      }
    } catch (error) {
      toast({
        title: "❌ Parse Error",
        description: "Could not parse threat actor data from content",
        variant: "destructive",
      });
    }
  };

  const handleImport = () => {
    if (parsedActors.length > 0) {
      onImport(parsedActors);
      toast({
        title: "🎮 Import Complete",
        description: `Successfully imported ${parsedActors.length} threat actor(s)!`,
      });
      setParsedActors([]);
      setHtmlContent("");
    }
  };

  return (
    <Card className="threat-card p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="retro-title text-2xl mb-2">
            📁 THREAT ACTOR IMPORTER 📁
          </h2>
          <p className="cyber-text text-sm">
            Upload HTML files or fetch from URLs to import threat intel data
          </p>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label className="font-cyber">Upload HTML File</Label>
          <Input
            type="file"
            accept=".html,.htm"
            onChange={handleFileUpload}
            className="neon-border file:bg-accent file:text-accent-foreground"
          />
        </div>

        {/* URL Fetch */}
        <div className="space-y-2">
          <Label className="font-cyber">Fetch from URL</Label>
          <div className="flex gap-2">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/threat-report"
              className="neon-border"
            />
            <Button
              onClick={handleUrlFetch}
              disabled={isProcessing || !url.trim()}
              className="bg-primary hover:bg-primary/80 font-cyber"
            >
              {isProcessing ? "⏳" : "🔍"}
            </Button>
          </div>
        </div>

        {/* Manual Input */}
        <div className="space-y-2">
          <Label className="font-cyber">Or Paste HTML Content</Label>
          <Textarea
            value={htmlContent}
            onChange={(e) => {
              setHtmlContent(e.target.value);
              if (e.target.value.trim()) {
                parseContent(e.target.value);
              }
            }}
            placeholder="Paste HTML content here..."
            className="min-h-[100px] neon-border font-mono text-xs"
          />
        </div>

        {/* Parsed Results */}
        {parsedActors.length > 0 && (
          <div className="space-y-4">
            <div className="neon-border p-3">
              <h3 className="cyber-text font-bold mb-2">
                🎯 Detected Threat Actors ({parsedActors.length})
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {parsedActors.map((actor, index) => (
                  <div key={index} className="border-2 border-border p-2 bg-card/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-retro font-bold">{actor.name}</span>
                      <Badge className="text-xs">
                        {actor.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {actor.description.substring(0, 80)}...
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleImport}
              className="w-full bg-destructive hover:bg-destructive/80 font-cyber"
            >
              🚀 IMPORT ALL THREAT ACTORS
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};