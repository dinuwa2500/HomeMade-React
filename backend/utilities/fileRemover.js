import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const removeFile = (filename) => {
    fs.unlink(path.join(__dirname, '../uploads', filename), function(err){
        if (err && err.code !== 'ENOENT') {
            // File not found, won't remove
        } else if (err) {
            // Error removing file
        } else {
            // File removed successfully
        }
    });
};

export { removeFile };
