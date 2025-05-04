export enum TokenType {
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
    ID_EX,
    INDENT,
    LINE_CONTINUATION,
    EMPTY_LINE_V1,
    EMPTY_LINE,
    WHITESPACE,
    DOT // Add DOT token type
}

export interface Token {
    value: string|null,
    type: TokenType;
    metadata?: {
        line: number;
        column: number;
        absoluteIndex: number;
    }
}
