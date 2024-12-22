import {Token, TokenType} from "./tokens";
import { SearchTreeNode } from "./searchtree";
import { literalsSearchTree } from "./literals";
import {keywordsSearchTree} from "./keywords";
import { Directives } from "./directives";


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

const ALPHABETS_REGEX = /[a-zA-Z]+/y;
const ID_REGEX = /([a-zA-Z_])(\.?([a-zA-Z_0-9]+\.)*[a-zA-Z_0-9]+)?/y;
/*
This is not being used in the parser, also this will cause clash
with COLOR_LITERAL as that also starts with a hashtag

const ID_EX_REGEX = /([a-zA-Z_#])(\.?([a-zA-Z_#0-9]+\.)*[a-zA-Z_#0-9]+)?/y;
*/
const COLOR_LITERAL1_REGEX = /#[0-9a-fA-F]{6}/y;
const COLOR_LITERAL2_REGEX = /#[0-9a-fA-F]{8}/y;
const FLOAT_LITERAL_REGEX = /(?:\.\d+(?:[eE][+-]?\d+)?|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/y;
const INT_LITERAL_REGEX = /[0-9]+/y;
const STR_LITERAL_REGEX = /(?:"(?:\\.|[^\\\n"])*"|'(?:\\.|[^\\\n'])*')/y;


function regexTest(regex: RegExp, sourceCode: string, start: number) {
    regex.lastIndex = start;
    let result = regex.exec(sourceCode);
    if(!result) return null;
    return result[0];
}

function consumeIdentifier(sourceCode: string, start: number): Token|null {
    let result = regexTest(ID_REGEX, sourceCode, start)
    if(!result) return null;
    const identifier: string = result;
    const token = matchLongest(identifier, 0, keywordsSearchTree);
    if(token) return token;
    return {value: identifier, type: TokenType.ID};
}

function consumeLiteralValues(sourceCode: string, start: number): Token|null {
    // COLOR_LITERAL check
    const color_literal1_result = regexTest(COLOR_LITERAL1_REGEX, sourceCode, start);
    if(color_literal1_result) return {value: color_literal1_result, type: TokenType.COLOR_LITERAL};
    const color_literal2_result = regexTest(COLOR_LITERAL2_REGEX, sourceCode, start);
    if(color_literal2_result) return {value: color_literal2_result, type: TokenType.COLOR_LITERAL};
    // INT_LITERAL check
    const int_literal_result = regexTest(INT_LITERAL_REGEX, sourceCode, start);
    if(int_literal_result) return {value: int_literal_result, type: TokenType.INT_LITERAL};
    // FLOAT_LITERAL check
    const float_literal_result = regexTest(FLOAT_LITERAL_REGEX, sourceCode, start);
    if(float_literal_result) return {value: float_literal_result, type: TokenType.FLOAT_LITERAL};
    if(['"', "'"].includes(sourceCode.charAt(start))) {
        const str_literal_result = regexTest(STR_LITERAL_REGEX, sourceCode, start);
        if(!str_literal_result)
            throw new Error(`Expected an ending ${sourceCode.charAt(start)}`);
        return {value: str_literal_result, type: TokenType.STR_LITERAL};
    }
    return null;
}

function handleLineEnd(tokens: Token[], lineEndToken: Token) {
    const tokensToPop: TokenType[] = [
        TokenType.LBEG, TokenType.INDENT
    ]
    if(tokens.length == 0 || tokensToPop.includes(tokens[tokens.length-1].type) || tokens[tokens.length-1].type === TokenType.EMPTY_LINE) {
        while(tokens.length > 0 && 
            tokensToPop.includes(tokens[tokens.length-1].type))
            tokens.pop();
        tokens.push({value: lineEndToken.value, metadata: lineEndToken.metadata, type: TokenType.EMPTY_LINE});
        return tokens;
    } else {
        tokens.push(lineEndToken);
    }
    return tokens;
}

function skipTillLineEnd(sourceCode: string, start: number) {
    for(let j=start; j<sourceCode.length; j++) {
        const _char = sourceCode[j];
        if(_char === '\n' || _char === '\r') {
            return j;
        }
    }
    return sourceCode.length;
}

function skipWhiteSpace(sourceCode: string, start: number) {
    for(let j=start; j<sourceCode.length; j++) {
        const _char = sourceCode[j];
        if(_char !== ' ' && _char !== '\t')
            return j;
    }
    return sourceCode.length;
}

