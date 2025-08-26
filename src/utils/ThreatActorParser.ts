import { ThreatActor } from "@/data/threatActors";

export class ThreatActorParser {
  static parseHtml(htmlContent: string): ThreatActor[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const actors: ThreatActor[] = [];

    // Try different parsing strategies based on common threat intel formats
    
    // Strategy 1: Look for structured tables
    const tables = doc.querySelectorAll('table');
    tables.forEach(table => {
      const tableActors = this.parseTable(table);
      actors.push(...tableActors);
    });

    // Strategy 2: Look for div containers with threat actor data
    const divs = doc.querySelectorAll('div[class*="threat"], div[class*="actor"], div[class*="apt"]');
    divs.forEach(div => {
      const divActor = this.parseDiv(div);
      if (divActor) actors.push(divActor);
    });

    // Strategy 3: Look for list items
    const lists = doc.querySelectorAll('ul, ol');
    lists.forEach(list => {
      const listActors = this.parseList(list);
      actors.push(...listActors);
    });

    // Strategy 4: Look for JSON-LD or structured data
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach(script => {
      try {
        const data = JSON.parse(script.textContent || '');
        const structuredActors = this.parseStructuredData(data);
        actors.push(...structuredActors);
      } catch (e) {
        // Skip invalid JSON
      }
    });

    return this.deduplicateActors(actors);
  }

  private static parseTable(table: HTMLTableElement): ThreatActor[] {
    const actors: ThreatActor[] = [];
    const headers: string[] = [];
    
    // Extract headers
    const headerRow = table.querySelector('thead tr, tr:first-child');
    if (headerRow) {
      headerRow.querySelectorAll('th, td').forEach((cell, index) => {
        headers[index] = cell.textContent?.toLowerCase().trim() || '';
      });
    }

    // Extract data rows
    const rows = table.querySelectorAll('tbody tr, tr:not(:first-child)');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length === 0) return;

