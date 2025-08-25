# 🕷️ RETRO THREAT GLOSSARY 🕷️

A radical 90s-styled threat actor database featuring APT groups, ransomware gangs, and cyber adversaries with all the retro flair you can handle!

## 🎮 Features

- **90s Web Design**: Complete with neon colors, Comic Sans fonts, blinking text, and tiled backgrounds
- **Searchable Database**: Search through threat actors by name, aliases, malware, countries, industries, and more
- **Detailed Profiles**: Comprehensive information including MITRE ATT&CK techniques, target industries, and malware arsenal
- **Responsive Design**: Works on all devices while maintaining that nostalgic 90s feel
- **GitHub Pages Ready**: Configured for easy deployment to GitHub Pages

## 🚀 Deployment to GitHub Pages

1. **Connect to GitHub**:
   - In Lovable, click the GitHub button in the top right
   - Authorize the Lovable GitHub App
   - Create a new repository

2. **Enable GitHub Pages**:
   - Go to your GitHub repository
   - Navigate to Settings → Pages
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click Save

3. **Configure for GitHub Pages**:
   - Your site will be available at: `https://yourusername.github.io/your-repo-name`
   - Wait a few minutes for the deployment to complete

## 📝 Adding New Threat Actors

To add new threat actors, edit the `src/data/threatActors.ts` file. Each threat actor should follow this structure:

```typescript
{
  id: "unique-id",
  name: "THREAT ACTOR NAME",
  aliases: ["Alias 1", "Alias 2"],
  type: "APT" | "Ransomware" | "eCrime" | "Nation State" | "Hacktivist",
  origin: "Country or Region",
  firstSeen: "Date",
  lastSeen: "Date", 
  motivation: "Criminal" | "Espionage" | "Destruction" | "Hacktivism",
  description: "Detailed description of the threat actor...",
  malwareUsed: ["Malware 1", "Malware 2"],
  targetIndustries: ["Industry 1", "Industry 2"],
  targetCountries: ["Country 1", "Country 2"],
  techniques: ["T1021.001", "T1047"], // MITRE ATT&CK technique IDs
  status: "Active" | "Inactive" | "Unknown",
  intelReports: 123, // Number of intelligence reports
  vulnerabilities: 456 // Number of associated vulnerabilities
}
```

## 🎨 90s Design Elements

The website features authentic 90s web design elements:

- **Fonts**: Creepster and Nosifer Google Fonts for that horror/retro feel
- **Colors**: Dark background with neon accents (red, blue, yellow, green)
- **Effects**: 
  - Blinking text for active threats
  - Neon glowing borders
  - Animated text shadows
  - Scrolling marquee header
  - Tiled background patterns
- **Layout**: Asymmetrical cards with borders and retro styling

## 🔍 Search Functionality

The search feature allows users to find threat actors by:
- Threat actor names
- Aliases and alternative names
- Malware families used
- Target industries
- Target countries
- Origin countries
- Threat actor types
- Motivations

## 🛠️ Technology Stack

- **React + TypeScript**: Modern web development
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool
- **Shadcn/ui**: Accessible UI components
- **Lucide React**: Icons

## 📚 Data Sources

All threat intelligence data is based on publicly available information and should be used for educational and research purposes only.

## 🎯 Project Structure

```
src/
├── components/
│   ├── ThreatActorCard.tsx    # Individual threat actor cards
│   ├── ThreatActorModal.tsx   # Detailed view modal
│   └── SearchBox.tsx          # Search functionality
├── data/
│   └── threatActors.ts        # Threat actor database
└── pages/
    └── Index.tsx              # Main page component
```

## 🚨 Disclaimer

This database is for educational and research purposes only. All information is based on publicly available threat intelligence reports and should not be used for malicious purposes.

---

*Built with 90s nostalgia and modern web technology* 🎮
