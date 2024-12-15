import { Token, TokenType } from "./tokens";
import { buildSearchTree } from "./searchtree"

export const Keywords: Token[] = [
    Keyword('or', TokenType.OR),
    Keyword('and', TokenType.AND),
    Keyword('not', TokenType.NOT),
    Keyword('if', TokenType.IF_COND),
    Keyword('else', TokenType.IF_COND_ELSE),
    Keyword('for', TokenType.FOR_STMT),
    Keyword('to', TokenType.FOR_STMT_TO),
    Keyword('by', TokenType.FOR_STMT_BY),
    Keyword('break', TokenType.BREAK),
    Keyword('continue', TokenType.CONTINUE),

    Keyword('true', TokenType.BOOL_LITERAL),
    Keyword('false', TokenType.BOOL_LITERAL),
];

function Keyword(value: string, type: TokenType): Token { return ({ value, type }); }

export const keywordsSearchTree = buildSearchTree(Keywords);
