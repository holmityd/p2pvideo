import { promises as fs } from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function readDir(rootDir) {
    try {
        const files = await fs.readdir(rootDir, { withFileTypes: true });

        for (const file of files) {
            const fullPath = path.join(rootDir, file.name);

            if (file.isDirectory()) {
                await readDir(fullPath);
            } else if (file.isFile()) {
                const content = await fs.readFile(fullPath, 'utf8');
                console.log(`Path: ${fullPath}`);
                console.log(`Content: \n${content}\n`);
            }
        }
    } catch (err) {
        console.error("An error occurred:", err);
    }
}

const rootDir = path.resolve(process.argv[2] || './src'); // takes directory from arguments or uses current directory
readDir(rootDir);
