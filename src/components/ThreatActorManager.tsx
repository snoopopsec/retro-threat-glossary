import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ThreatActor } from "@/data/threatActors";
import { ThreatActorImporter } from "./ThreatActorImporter";
import { ThreatIntelFetcher } from "./ThreatIntelFetcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ThreatActorManagerProps {
  actors: ThreatActor[];
  onAddActor: (actor: ThreatActor) => void;
  onUpdateActor: (actor: ThreatActor) => void;
  onImportActors: (actors: ThreatActor[]) => void;
}

export const ThreatActorManager = ({ 
  actors, 
  onAddActor, 
  onUpdateActor, 
  onImportActors 
}: ThreatActorManagerProps) => {
  const [selectedActor, setSelectedActor] = useState<ThreatActor | null>(null);
  const [formData, setFormData] = useState<Partial<ThreatActor>>({});
  const [pendingIntel, setPendingIntel] = useState<any>(null);
  const { toast } = useToast();

  const resetForm = () => {
    setSelectedActor(null);
    setFormData({});
    setPendingIntel(null);
  };

  const handleEditActor = (actor: ThreatActor) => {
    setSelectedActor(actor);
    setFormData(actor);
  };

  const handleSaveActor = () => {
    if (!formData.name) {
      toast({
        title: "❌ Validation Error",
        description: "Actor name is required",
        variant: "destructive",
      });
      return;
    }

    const actor: ThreatActor = {
      id: selectedActor?.id || formData.name!.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: formData.name!,
      aliases: formData.aliases || [],
      type: formData.type || 'eCrime',
      origin: formData.origin || 'Unknown',
      firstSeen: formData.firstSeen || 'Unknown',
      lastSeen: formData.lastSeen || 'Unknown',
      motivation: formData.motivation || 'Unknown',
      description: formData.description || '',
      malwareUsed: formData.malwareUsed || [],
      targetIndustries: formData.targetIndustries || [],
      targetCountries: formData.targetCountries || [],
      techniques: formData.techniques || [],
      status: formData.status || 'Unknown',
      intelReports: formData.intelReports || 0,
      vulnerabilities: formData.vulnerabilities || 0
    };

    if (selectedActor) {
      onUpdateActor(actor);
      toast({
        title: "✅ Actor Updated",
        description: `${actor.name} has been updated successfully!`,
      });
    } else {
      onAddActor(actor);
      toast({
        title: "🎯 Actor Added",
        description: `${actor.name} has been added to the database!`,
      });
    }

    resetForm();
  };

  const handleIntelExtracted = (intel: any) => {
    setPendingIntel(intel);
    
    // Auto-fill form with extracted intelligence
    setFormData(prev => ({
      ...prev,
      name: intel.actorName !== 'Unknown Actor' ? intel.actorName : prev.name,
      aliases: [...(prev.aliases || []), ...intel.aliases].filter(Boolean),
      malwareUsed: [...(prev.malwareUsed || []), ...intel.malware].filter(Boolean),
      targetIndustries: [...(prev.targetIndustries || []), ...intel.industries].filter(Boolean),
      targetCountries: [...(prev.targetCountries || []), ...intel.countries].filter(Boolean),
      techniques: [...(prev.techniques || []), ...intel.techniques].filter(Boolean),
      description: intel.summary || prev.description
    }));
  };

  const updateField = (field: keyof ThreatActor, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: keyof ThreatActor, value: string) => {
    if (!value.trim()) return;
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    updateField(field, items);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="retro-title text-3xl mb-2">
          🕷️ THREAT ACTOR COMMAND CENTER 🕷️
        </h1>
        <p className="cyber-text">
          Manage your threat intelligence database like a true 90s hacker
        </p>
      </div>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manual" className="font-cyber">Manual Entry</TabsTrigger>
          <TabsTrigger value="import" className="font-cyber">Import HTML</TabsTrigger>
          <TabsTrigger value="intel" className="font-cyber">Fetch Intel</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6">
          {/* Actor List */}
          <Card className="threat-card p-4">
            <h3 className="cyber-text font-bold mb-4">📋 Existing Actors ({actors.length})</h3>
            <div className="grid gap-2 max-h-40 overflow-y-auto">
              {actors.map(actor => (
                <div key={actor.id} className="flex items-center justify-between p-2 border-2 border-border bg-card/30">
                  <div className="flex items-center gap-2">
                    <span className="font-retro">{actor.name}</span>
                    <Badge className="text-xs">{actor.type}</Badge>
                  </div>
                  <Button
                    onClick={() => handleEditActor(actor)}
                    variant="outline"
                    size="sm"
                    className="font-cyber text-xs"
                  >
                    EDIT
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Manual Entry Form */}
          <Card className="threat-card p-6">
            <h3 className="cyber-text font-bold mb-4">
              {selectedActor ? '✏️ EDIT ACTOR' : '➕ ADD NEW ACTOR'}
            </h3>

            {pendingIntel && (
              <div className="mb-4 p-3 neon-border bg-accent/10">
                <div className="font-cyber text-sm mb-2">🎯 Intelligence Ready to Merge:</div>
                <div className="text-xs text-muted-foreground">
                  {pendingIntel.malware.length} malware samples, {pendingIntel.techniques.length} techniques, 
                  {pendingIntel.industries.length} target industries detected
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {/* Basic Info */}
              <div className="space-y-3">
                <div>
                  <Label className="font-cyber">Actor Name *</Label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="neon-border"
                    placeholder="APT29, Lazarus, etc."
                  />
                </div>

                <div>
                  <Label className="font-cyber">Type</Label>
                  <Select value={formData.type || ''} onValueChange={(value) => updateField('type', value)}>
                    <SelectTrigger className="neon-border">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APT">APT</SelectItem>
                      <SelectItem value="Ransomware">Ransomware</SelectItem>
                      <SelectItem value="eCrime">eCrime</SelectItem>
                      <SelectItem value="Nation State">Nation State</SelectItem>
                      <SelectItem value="Hacktivist">Hacktivist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="font-cyber">Origin</Label>
                  <Input
                    value={formData.origin || ''}
                    onChange={(e) => updateField('origin', e.target.value)}
                    className="neon-border"
                    placeholder="Country or region"
                  />
                </div>

                <div>
                  <Label className="font-cyber">Status</Label>
                  <Select value={formData.status || ''} onValueChange={(value) => updateField('status', value)}>
                    <SelectTrigger className="neon-border">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Detailed Info */}
              <div className="space-y-3">
                <div>
                  <Label className="font-cyber">Aliases (comma-separated)</Label>
                  <Input
                    value={formData.aliases?.join(', ') || ''}
                    onChange={(e) => updateArrayField('aliases', e.target.value)}
                    className="neon-border"
                    placeholder="Cozy Bear, APT29, The Dukes"
                  />
                </div>

                <div>
                  <Label className="font-cyber">First Seen</Label>
                  <Input
                    value={formData.firstSeen || ''}
                    onChange={(e) => updateField('firstSeen', e.target.value)}
                    className="neon-border"
                    placeholder="2020, Jan 2021, etc."
                  />
                </div>

                <div>
                  <Label className="font-cyber">Last Seen</Label>
                  <Input
                    value={formData.lastSeen || ''}
                    onChange={(e) => updateField('lastSeen', e.target.value)}
                    className="neon-border"
                    placeholder="2024, Dec 2023, etc."
                  />
                </div>

                <div>
                  <Label className="font-cyber">Motivation</Label>
                  <Input
                    value={formData.motivation || ''}
                    onChange={(e) => updateField('motivation', e.target.value)}
                    className="neon-border"
                    placeholder="Espionage, Financial, etc."
                  />
                </div>
              </div>

              {/* Arrays */}
              <div className="md:col-span-2 space-y-3">
                <div>
                  <Label className="font-cyber">Description</Label>
                  <Textarea
                    value={formData.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    className="neon-border"
                    placeholder="Detailed description of the threat actor..."
                  />
                </div>

                <div>
                  <Label className="font-cyber">Malware Used (comma-separated)</Label>
                  <Textarea
                    value={formData.malwareUsed?.join(', ') || ''}
                    onChange={(e) => updateArrayField('malwareUsed', e.target.value)}
                    className="neon-border"
                    placeholder="Cobalt Strike, Mimikatz, etc."
                  />
                </div>

                <div>
                  <Label className="font-cyber">Target Industries (comma-separated)</Label>
                  <Textarea
                    value={formData.targetIndustries?.join(', ') || ''}
                    onChange={(e) => updateArrayField('targetIndustries', e.target.value)}
                    className="neon-border"
                    placeholder="Healthcare, Government, Financial, etc."
                  />
                </div>

                <div>
                  <Label className="font-cyber">Target Countries (comma-separated)</Label>
                  <Textarea
                    value={formData.targetCountries?.join(', ') || ''}
                    onChange={(e) => updateArrayField('targetCountries', e.target.value)}
                    className="neon-border"
                    placeholder="United States, United Kingdom, etc."
                  />
                </div>

                <div>
                  <Label className="font-cyber">MITRE Techniques (comma-separated)</Label>
                  <Textarea
                    value={formData.techniques?.join(', ') || ''}
                    onChange={(e) => updateArrayField('techniques', e.target.value)}
                    className="neon-border"
                    placeholder="T1566.001, T1059.001, etc."
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSaveActor}
                className="bg-destructive hover:bg-destructive/80 font-cyber"
              >
                {selectedActor ? '💾 UPDATE ACTOR' : '➕ ADD ACTOR'}
              </Button>
              {selectedActor && (
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="font-cyber"
                >
                  ❌ CANCEL
                </Button>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="import">
          <ThreatActorImporter onImport={onImportActors} />
        </TabsContent>

        <TabsContent value="intel">
          <ThreatIntelFetcher onIntelExtracted={handleIntelExtracted} />
        </TabsContent>
      </Tabs>
    </div>
  );
};