import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { tokenize } from './lexer';
import { Token, TokenType } from './tokens';

// Path to the 'tests' folder
const testsFolder = path.join(__dirname, 'tests');

function visualizeToken(token: Token) {
    const typeDescription = chalk.blue(TokenType[token.type]); // Token type in blue
    const value = token.value !== null 
        ? chalk.green(`"${token.value}"`) // Token value in green
        : chalk.gray("<null>"); // Null value in gray
    const metadata = token.metadata
        ? ` (${chalk.yellow(`line: ${token.metadata.line}`)}, ${chalk.yellow(`column: ${token.metadata.column}`)}, ${chalk.yellow(`index: ${token.metadata.absoluteIndex}`)})`
        : chalk.red(" (no metadata)"); // Metadata in yellow or indicate missing metadata in red

    return `${chalk.bold("Token")} [type: ${typeDescription}, value: ${value}${metadata}]`;
}

// Get all files in the 'tests' folder
fs.readdir(testsFolder, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    // Iterate through each file
    files.forEach(file => {
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

                    const output = tokenize(sourceCode);
                    console.log(`#############  ${path.basename(filePath)}  ################`)
                    console.log(output.tokens.map(visualizeToken).join("\n"))
                    console.log("\n\n\n")
                });
            }
        });
    });
});

