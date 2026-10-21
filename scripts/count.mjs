import fs from 'node:fs';
const dir = 'src/content/guides';
for (const f of fs.readdirSync(dir)) {
  const body = fs.readFileSync(`${dir}/${f}`, 'utf8').split(/^---$/m).slice(2).join('---');
  const n = (body.match(/[一-鿿]/g) || []).length;
  console.log(f.padEnd(34), n);
}
