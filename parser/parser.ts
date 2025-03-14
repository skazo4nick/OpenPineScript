import { Token } from "../lexer/tokens";
import { Directives } from "../lexer/directives";
import { createParserToken } from "./parser_tokens";
import { OpenPinescriptParser } from "./parser_builder";

export function parse(tokenized_output: {tokens: Token[], directives: Directives}) {
    const {tokens, directives} = tokenized_output;
    const parserTokens = tokens.map(createParserToken);

    const parser = new OpenPinescriptParser();
    const parseResult = parser.start(parserTokens);
    console.log(parseResult);
}