export function tokenize(sourceCode: string, skip_second_pass:boolean = false): {tokens: Token[], directives: Directives} {
    let tokens = new Array<Token>();
    const directives: Directives = {};
    let lineNo = 1;
    let lastLineEndIndex = 0;

    for(let i=0; i<sourceCode.length; i++) {
        let char: string = sourceCode[i];
        let metadata: Token['metadata'] = {line: lineNo, column: i-lastLineEndIndex, absoluteIndex: i};

        // Automatically add LBEG token (Line-begin token)
        if(i === 0 || (tokens.length > 0 && [TokenType.LEND, TokenType.EMPTY_LINE].includes(tokens[tokens.length-1].type)))
            tokens.push({value: null, type: TokenType.LBEG, metadata})

        // Handle Indentation-case
        if(tokens.length > 0 && tokens[tokens.length-1].type === TokenType.LBEG) {
            if(char === '\t') {
                tokens.push({ value: ' ', type: TokenType.INDENT, metadata });
                continue;
            } else if(char === ' ') {
                let spacesCount = 1;
                for(let j=i+1; j<sourceCode.length; j++) {
                    if(sourceCode[j] === ' ') {
                        spacesCount++;
                    } else {
                        break;
                    }
                }
                if(spacesCount % 4 === 0) {
                    const indentsCount = spacesCount / 4;
                    for(let j=0; j<indentsCount; j++)
                        tokens.push({ value: '    ', type: TokenType.INDENT, metadata });
                    i += spacesCount - 1;
                    continue;
                } else {
                    // if(tokens.length > 0 && tokens[tokens.length-1].type === TokenType.LBEG)
                    //     tokens.pop();
                    i += spacesCount - 1;
                    tokens.push({ value: null, type: TokenType.LINE_CONTINUATION, metadata })
                    continue;
                }
            }
        }

        // Skip comments & handle compiler declarations
        if(char === '/' && sourceCode.length >= i+1 && sourceCode[i+1] === '/') {
            if(sourceCode.length >= i+3 && sourceCode[i+2] === '@') {
                // it's an @ directive, eg: //@version=3, //@type
                const directive_name = regexTest(ALPHABETS_REGEX, sourceCode, i+3);
                if(directive_name === 'version') {
                    const _i = skipWhiteSpace(sourceCode, i+3+7);
                    const _check = sourceCode?.[_i];
                    if(_check === '=') {
                        const __i = skipWhiteSpace(sourceCode, _i+1);
                        const int_match = regexTest(INT_LITERAL_REGEX, sourceCode, __i);
                        if(int_match) {
                            directives.version = parseInt(int_match);
                        }
                    }
                }
            } else if(sourceCode.length >= i+3 && sourceCode[i+2] === '#') {
                // it's a # directive, eg: //#region, //#endregion
                
            }
            i = skipTillLineEnd(sourceCode, i+3);
            continue;
        }

        // Handle whitespace & Line Numbers
        if(char === ' ') {
            continue;
        } else if(char === '\n') {
            lineNo++;
            lastLineEndIndex = i+1;
            tokens = handleLineEnd(tokens, {value: '\n', type: TokenType.LEND, metadata})
            continue;
        } else if(char === '\r') {
            if(sourceCode.length >= i+1 && sourceCode[i+1] === '\n') {
                i+=1;
                lastLineEndIndex = i+2;
                tokens = handleLineEnd(tokens, {value: '\r\n', type: TokenType.LEND, metadata})
            } else {
                lastLineEndIndex = i+1;
                tokens = handleLineEnd(tokens, {value: '\r', type: TokenType.LEND, metadata})
            }
            lineNo++;
            continue;
        }

        // Extract Identifier/Keyword
        let token = consumeIdentifier(sourceCode, i);
        if(token) {
            tokens.push({...token, metadata});
            i += (token.value?.length || 0) - 1;
            continue;
        }

        // Consume Literal Values
        token = consumeLiteralValues(sourceCode, i);
        if(token) {
            tokens.push({...token, metadata});
            i += (token.value?.length || 0) - 1;
            continue;
        }


        token = matchLongest(sourceCode, i, literalsSearchTree);
        if(token) {
            // console.log("Literal match: ", token);
            tokens.push({...token, metadata});
            i += (token.value?.length || 0) - 1;
        } else {
            throw new Error(`Unexpected character: ${sourceCode[i]}, line: ${lineNo}, index: ${i}, ${sourceCode.charCodeAt(i)}`);
        }
    }

    if(!directives.version) {
        directives.version = 1;
    }

    if(!skip_second_pass) {
        // Post-processing to handle BEGIN, END, PLEND & LINE_CONTINUATION tokens
        const newTokens: Token[] = [];
        let lastLineIndentationLevel = 0;
        let lastLineLEND: Token|null = null;
        for(let i=0; i<tokens.length; i++) {
            const token = tokens[i];
            if(token.type === TokenType.LBEG) {
                let indentsCount = 0;
                for(let j=i+1; j<tokens.length; j++) {
                    if(tokens[j].type === TokenType.INDENT) {
                        indentsCount++;
                        continue;
                    } else {
                        break;
                    }
                }
                if(indentsCount > lastLineIndentationLevel) {
                    newTokens.push({value: null, metadata: tokens[i].metadata, type: TokenType.BEGIN});
                    newTokens.push(token); // push LBEG
                    lastLineIndentationLevel = indentsCount;
                    i += indentsCount;
                } else if(indentsCount < lastLineIndentationLevel) {
                    const metadata = lastLineLEND?.metadata || tokens?.[i-1]?.metadata || tokens[i]?.metadata;
                    const diff = lastLineIndentationLevel - indentsCount;
                    for(let j=0; j<diff; j++) {
                        newTokens.push({ value: null, metadata, type: TokenType.END })
                        newTokens.push({ value: null, metadata, type: TokenType.PLEND })
                    }
                    newTokens.push(token); // push LBEG
                    lastLineIndentationLevel = indentsCount;
                    i += indentsCount;
                } else if(indentsCount === lastLineIndentationLevel) {
                    newTokens.push(token); // push LBEG
                }
            } else if(token.type === TokenType.LEND) {
                lastLineLEND = token;
                newTokens.push(token);
            } else if(token.type === TokenType.LINE_CONTINUATION) {
                const tokensToRemove = [TokenType.LEND, TokenType.LBEG, TokenType.INDENT, TokenType.EMPTY_LINE] as TokenType[];
                while(tokensToRemove.includes(newTokens[newTokens.length-1].type))
                    newTokens.pop();
            } else {
                newTokens.push(token);
            }
        }
        return {tokens:newTokens, directives};
    }

    return {tokens, directives};
}