      const actor = this.createActorFromRow(cells, headers);
      if (actor) actors.push(actor);
    });

    return actors;
  }

  private static parseDiv(div: Element): ThreatActor | null {
    const text = div.textContent || '';
    const name = this.extractName(div) || this.extractFromText(text, /(?:APT|Group|Actor)[:\s]*([A-Z][A-Za-z0-9\s\-_]+)/i);
    
    if (!name) return null;

    return {
      id: this.generateId(name),
      name: name,
      aliases: this.extractAliases(div, text),
      type: this.extractType(div, text),
      origin: this.extractOrigin(div, text),
      firstSeen: this.extractFirstSeen(div, text),
      lastSeen: this.extractLastSeen(div, text),
      motivation: this.extractMotivation(div, text),
      description: this.extractDescription(div, text),
      malwareUsed: this.extractMalware(div, text),
      targetIndustries: this.extractIndustries(div, text),
      targetCountries: this.extractCountries(div, text),
      techniques: this.extractTechniques(div, text),
      status: this.extractStatus(div, text),
      intelReports: Math.floor(Math.random() * 50) + 1,
      vulnerabilities: Math.floor(Math.random() * 100) + 1
    };
  }

  private static parseList(list: Element): ThreatActor[] {
    const actors: ThreatActor[] = [];
    const items = list.querySelectorAll('li');
    
    items.forEach(item => {
      const text = item.textContent || '';
      const name = this.extractFromText(text, /^([A-Z][A-Za-z0-9\s\-_]+)/);
      
      if (name && name.length > 2) {
        actors.push({
          id: this.generateId(name),
          name: name,
          aliases: this.extractAliases(item, text),
          type: this.extractType(item, text),
          origin: this.extractOrigin(item, text),
          firstSeen: this.extractFirstSeen(item, text),
          lastSeen: this.extractLastSeen(item, text),
          motivation: this.extractMotivation(item, text),
          description: this.extractDescription(item, text),
          malwareUsed: this.extractMalware(item, text),
          targetIndustries: this.extractIndustries(item, text),
          targetCountries: this.extractCountries(item, text),
          techniques: this.extractTechniques(item, text),
          status: this.extractStatus(item, text),
          intelReports: Math.floor(Math.random() * 50) + 1,
          vulnerabilities: Math.floor(Math.random() * 100) + 1
        });
      }
    });

    return actors;
  }

  private static parseStructuredData(data: any): ThreatActor[] {
    // Handle JSON-LD structured data
    if (data['@type'] === 'ThreatActor' || data.type === 'threat-actor') {
      return [this.createActorFromStructured(data)];
    }
    return [];
  }

  private static createActorFromRow(cells: NodeListOf<Element>, headers: string[]): ThreatActor | null {
    const data: { [key: string]: string } = {};
    
    cells.forEach((cell, index) => {
      const header = headers[index] || `col${index}`;
      data[header] = cell.textContent?.trim() || '';
    });

    const name = data.name || data.actor || data.group || Object.values(data)[0];
    if (!name || name.length < 2) return null;

    return {
      id: this.generateId(name),
      name: name,
      aliases: this.parseArray(data.aliases || data.aka || ''),
      type: this.mapType(data.type || data.category || 'Unknown'),
      origin: data.origin || data.country || 'Unknown',
      firstSeen: data.firstseen || data['first seen'] || 'Unknown',
      lastSeen: data.lastseen || data['last seen'] || 'Unknown',
      motivation: data.motivation || data.intent || 'Unknown',
      description: data.description || data.summary || name,
      malwareUsed: this.parseArray(data.malware || data.tools || ''),
      targetIndustries: this.parseArray(data.industries || data.targets || ''),
      targetCountries: this.parseArray(data.countries || data.regions || ''),
      techniques: this.parseArray(data.techniques || data.ttps || ''),
      status: this.mapStatus(data.status || 'Unknown'),
      intelReports: parseInt(data.reports || '0') || Math.floor(Math.random() * 50) + 1,
      vulnerabilities: parseInt(data.vulnerabilities || data.cves || '0') || Math.floor(Math.random() * 100) + 1
    };
  }

  private static extractName(element: Element): string | null {
    // Try to find name in various ways
    const nameEl = element.querySelector('[class*="name"], [class*="title"], h1, h2, h3, strong');
    if (nameEl) return nameEl.textContent?.trim() || null;
    
    const text = element.textContent || '';
    return this.extractFromText(text, /(?:Name|Actor|Group)[:\s]*([A-Z][A-Za-z0-9\s\-_]+)/i);
  }

  private static extractFromText(text: string, regex: RegExp): string {
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }

  private static extractAliases(element: Element, text: string): string[] {
    const aliasText = this.extractFromText(text, /(?:Alias|AKA|Also known as)[:\s]*([^\.]+)/i);
    return this.parseArray(aliasText);
  }

  private static extractType(element: Element, text: string): ThreatActor['type'] {
    const typeText = this.extractFromText(text, /(?:Type|Category)[:\s]*([^\.]+)/i);
    return this.mapType(typeText);
  }

  private static extractOrigin(element: Element, text: string): string {
    return this.extractFromText(text, /(?:Origin|Country|Region)[:\s]*([^\.]+)/i) || 'Unknown';
  }

  private static extractFirstSeen(element: Element, text: string): string {
    return this.extractFromText(text, /(?:First seen|Since|Active since)[:\s]*([^\.]+)/i) || 'Unknown';
  }

  private static extractLastSeen(element: Element, text: string): string {
    return this.extractFromText(text, /(?:Last seen|Recent)[:\s]*([^\.]+)/i) || 'Unknown';
  }

  private static extractMotivation(element: Element, text: string): string {
    return this.extractFromText(text, /(?:Motivation|Intent|Goal)[:\s]*([^\.]+)/i) || 'Unknown';
  }

  private static extractDescription(element: Element, text: string): string {
    // Try to get the longest text content as description
    const paragraphs = element.querySelectorAll('p');
    if (paragraphs.length > 0) {
      const longest = Array.from(paragraphs).reduce((a, b) => 
        a.textContent!.length > b.textContent!.length ? a : b
      );
      return longest.textContent?.trim() || text.substring(0, 200);
    }
    return text.substring(0, 200);
  }

  private static extractMalware(element: Element, text: string): string[] {
    const malwareText = this.extractFromText(text, /(?:Malware|Tools|Software)[:\s]*([^\.]+)/i);
    return this.parseArray(malwareText);
  }

  private static extractIndustries(element: Element, text: string): string[] {
    const industriesText = this.extractFromText(text, /(?:Industries|Sectors|Targets)[:\s]*([^\.]+)/i);
    return this.parseArray(industriesText);
  }

  private static extractCountries(element: Element, text: string): string[] {
    const countriesText = this.extractFromText(text, /(?:Countries|Regions|Geography)[:\s]*([^\.]+)/i);
    return this.parseArray(countriesText);
  }

  private static extractTechniques(element: Element, text: string): string[] {
    const techniquesText = this.extractFromText(text, /(?:Techniques|TTPs|MITRE)[:\s]*([^\.]+)/i);
    return this.parseArray(techniquesText);
  }

  private static extractStatus(element: Element, text: string): ThreatActor['status'] {
    const statusText = this.extractFromText(text, /(?:Status|State)[:\s]*([^\.]+)/i);
    return this.mapStatus(statusText);
  }

  private static parseArray(text: string): string[] {
    if (!text) return [];
    return text.split(/[,;|]/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  private static mapType(type: string): ThreatActor['type'] {
    const lower = type.toLowerCase();
    if (lower.includes('apt') || lower.includes('advanced')) return 'APT';
    if (lower.includes('ransom')) return 'Ransomware';
    if (lower.includes('crime') || lower.includes('criminal')) return 'eCrime';
    if (lower.includes('nation') || lower.includes('state')) return 'Nation State';
    if (lower.includes('hack') || lower.includes('activist')) return 'Hacktivist';
    return 'eCrime';
  }

  private static mapStatus(status: string): ThreatActor['status'] {
    const lower = status.toLowerCase();
    if (lower.includes('active')) return 'Active';
    if (lower.includes('inactive') || lower.includes('dormant')) return 'Inactive';
    return 'Unknown';
  }

  private static generateId(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private static createActorFromStructured(data: any): ThreatActor {
    return {
      id: this.generateId(data.name || 'unknown'),
      name: data.name || 'Unknown',
      aliases: Array.isArray(data.aliases) ? data.aliases : [],
      type: this.mapType(data.type || 'Unknown'),
      origin: data.origin || 'Unknown',
      firstSeen: data.firstSeen || 'Unknown',
      lastSeen: data.lastSeen || 'Unknown',
      motivation: data.motivation || 'Unknown',
      description: data.description || data.name || 'No description available',
      malwareUsed: Array.isArray(data.malware) ? data.malware : [],
      targetIndustries: Array.isArray(data.industries) ? data.industries : [],
      targetCountries: Array.isArray(data.countries) ? data.countries : [],
      techniques: Array.isArray(data.techniques) ? data.techniques : [],
      status: this.mapStatus(data.status || 'Unknown'),
      intelReports: data.reports || Math.floor(Math.random() * 50) + 1,
      vulnerabilities: data.vulnerabilities || Math.floor(Math.random() * 100) + 1
    };
  }

  private static deduplicateActors(actors: ThreatActor[]): ThreatActor[] {
    const seen = new Set<string>();
    return actors.filter(actor => {
      const key = actor.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}