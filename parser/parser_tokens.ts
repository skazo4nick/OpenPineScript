import { createToken } from "chevrotain";
import { Token, TokenType } from "../lexer/tokens";

export const COND = createToken({name: "COND"})
export const COND_ELSE = createToken({name: "COND_ELSE"})
export const OR = createToken({name: "OR"})
export const AND = createToken({name: "AND"})
export const NOT = createToken({name: "NOT"})
export const EQ = createToken({name: "EQ"})
export const NEQ = createToken({name: "NEQ"})
export const GT = createToken({name: "GT"})
export const GE = createToken({name: "GE"})
export const LT = createToken({name: "LT"})
export const LE = createToken({name: "LE"})
export const PLUS = createToken({name: "PLUS"})
export const MINUS = createToken({name: "MINUS"})
export const MUL = createToken({name: "MUL"})
export const DIV = createToken({name: "DIV"})
export const MOD = createToken({name: "MOD"})
export const COMMA = createToken({name: "COMMA"})
export const ARROW = createToken({name: "ARROW"})
export const LPAR = createToken({name: "LPAR"})
export const RPAR = createToken({name: "RPAR"})
export const LSQBR = createToken({name: "LSQBR"})
export const RSQBR = createToken({name: "RSQBR"})
export const DEFINE = createToken({name: "DEFINE"})
export const IF_COND = createToken({name: "IF_COND"})
export const IF_COND_ELSE = createToken({name: "IF_COND_ELSE"})
export const BEGIN = createToken({name: "BEGIN"})
export const END = createToken({name: "END"})
export const ASSIGN = createToken({name: "ASSIGN"})
export const FOR_STMT = createToken({name: "FOR_STMT"})
export const FOR_STMT_TO = createToken({name: "FOR_STMT_TO"})
export const FOR_STMT_BY = createToken({name: "FOR_STMT_BY"})
export const BREAK = createToken({name: "BREAK"})
export const CONTINUE = createToken({name: "CONTINUE"})
export const LBEG = createToken({name: "LBEG"})
export const LEND = createToken({name: "LEND"})
export const PLEND = createToken({name: "PLEND"})
export const INT_LITERAL = createToken({name: "INT_LITERAL"})
export const FLOAT_LITERAL = createToken({name: "FLOAT_LITERAL"})
export const STR_LITERAL = createToken({name: "STR_LITERAL"})
export const BOOL_LITERAL = createToken({name: "BOOL_LITERAL"})
export const COLOR_LITERAL = createToken({name: "COLOR_LITERAL"})
export const ID = createToken({name: "ID"})
// const ID_EX = createToken({name: "ID_EX"})
// const INDENT = createToken({name: "INDENT"})
// const LINE_CONTINUATION = createToken({name: "LINE_CONTINUATION"})
export const EMPTY_LINE = createToken({name: "EMPTY_LINE"})

export const allTokens = [
    COND,
    COND_ELSE,
    OR,
    AND,
    NOT,
    EQ,
    NEQ,
    GT,
    GE,
    LT,
    LE,
    PLUS,
    MINUS,
    MUL,
    DIV,
    MOD,
    COMMA,
    ARROW,
    LPAR,
    RPAR,
    LSQBR,
    RSQBR,
    DEFINE,
    IF_COND,
    IF_COND_ELSE,
    BEGIN,
    END,
    ASSIGN,
    FOR_STMT,
    FOR_STMT_TO,
    FOR_STMT_BY,
    BREAK,
    CONTINUE,
    LBEG,
    LEND,
    PLEND,
    INT_LITERAL,
    FLOAT_LITERAL,
    STR_LITERAL,
    BOOL_LITERAL,
    COLOR_LITERAL,
    ID,
    EMPTY_LINE
]

const lexerToParserTokens = {
    [TokenType.COND]: COND,
    [TokenType.COND_ELSE]: COND_ELSE,
    [TokenType.OR]: OR,
    [TokenType.AND]: AND,
    [TokenType.NOT]: NOT,
    [TokenType.EQ]: EQ,
    [TokenType.NEQ]: NEQ,
    [TokenType.GT]: GT,
    [TokenType.GE]: GE,
    [TokenType.LT]: LT,
    [TokenType.LE]: LE,
    [TokenType.PLUS]: PLUS,
    [TokenType.MINUS]: MINUS,
    [TokenType.MUL]: MUL,
    [TokenType.DIV]: DIV,
    [TokenType.MOD]: MOD,
    [TokenType.COMMA]: COMMA,
    [TokenType.ARROW]: ARROW,
    [TokenType.LPAR]: LPAR,
    [TokenType.RPAR]: RPAR,
    [TokenType.LSQBR]: LSQBR,
    [TokenType.RSQBR]: RSQBR,
    [TokenType.DEFINE]: DEFINE,
    [TokenType.IF_COND]: IF_COND,
    [TokenType.IF_COND_ELSE]: IF_COND_ELSE,
    [TokenType.BEGIN]: BEGIN,
    [TokenType.END]: END,
    [TokenType.ASSIGN]: ASSIGN,
    [TokenType.FOR_STMT]: FOR_STMT,
    [TokenType.FOR_STMT_TO]: FOR_STMT_TO,
    [TokenType.FOR_STMT_BY]: FOR_STMT_BY,
    [TokenType.BREAK]: BREAK,
    [TokenType.CONTINUE]: CONTINUE,
    [TokenType.LBEG]: LBEG,
    [TokenType.LEND]: LEND,
    [TokenType.PLEND]: PLEND,
    [TokenType.INT_LITERAL]: INT_LITERAL,
    [TokenType.FLOAT_LITERAL]: FLOAT_LITERAL,
    [TokenType.STR_LITERAL]: STR_LITERAL,
    [TokenType.BOOL_LITERAL]: BOOL_LITERAL,
    [TokenType.COLOR_LITERAL]: COLOR_LITERAL,
    [TokenType.ID]: ID,
    // [TokenType.ID_EX]: ID_EX,
    // [TokenType.INDENT]: INDENT
    // [TokenType.LINE_CONTINUATION]: LINE_CONTINUATION
    [TokenType.EMPTY_LINE]: EMPTY_LINE
}

export function createParserToken(token: Token) {
    const image = token.value || '';
    const parserTokenType = lexerToParserTokens[token.type];
    const startOffset = token.metadata?.absoluteIndex||0
    const startLine = token.metadata?.line||0;
    const endLine = startLine;
    const endOffset = startOffset + image.length;
    return {image, startLine, endLine, startOffset, endOffset, type: parserTokenType}
}
