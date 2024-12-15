import {Token, TokenType} from "./tokens";
import { buildSearchTree } from "./searchtree";

function Literal(value: string, type: TokenType): Token { return ({ value, type }); }

export const Literals: Token[] = [
    Literal("?", TokenType.COND),
    Literal(":", TokenType.COND_ELSE),
    Literal("==", TokenType.EQ),
    Literal("!=", TokenType.NEQ),
    Literal(">", TokenType.GT),
    Literal(">=", TokenType.GE),
    Literal("<", TokenType.LT),
    Literal("<=", TokenType.LE),
    Literal("+", TokenType.PLUS),
    Literal("-", TokenType.MINUS),
    Literal("*", TokenType.MUL),
    Literal("/", TokenType.DIV),
    Literal("%", TokenType.MOD),
    Literal(",", TokenType.COMMA),
    Literal("=>", TokenType.ARROW),
    Literal("(", TokenType.LPAR),
    Literal(")", TokenType.RPAR),
    Literal("[", TokenType.LSQBR),
    Literal("]", TokenType.RSQBR),
    Literal("=", TokenType.DEFINE),
    Literal(":=", TokenType.ASSIGN),  
];

export const literalsSearchTree = buildSearchTree(Literals);

