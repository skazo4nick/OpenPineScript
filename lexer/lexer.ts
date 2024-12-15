import {Token, TokenType} from "./tokens";
import { SearchTreeNode } from "./searchtree";
import { literalsSearchTree } from "./literals";
import {keywordsSearchTree} from "./keywords";


function matchLongest(sourceCode: string, start: number, tree: SearchTreeNode<Token>): Token|null {
    let currentNode: SearchTreeNode<Token> = tree;
    let longestMatch: Token | null = null;
    let currentIndex: number = start;

    while (currentNode) {
        // Check if the current node has a value (potential token match)
        if (currentNode.value) {
            longestMatch = currentNode.value;
        }

        // Check if there's a next character to traverse
        if (currentIndex >= sourceCode.length) break;

        const char = sourceCode[currentIndex];
        currentNode = currentNode.children[char];
        currentIndex++;
    }

    return longestMatch; // Return the longest matching token, or null if no match
}

const ID_REGEX = /([a-zA-Z_])(\.?([a-zA-Z_0-9]+\.)*[a-zA-Z_0-9]+)?/y;
const ID_EX_REGEX = /([a-zA-Z_#])(\.?([a-zA-Z_#0-9]+\.)*[a-zA-Z_#0-9]+)?/y;

function consumeIdentifier(sourceCode: string, start: number) {
    ID_REGEX.lastIndex = start;
    let result = ID_REGEX.exec(sourceCode);
    if(!result) return null;
    const token = matchLongest(sourceCode, start, keywordsSearchTree);
    if(token) return token;
    return {value: result[0], type: TokenType.ID};
}

export function tokenize(sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    let lineNo = 1;

    for(let i=0; i<sourceCode.length; i++) {
        const char: string = sourceCode[i];
        const charCode: number = sourceCode.charCodeAt(i);

        // Handle Indentation-case
        if(char === '\t') {
            tokens.push({ value: ' ', type: TokenType.INDENT });
        } else if(char === ' ' && sourceCode.length >= i+4 && sourceCode[i+1] === ' ' && sourceCode[i+2] === ' ' && sourceCode[i+3] === ' ') {
            tokens.push({ value: '    ', type: TokenType.INDENT });
            i += 4;
        }

        // Handle whitespace
        if(char === ' ') {
            continue;
        } else if(char === '\n') {
            lineNo++;
            continue;
        } else if(char === '\r') {
            if(sourceCode.length >= i+1 && sourceCode[i+1] === '\n')
                i+=2;
            else
                i++;
            lineNo++;
            continue;
        }

        // Extract Identifier/Keyword
        let token = consumeIdentifier(sourceCode, i);
        if(token) {
            tokens.push(token);
            i += token.value.length - 1;
            continue;
        }

        // 


        token = matchLongest(sourceCode, i, literalsSearchTree);
        if(token) {
            tokens.push(token);
            i += token.value.length - 1;
        } else {
            throw new Error(`Unexpected character: ${sourceCode[i]}`);
        }
    }
    return tokens;
}

const out = tokenize('+++')
console.log(out)
