import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../public');
const assets=['styles.css','app.js','editor.js','data/site-data.js','showcase.css','showcase.js','showcase-anim.js'];
const digest=createHash('sha256');
for(const file of assets)digest.update(await fs.readFile(path.join(root,file)));
const version=(process.env.GITHUB_SHA||digest.digest('hex')).slice(0,12);
for(const file of ['index.html','editor.html']){
 const filename=path.join(root,file);
 let html=await fs.readFile(filename,'utf8');
 html=html.replace(/((?:src|href)="\.\/(?:styles\.css|app\.js|editor\.js|data\/site-data\.js|showcase\.css|showcase\.js|showcase-anim\.js))(?:\?[^"\s]*)?(")/g,(_,prefix,end)=>prefix+'?v='+version+end);
 const meta='<meta name="archive-build" content="'+version+'">';
 html=/<meta name="archive-build"[^>]*>/.test(html)?html.replace(/<meta name="archive-build"[^>]*>/,meta):html.replace('</head>',meta+'</head>');
 await fs.writeFile(filename,html);
}
console.log('Versioned public assets:',version);
