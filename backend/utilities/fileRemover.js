import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const removeFile = (filename) => {
    fs.unlink(path.join(__dirname, '../uploads', filename), function(err){
        if (err && err.code !== 'ENOENT') {
            console.log(`Filename ${filename} not found, won't remove`);
        } else if (err) {
            console.log(`Error removing file ${filename}: ${err}`);
        } else {
            console.log(`File ${filename} removed successfully`);
        }
    });
};

export { removeFile };
