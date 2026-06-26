import { promises as fs } from 'fs';
import * as path from 'path';

const docsDir = 'c:\\Users\\mikap\\Documents\\Nuvio-Wiki\\docs\\nl';

const replacements = [
  // Developer
  [/\bontwikkelaarsopties\b/g, 'developer options'],
  [/\bOntwikkelaarsopties\b/g, 'Developer options'],
  [/\bontwikkelaarsprofiel\b/g, 'developer profile'],
  [/\bontwikkelaarsprofielen\b/g, 'developer profiles'],
  [/\bOntwikkelaarsprofiel\b/g, 'Developer profile'],
  [/\bOntwikkelaarsprofielen\b/g, 'Developer profiles'],
  [/\bontwikkelaarsmodus\b/g, 'developer mode'],
  [/\bOntwikkelaarsmodus\b/g, 'Developer Mode'],
  [/\bontwikkelaars-API\b/g, 'developer API'],
  [/\bOntwikkelaars-API\b/g, 'Developer API'],
  [/\bontwikkelaars\b/g, 'developers'],
  [/\bOntwikkelaars\b/g, 'Developers'],
  [/\bontwikkelaar\b/g, 'developer'],
  [/\bOntwikkelaar\b/g, 'Developer'],
  [/"Ontwikkelaar-app"/g, '"Developer App"'],
  [/\(Developer App\)/g, ''],

  // Troubleshooting
  [/\bprobleemoplossingsgids\b/g, 'troubleshooting guide'],
  [/\bProbleemoplossingsgids\b/g, 'Troubleshooting Guide'],
  [/\bprobleemoplossing\b/g, 'troubleshooting'],
  [/\bProbleemoplossing\b/g, 'Troubleshooting'],

  // Quick start
  [/\bsnelstartgids\b/g, 'quick start guide'],
  [/\bSnelstartgids\b/g, 'Quick Start Guide'],

  // Addons
  [/\badd-ons-gids\b/g, 'addons guide'],
  [/\bAdd-ons-gids\b/g, 'Addons Guide'],
  [/\badd-on-problemen\b/g, 'addon issues'],
  [/\bAdd-on-problemen\b/g, 'Addon issues'],
  [/\badd-ons\b/g, 'addons'],
  [/\bAdd-ons\b/g, 'Addons'],
  [/\badd-on\b/g, 'addon'],
  [/\bAdd-on\b/g, 'Addon'],

  // Player Settings
  [/\bspelerinstellingen\b/g, 'player settings'],
  [/\bSpelerinstellingen\b/g, 'Player settings'],
  [/\bspeler\b/g, 'player'],
  [/\bSpeler\b/g, 'Player'],
  [/\bspelers\b/g, 'players'],
  [/\bSpelers\b/g, 'Players'],
  [/\bmediaspeler\b/g, 'media player'],
  [/\bMediaspeler\b/g, 'Media Player'],

  // Profiles
  [/\bprofielen\b/g, 'profiles'],
  [/\bProfielen\b/g, 'Profiles'],
  [/\bprofiel\b/g, 'profile'],
  [/\bProfiel\b/g, 'Profile'],

  // Collections
  [/\bcollecties\b/g, 'collections'],
  [/\bCollecties\b/g, 'Collections'],
  [/\bcollectie\b/g, 'collection'],
  [/\bCollectie\b/g, 'Collection'],

  // Integrations
  [/\bintegraties\b/g, 'integrations'],
  [/\bIntegraties\b/g, 'Integrations'],
  [/\bintegratie\b/g, 'integration'],
  [/\bIntegratie\b/g, 'Integration'],

  // Features
  [/\bfuncties\b/g, 'features'],
  [/\bFuncties\b/g, 'Features'],
  [/\bfunctie\b/g, 'feature'],
  [/\bFunctie\b/g, 'Feature']
];

async function processDir(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await processDir(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const content = await fs.readFile(fullPath, 'utf8');
      let newContent = content;
      for (const [regex, replacement] of replacements) {
        newContent = newContent.replace(regex, replacement);
      }
      if (newContent !== content) {
        newContent = newContent.replace(/troubleshooting \(troubleshooting\)/gi, 'troubleshooting');
        newContent = newContent.replace(/Troubleshooting \(Troubleshooting\)/gi, 'Troubleshooting');
        newContent = newContent.replace(/Instellingen > Integraties > Connected Services \(Verbonden diensten\)/g, 'Instellingen > Integrations > Connected Services');
        newContent = newContent.replace(/Instellingen > Integrations > Connected Services \(Verbonden diensten\)/g, 'Instellingen > Integrations > Connected Services');
        newContent = newContent.replace(/Connected Services \(Verbonden diensten\)/g, 'Connected Services');
        newContent = newContent.replace(/ondersteuning \(troubleshooting\)/gi, 'troubleshooting');
        newContent = newContent.replace(/Probleemoplossing \(Troubleshooting\)/gi, 'Troubleshooting');
        
        await fs.writeFile(fullPath, newContent, 'utf8');
        console.log(`Updated: ${path.relative(docsDir, fullPath)}`);
      }
    }
  }
}

processDir(docsDir).catch(console.error);
