import { CstParser } from "chevrotain";
import { Token } from "../lexer/tokens";
import { Directives } from "../lexer/directives";
import { createParserToken } from "./parser_tokens";

export function parse(tokenized_output: {tokens: Token[], directives: Directives}) {
    const {tokens, directives} = tokenized_output;
    const parserTokens = tokens.map(createParserToken);

    
}

