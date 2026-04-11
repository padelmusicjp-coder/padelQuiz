import sizeOf from 'image-size';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, '../src/assets/images/cards/');

fs.readdirSync(dir).forEach(file => {
  if(!file.endsWith('.png')) return;
  const size = sizeOf(path.join(dir, file));
  console.log(file, size.width, 'x', size.height, 'AspectRatio:', size.width / size.height);
});
