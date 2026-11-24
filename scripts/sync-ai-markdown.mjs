import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dataPath=path.join(root,'public/data/site-data.js');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(dataPath,'utf8'),context);
const data=context.window.ARCHIVE_DATA;
data.site.aiDevelopment.markdown=fs.readFileSync(path.join(root,'public/content/ai-development.md'),'utf8');
fs.writeFileSync(dataPath,'window.ARCHIVE_DATA = '+JSON.stringify(data,null,2)+';\n');
console.log('Synced AI Markdown into public page data.');
