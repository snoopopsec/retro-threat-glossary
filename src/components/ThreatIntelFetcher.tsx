import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ThreatActor } from "@/data/threatActors";

interface ExtractedIntel {
  actorName: string;
  aliases: string[];
  malware: string[];
  techniques: string[];
  industries: string[];
  countries: string[];
  indicators: string[];
  summary: string;
  confidence: 'High' | 'Medium' | 'Low';
}

interface ThreatIntelFetcherProps {
  onIntelExtracted: (intel: ExtractedIntel) => void;
}

export const ThreatIntelFetcher = ({ onIntelExtracted }: ThreatIntelFetcherProps) => {
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [extractedIntel, setExtractedIntel] = useState<ExtractedIntel | null>(null);
  const { toast } = useToast();

  const handleFetchUrl = async () => {
    if (!url.trim()) return;
    
    setIsFetching(true);
    try {
      // For demo purposes, we'll use a CORS proxy
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      const fetchedContent = data.contents;
      setContent(fetchedContent);
      await extractIntelligence(fetchedContent, url);
      
      toast({
        title: "📡 Content Fetched",
        description: "Successfully retrieved and analyzed content!",
      });
    } catch (error) {
      toast({
        title: "❌ Fetch Failed",
        description: "Could not retrieve content from URL",
        variant: "destructive",
      });
    }
    setIsFetching(false);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (newContent.trim()) {
      extractIntelligence(newContent);
    }
  };

  const extractIntelligence = async (text: string, sourceUrl?: string) => {
    // AI-powered extraction simulation
    const intel = await simulateIntelExtraction(text, sourceUrl);
    setExtractedIntel(intel);
    
    if (intel.actorName) {
      toast({
        title: "🎯 Intel Extracted",
        description: `Found intelligence about ${intel.actorName}`,
      });
    }
  };

  const simulateIntelExtraction = async (text: string, sourceUrl?: string): Promise<ExtractedIntel> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerText = text.toLowerCase();
    
    // Extract potential threat actor names
    const actorPatterns = [
      /apt[- ]?\d+/gi,
      /lazarus/gi,
      /fancy bear/gi,
      /cozy bear/gi,
      /carbanak/gi,
      /equation/gi,
      /turla/gi,
      /kimsuky/gi,
      /darkhydrus/gi,
      /fin\d+/gi
    ];
    
    let actorName = "Unknown Actor";
    for (const pattern of actorPatterns) {
      const match = text.match(pattern);
      if (match) {
        actorName = match[0];
        break;
      }
    }

    // Extract aliases
    const aliases: string[] = [];
    const aliasMatch = text.match(/(?:also known as|aka|alias|aliases)[:\s]*([^\.]{1,100})/gi);
    if (aliasMatch) {
      aliases.push(...aliasMatch[0].split(/[,;]/).map(a => a.trim()));
    }

    // Extract malware
    const malwarePatterns = [
      /trojan/gi, /backdoor/gi, /ransomware/gi, /loader/gi, /stealer/gi,
      /rat\b/gi, /rootkit/gi, /botnet/gi, /wiper/gi, /downloader/gi
    ];
    const malware: string[] = [];
    malwarePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) malware.push(...matches);
    });

    // Extract MITRE techniques
    const techniquePattern = /T\d{4}(?:\.\d{3})?/g;
    const techniques = text.match(techniquePattern) || [];

    // Extract industries
    const industryPatterns = [
      /financial/gi, /healthcare/gi, /government/gi, /defense/gi, /energy/gi,
      /manufacturing/gi, /retail/gi, /education/gi, /technology/gi, /telecommunications/gi
    ];
    const industries: string[] = [];
    industryPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) industries.push(...matches);
    });

    // Extract countries
    const countryPatterns = [
      /united states/gi, /russia/gi, /china/gi, /north korea/gi, /iran/gi,
      /ukraine/gi, /germany/gi, /france/gi, /japan/gi, /south korea/gi
    ];
    const countries: string[] = [];
    countryPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) countries.push(...matches);
    });

    // Extract IoCs
    const iocPatterns = [
      /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, // IP addresses
      /\b[a-fA-F0-9]{32}\b/g, // MD5 hashes
      /\b[a-fA-F0-9]{40}\b/g, // SHA1 hashes
      /\b[a-fA-F0-9]{64}\b/g, // SHA256 hashes
      /\b[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g // Domains
    ];
    const indicators: string[] = [];
    iocPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) indicators.push(...matches);
    });

    // Generate summary
    const summary = text.substring(0, 300) + (text.length > 300 ? "..." : "");

    // Determine confidence based on content quality
    let confidence: 'High' | 'Medium' | 'Low' = 'Low';
    const qualityScore = malware.length + techniques.length + industries.length + countries.length;
    if (qualityScore > 10) confidence = 'High';
    else if (qualityScore > 5) confidence = 'Medium';

    return {
      actorName,
      aliases: [...new Set(aliases)].slice(0, 5),
      malware: [...new Set(malware)].slice(0, 10),
      techniques: [...new Set(techniques)].slice(0, 15),
      industries: [...new Set(industries)].slice(0, 10),
      countries: [...new Set(countries)].slice(0, 10),
      indicators: [...new Set(indicators)].slice(0, 20),
      summary,
      confidence
    };
  };

  const handleUseIntel = () => {
    if (extractedIntel) {
      onIntelExtracted(extractedIntel);
      toast({
        title: "🚀 Intel Applied",
        description: "Intelligence data has been prepared for merging!",
      });
    }
  };

  return (
    <Card className="threat-card p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="retro-title text-2xl mb-2">
            📡 THREAT INTEL FETCHER 📡
          </h2>
          <p className="cyber-text text-sm">
            Extract intelligence from news articles and threat reports
          </p>
        </div>

        {/* URL Input */}
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
              onClick={handleFetchUrl}
              disabled={isFetching || !url.trim()}
              className="bg-primary hover:bg-primary/80 font-cyber"
            >
              {isFetching ? "⏳" : "📡"}
            </Button>
          </div>
        </div>

        {/* Manual Content Input */}
        <div className="space-y-2">
          <Label className="font-cyber">Or Paste Article/Report Content</Label>
          <Textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Paste threat intelligence content here..."
            className="min-h-[150px] neon-border font-mono text-xs"
          />
        </div>

        {/* Extracted Intelligence */}
        {extractedIntel && (
          <div className="space-y-4">
            <div className="neon-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="cyber-text font-bold">🎯 Extracted Intelligence</h3>
                <Badge className={
                  extractedIntel.confidence === 'High' ? 'bg-green-600' :
                  extractedIntel.confidence === 'Medium' ? 'bg-yellow-600' : 'bg-red-600'
                }>
                  {extractedIntel.confidence} Confidence
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-retro font-bold mb-1">Actor Name:</div>
                  <div className="text-foreground">{extractedIntel.actorName}</div>
                </div>

                {extractedIntel.aliases.length > 0 && (
                  <div>
                    <div className="font-retro font-bold mb-1">Aliases:</div>
                    <div className="flex flex-wrap gap-1">
                      {extractedIntel.aliases.slice(0, 3).map((alias, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {alias}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {extractedIntel.malware.length > 0 && (
                  <div>
                    <div className="font-retro font-bold mb-1">Malware ({extractedIntel.malware.length}):</div>
                    <div className="text-xs text-muted-foreground">
                      {extractedIntel.malware.slice(0, 3).join(", ")}...
                    </div>
                  </div>
                )}

                {extractedIntel.techniques.length > 0 && (
                  <div>
                    <div className="font-retro font-bold mb-1">MITRE Techniques ({extractedIntel.techniques.length}):</div>
                    <div className="text-xs text-muted-foreground">
                      {extractedIntel.techniques.slice(0, 3).join(", ")}...
                    </div>
                  </div>
                )}

                {extractedIntel.industries.length > 0 && (
                  <div>
                    <div className="font-retro font-bold mb-1">Target Industries:</div>
                    <div className="text-xs text-muted-foreground">
                      {extractedIntel.industries.slice(0, 3).join(", ")}...
                    </div>
                  </div>
                )}

                {extractedIntel.countries.length > 0 && (
                  <div>
                    <div className="font-retro font-bold mb-1">Target Countries:</div>
                    <div className="text-xs text-muted-foreground">
                      {extractedIntel.countries.slice(0, 3).join(", ")}...
                    </div>
                  </div>
                )}
              </div>

              {extractedIntel.summary && (
                <div>
                  <div className="font-retro font-bold mb-1">Summary:</div>
                  <div className="text-xs text-foreground border-l-2 border-accent pl-2">
                    {extractedIntel.summary}
                  </div>
                </div>
              )}

              <Button
                onClick={handleUseIntel}
                className="w-full bg-destructive hover:bg-destructive/80 font-cyber"
              >
                🎯 USE THIS INTELLIGENCE
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};