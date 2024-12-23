import * as fs from 'fs';
import * as path from 'path';
import {parse} from './parser';
import { Token } from '../lexer/tokens';
import { Directives } from '../lexer/directives';

// Source and destination directories
const sourceDir = path.join(__dirname, '../lexer/tests');
const destinationDir = path.join(__dirname, '../parser/tests');

// Ensure the destination directory exists
if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
}

// Step: 1 Copy all .json files from lexer/tests to parser/tests
fs.readdir(sourceDir, (err, files) => {
    if (err) {
        console.error('Error reading source directory:', err);
        return;
    }

    // Filter for .json files
    const jsonFiles = files.filter(file => path.extname(file) === '.json');

    if (jsonFiles.length === 0) {
        console.log('No .json files found to copy.');
        return;
    }

    // Copy each .json file to the destination
    jsonFiles.forEach(file => {
        const sourcePath = path.join(sourceDir, file);
        const destinationPath = path.join(destinationDir, file);

        fs.copyFile(sourcePath, destinationPath, (copyErr) => {
            if (copyErr) {
                console.error(`Error copying file ${file}:`, copyErr);
            } else {
                console.log(`Copied ${file} to ${destinationDir}`);
            }
        });
    });
});


// Path to the 'tests' folder
const testsFolder = path.join(__dirname, 'tests');
fs.readdir(testsFolder, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    // Filter for .json files
    const jsonFiles = files.filter(file => path.extname(file) === '.json');

    // Iterate through each file
    jsonFiles.forEach(file => {
        const filePath = path.join(testsFolder, file);

        // Check if it's a file (not a directory)
        fs.stat(filePath, (err, stats) => {
            if (err) {
                console.error('Error getting file stats:', err);
                return;
            }

            if (stats.isFile()) {
                // Read the file's contents
                fs.readFile(filePath, 'utf8', (err, sourceCode) => {
                    if (err) {
                        console.error('Error reading file:', filePath, err);
                        return;
                    }

                    // Retain the base name and change the extension to .lex
                    const newFilePath = path.join(
                        path.dirname(filePath),
                        path.basename(filePath, path.extname(filePath)) + '.ast_json'
                    );
                    
                    const tokenized_output = JSON.parse(sourceCode) as {
                        tokens: Token[], directives: Directives
                    };
                    const output = parse(tokenized_output);
                    console.log(output);
                    // fs.writeFile(newFilePath, JSON.stringify(output), (err) => {
                    //     if (err) {
                    //         console.error('Error writing to file:', err);
                    //     } else {
                    //         console.log(`Data written to file: ${filePath}`);
                    //     }
                    // });
                    
                    // console.log("\n\n\n")
                });
            }
        });
    });
});

