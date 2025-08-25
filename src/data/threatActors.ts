export interface ThreatActor {
  id: string;
  name: string;
  aliases: string[];
  type: 'APT' | 'Ransomware' | 'eCrime' | 'Nation State' | 'Hacktivist';
  origin: string;
  firstSeen: string;
  lastSeen: string;
  motivation: string;
  description: string;
  malwareUsed: string[];
  targetIndustries: string[];
  targetCountries: string[];
  techniques: string[];
  status: 'Active' | 'Inactive' | 'Unknown';
  intelReports: number;
  vulnerabilities: number;
}

export const threatActors: ThreatActor[] = [
  {
    id: "vice-spider",
    name: "VICE SPIDER",
    aliases: ["Vice Society", "DEV-0832", "Vanilla Tempest"],
    type: "eCrime",
    origin: "Unknown",
    firstSeen: "May 2021",
    lastSeen: "Aug 2025",
    motivation: "Criminal",
    description: "VICE SPIDER is an eCrime adversary that has conducted ransomware operations since at least April 2021. The group began using the commodity Zeppelin ransomware and likely acquired the source code to the Linux version of FERAL SPIDER's DeathKitty in May 2021. In November 2022, a security vendor announced the availability of a decryption service for victims of Zeppelin ransomware. The adversary subsequently experimented with BITWISE SPIDER's LockBit and the RedAlertLocker ransomware before adopting the private Rhysida ransomware as their main payload.",
    malwareUsed: ["Zeppelin", "Rhysida", "SocksShell", "DeathKitty", "HiveRansomware", "LockBit", "SocksProxyGo", "Lotus", "RedAlertLocker", "MinteLoader", "HalfAndHalfDownloader", "SystemBC"],
    targetIndustries: ["Utilities", "Consumer Goods", "Local Government", "Academic", "Telecommunications", "Consulting and Professional Services", "Industrials and Engineering", "Food and Beverage", "Real Estate", "Transportation", "Government", "Technology", "Retail", "Automotive", "Transportation", "Media", "Extractive", "NGO", "Emergency Services", "Manufacturing", "Logistics", "Hospitality", "Financial Services", "Media", "Healthcare", "Energy", "Nonprofit", "Chemicals"],
    targetCountries: ["Canada", "Malaysia", "Sweden", "Switzerland", "Italy", "Lebanon", "Hungary", "Greenland", "Belgium", "Chile", "Colombia", "Kuwait", "Indonesia", "Denmark", "Poland", "Spain", "Greece", "Netherlands", "United States", "Mexico", "Kenya", "Germany", "Australia", "Argentina", "Thailand", "Israel", "Iran", "Saudi Arabia", "France", "Ecuador", "Austria", "United Arab Emirates", "New Zealand", "United Kingdom", "Brazil", "Philippines", "Singapore", "Portugal", "Dominican Republic", "India", "Puerto Rico"],
    techniques: ["T1021.001", "T1047", "T1055", "T1059.001", "T1059.003", "T1078", "T1082", "T1083", "T1105", "T1112", "T1140", "T1486", "T1547.001", "T1562.001", "T1566.001", "T1570"],
    status: "Active",
    intelReports: 24,
    vulnerabilities: 31
  },
  {
    id: "punk-spider",
    name: "PUNK SPIDER",
    aliases: ["Akira", "Storm-1567", "REDBIKE"],
    type: "eCrime",
    origin: "Unknown", 
    firstSeen: "Aug 2025",
    lastSeen: "Aug 2025",
    motivation: "Criminal",
    description: "PUNK SPIDER is a financially motivated threat actor group that operates the Akira ransomware. The group has been active since early 2023 and primarily targets various industries worldwide through opportunistic attacks.",
    malwareUsed: ["Akira Ransomware", "Cobalt Strike", "SystemBC", "Various Remote Access Tools"],
    targetIndustries: ["Healthcare", "Manufacturing", "Education", "Government", "Financial Services", "Technology", "Retail"],
    targetCountries: ["United States", "Canada", "United Kingdom", "Germany", "France", "Australia", "Japan"],
    techniques: ["T1486", "T1059.001", "T1021.001", "T1047", "T1055", "T1082", "T1083", "T1105"],
    status: "Active",
    intelReports: 24,
    vulnerabilities: 32
  },
  {
    id: "lunar-spider",
    name: "LUNAR SPIDER",
    aliases: ["Vice Society", "DEV-0832"],
    type: "eCrime",
    origin: "Russian Federation, Eastern Europe",
    firstSeen: "Aug 2025",
    lastSeen: "Aug 2025", 
    motivation: "Criminal",
    description: "LUNAR SPIDER is a cybercriminal group known for deploying various ransomware families and conducting financially motivated attacks against organizations worldwide.",
    malwareUsed: ["Various ransomware families", "Cobalt Strike", "Remote Access Tools"],
    targetIndustries: ["Manufacturing", "Healthcare", "Education", "Government"],
    targetCountries: ["Russian Federation", "Eastern Europe", "United States", "European Union"],
    techniques: ["T1486", "T1059", "T1021", "T1047", "T1055"],
    status: "Active",
    intelReports: 60,
    vulnerabilities: 2
  },
  {
    id: "traveling-spider",
    name: "TRAVELING SPIDER",
    aliases: ["Nemty X", "Nefilim", "GOLD MANSARD", "Nokoyawa", "INC", "Lynx", "Nemty"],
    type: "eCrime", 
    origin: "Russian Federation, Eastern Europe",
    firstSeen: "Aug 2025",
    lastSeen: "Aug 2025",
    motivation: "Criminal",
    description: "TRAVELING SPIDER is a prolific ransomware-as-a-service (RaaS) operation that has used multiple ransomware families over time, adapting their tactics and payloads based on the threat landscape.",
    malwareUsed: ["Nemty", "Nefilim", "Nokoyawa", "INC Ransomware", "Lynx"],
    targetIndustries: ["Healthcare", "Manufacturing", "Technology", "Financial Services", "Government"],
    targetCountries: ["Russian Federation", "Eastern Europe", "United States", "Canada", "United Kingdom"],
    techniques: ["T1486", "T1059.001", "T1021.001", "T1047", "T1055", "T1082"],
    status: "Active",
    intelReports: 9,
    vulnerabilities: 28
  },
  {
    id: "mutant-spider", 
    name: "MUTANT SPIDER",
    aliases: ["Vice Society", "DEV-0832"],
    type: "eCrime",
    origin: "Unknown",
    firstSeen: "Aug 2025", 
    lastSeen: "Aug 2025",
    motivation: "Criminal",
    description: "MUTANT SPIDER is an eCrime threat actor that conducts ransomware operations and data theft attacks against various organizations.",
    malwareUsed: ["Custom ransomware", "Data theft tools", "Remote Access Tools"],
    targetIndustries: ["Healthcare", "Education", "Manufacturing", "Government"],
    targetCountries: ["United States", "Canada", "United Kingdom", "Australia"],
    techniques: ["T1486", "T1059", "T1021", "T1047"],
    status: "Active",
    intelReports: 4,
    vulnerabilities: 16
  }
];