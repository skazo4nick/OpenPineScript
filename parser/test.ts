import { createToken, Lexer, CstParser } from "chevrotain";

// Define tokens
const COMMA = createToken({ name: "COMMA", pattern: /,/ });
const SEMICOLON = createToken({ name: "SEMICOLON", pattern: /;/ });
const ITEM = createToken({ name: "ITEM", pattern: /[a-zA-Z0-9]+/ });
const WHITESPACE = createToken({ name: "WHITESPACE", pattern: /\s+/, group: Lexer.SKIPPED });

// Lexer definition
const lexer = new Lexer([WHITESPACE, COMMA, SEMICOLON, ITEM]);

// CstParser Setup
class MyParser extends CstParser {
  constructor() {
    super([COMMA, SEMICOLON, ITEM]); // Tokens for the parser
    this.performSelfAnalysis();
  }

  // Rule to match at least one item separated by COMMA or SEMICOLON
  public atLeastOneWithSeparators = this.RULE("atLeastOneWithSeparators", () => {
    const result: any[] = [];  // Array to collect matched token values
    this.MANY_SEP({
      SEP: COMMA,
      DEF: () => {
        const token = this.CONSUME(ITEM);  // Capture the ITEM token
        result.push(token.image);  // Push the token value to the result array
      },
    });
    return result;  // Return the array of token values
  });

  // Top-level rule
  public start = this.RULE("start", () => {
    return this.AT_LEAST_ONE(() => {
      return this.SUBRULE(this.atLeastOneWithSeparators);  // Apply the rule
    });
  });
}

// Testing the parser
const input = "item1, item2";  // Input with mixed separators
const lexingResult = lexer.tokenize(input);

if (lexingResult.errors.length > 0) {
  console.log("Lexer errors:", lexingResult.errors);
} else {
  const parser = new MyParser();
  const parseResult = parser.start(lexingResult.tokens);

  if (parser.errors.length > 0) {
    console.error("Parser errors:", parser.errors);
  } else {
    console.log("Parse result:", JSON.stringify(parseResult, null, 2));  // Show parse result
  }
}
