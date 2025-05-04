# OpenPineScript Project: Initial Analysis Report

## Overview
This project is a Pine Script language toolkit, providing a lexer and parser for Pine Script source code. It is implemented in TypeScript and uses [Chevrotain](https://chevrotain.io/) for parsing.

---

## Project Structure

- `lexer/` — Contains the Pine Script lexer, token definitions, and test runner.
- `parser/` — Contains the Chevrotain-based parser, grammar, token mapping, and test runner.
- `tests/` — Contains sample Pine Script files for testing.
- `package.json` — Project dependencies and scripts.
- `README.md` — Project overview and instructions.

---

## Lexer
- Tokenizes Pine Script source code into an array of tokens and directives.
- Main entry: `lexer/lexer.ts` (function: `tokenize`).
- Example/test runner: `lexer/run_tests.ts` — processes `.pine` files in `lexer/tests/` and outputs `.json` token files.

**Usage:**
1. Place a `.pine` file in `lexer/tests/`.
2. Run: `npx tsx lexer/run_tests.ts` to generate tokenized `.json` output.

---

## Parser
- Converts token streams (from the lexer) into a Concrete Syntax Tree (CST).
- Built with Chevrotain; grammar defined in `parser/parser_builder.ts`.
- Token mapping in `parser/parser_tokens.ts`.
- Main entry: `parser/parser.ts` (function: `parse`).
- Test runner: `parser/run_tests.ts` — copies `.json` files from `lexer/tests/` to `parser/tests/`, parses them, and prints the CST.

**Usage:**
1. Ensure tokenized `.json` files are in `parser/tests/` (copied automatically by the test runner).
2. Run: `npx tsx parser/run_tests.ts` to parse and print the CST.

---

## Testing
- Example test file: `tests/var_dec.pine` (variable assignment and conditional reassignment).
- Tokenized and parsed through the above pipeline.

---

## Workflow Management
- No workflow/orchestration system (like Airflow) is present. All processing is via direct script execution.

---

## How to Test a Pine Script File
1. Place your `.pine` file in `lexer/tests/`.
2. Run the lexer test script to generate tokens.
3. Run the parser test script to parse the tokens and print the CST.

---

## Summary
This project provides a modular pipeline for lexing and parsing Pine Script, with clear separation between tokenization and parsing stages, and includes test runners for both. It is suitable for further development into a full Pine Script analysis or transpilation toolchain.
