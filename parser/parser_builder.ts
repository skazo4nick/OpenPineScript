import { CstParser } from "chevrotain";
import {
    AND,
    ARROW,
    ASSIGN,
    BEGIN,
    BOOL_LITERAL,
    BREAK,
    COLOR_LITERAL,
    COMMA,
    COND,
    COND_ELSE,
    CONTINUE,
    DEFINE,
    DIV,
    EMPTY_LINE,
    END,
    EQ,
    FLOAT_LITERAL,
    FOR_STMT,
    FOR_STMT_BY,
    FOR_STMT_TO,
    GE,
    GT,
    ID,
    IF_COND,
    IF_COND_ELSE,
    INT_LITERAL,
    LBEG,
    LE,
    LEND,
    LPAR,
    LSQBR,
    LT,
    MINUS,
    MOD,
    MUL,
    NEQ,
    NOT,
    OR,
    PLEND,
    PLUS,
    RPAR,
    RSQBR,
    STR_LITERAL,
    allTokens } from "./parser_tokens";

export class OpenPinescriptParser extends CstParser {

    constructor() {
        super(allTokens); // Pass all token definitions
        this.performSelfAnalysis(); // Initialize the parser
    }

    public script = this.RULE('script', () => {
        this.MANY(() => {
            this.SUBRULE(this.stmt)
        })
    })

    private stmt = this.RULE('stmt', () => {
        this.OR([
            { ALT: () => this.SUBRULE(this.func_def_stmt) },
            { ALT: () => this.SUBRULE(this.global_stmt_or_multistmt) }
        ])
    })

    private global_stmt_or_multistmt = this.RULE("global_stmt_or_multistmt", () => {
        this.OR([
            {
                ALT: () => {
                    this.CONSUME(BEGIN)
                    this.SUBRULE(this.global_stmt_or_multistmt)
                    this.CONSUME(END)
                }
            },
            {
                ALT: () => this.SUBRULE(this.global_stmt_or_multistmt2)
            },
            {
                ALT: () => this.CONSUME(EMPTY_LINE)
            }
        ])
        
    })

    private global_stmt_or_multistmt2 = this.RULE("global_stmt_or_multistmt2", () => {
        this.CONSUME(LBEG);
        this.AT_LEAST_ONE_SEP({
            SEP: COMMA,
            DEF: () => {
                this.SUBRULE(this.global_stmt_content)
            }
        })
        this.OPTION(() => {
            this.CONSUME(COMMA)
        })
        this.OR([
            { ALT: () => this.CONSUME(LEND) },
            { ALT: () => this.CONSUME(PLEND) },
        ])
    })
    
    private global_stmt_content = this.RULE("global_stmt_content", () => {
        this.OR([
            { ALT: () => this.SUBRULE(this.var_def) },
            { ALT: () => this.SUBRULE(this.var_defs) },
            { ALT: () => this.SUBRULE(this.fun_call) },
            { ALT: () => this.SUBRULE(this.if_expr) },
            { ALT: () => this.SUBRULE(this.var_assign) },
            { ALT: () => this.SUBRULE(this.for_expr) },
            { ALT: () => this.SUBRULE(this.loop_break) },
            { ALT: () => this.SUBRULE(this.loop_continue) },
        ])
    })

    private func_def_stmt = this.RULE("func_def_stmt", () => {
        this.OR([
            {
                ALT: () => {
                    this.CONSUME(LBEG)
                    this.SUBRULE(this.fun_def_singleline)
                    this.CONSUME(LEND)
                }
            },
            {
                ALT: () => {
                    this.CONSUME(LBEG)
                    this.SUBRULE(this.fun_def_multiline)
                    this.CONSUME(PLEND)
                }
            }
        ])
    })

    private fun_def_singleline = this.RULE("fun_def_singleline", () => {
        this.CONSUME(ID)
        this.SUBRULE(this.fun_head)
        this.CONSUME(ARROW)
        this.SUBRULE(this.fun_body_singleline)
    })

    private fun_def_multiline = this.RULE("fun_def_multiline", () => {
        this.CONSUME(ID)
        this.SUBRULE(this.fun_head)
        this.CONSUME(ARROW)
        this.OPTION(() => this.CONSUME(LEND))
        this.SUBRULE(this.fun_body_multiline)
    })

    private fun_head = this.RULE("fun_head", () => {
        this.CONSUME(LPAR)
        this.MANY_SEP({
            SEP: COMMA,
            DEF: () => {
                this.CONSUME(ID)
            }
        })
        this.CONSUME(RPAR)
    })

    private fun_body_singleline = this.RULE("fun_body_singleline", () => {
        this.SUBRULE(this.local_stmt_singleline)
    })

    private local_stmt_singleline = this.RULE("local_stmt_singleline", () => {
        this.OR([
            {
                ALT: () => {
                    this.CONSUME(BEGIN)
                    this.SUBRULE(this.local_stmt_singleline)
                    this.CONSUME(END)
                }
            },
            { ALT: () => this.SUBRULE(this.local_stmt_singleline2) }
        ])
    })

    private local_stmt_singleline2 = this.RULE("local_stmt_singleline2", () => {
        this.AT_LEAST_ONE_SEP({
            SEP: COMMA,
            DEF: () => {
                this.SUBRULE(this.local_stmt_content)
            }
        })
        this.OPTION(() => this.CONSUME(COMMA))
    })

    private local_stmt_content = this.RULE("local_stmt_content", () => {
        this.OR([
            { ALT: () => this.SUBRULE(this.var_def) },
            { ALT: () => this.SUBRULE(this.var_defs) },
            { ALT: () => this.SUBRULE(this.arith_expr) },
            { ALT: () => this.SUBRULE(this.arith_exprs) },
            { ALT: () => this.SUBRULE(this.var_assign) },
            { ALT: () => this.SUBRULE(this.loop_break) },
            { ALT: () => this.SUBRULE(this.loop_continue) }
        ])
    })

    private loop_break = this.RULE("loop_break", () => {
        this.CONSUME(BREAK)
    })

    private loop_continue = this.RULE("loop_continue", () => {
        this.CONSUME(CONTINUE)
    })

    private fun_body_multiline = this.RULE("fun_body_multiline", () => {
        this.SUBRULE(this.local_stmts_multiline)
    })

    private local_stmts_multiline = this.RULE("local_stmts_multiline", () => {
        this.MANY(() => this.CONSUME(EMPTY_LINE))
        this.CONSUME(BEGIN)
        this.SUBRULE(this.local_stmts_multiline2)
        this.CONSUME(END)
    })

    private local_stmts_multiline2 = this.RULE("local_stmts_multiline2", () => {
        this.AT_LEAST_ONE(() => {
            this.SUBRULE(this.local_stmt_multiline)
        })
    })

    private local_stmt_multiline = this.RULE("local_stmt_multiline", () => {
        this.CONSUME(LBEG)
        this.AT_LEAST_ONE_SEP({
            SEP: COMMA,
            DEF: () => {
                this.SUBRULE(this.local_stmt_content)
            }
        })
        this.OPTION(() => this.CONSUME(COMMA))
        this.OR([
            { ALT: () => this.CONSUME(LEND) },
            { ALT: () => this.CONSUME(PLEND) }
        ])
    })

    private var_def = this.RULE("var_def", () => {
        this.CONSUME(ID)
        this.CONSUME(DEFINE)
        this.SUBRULE(this.arith_expr)
    })

    private var_defs = this.RULE("var_defs", () => {
        this.SUBRULE(this.ids_array)
        this.CONSUME(DEFINE)
        this.SUBRULE(this.arith_expr)
    })

    private var_assign = this.RULE("var_assign", () => {
        this.CONSUME(ID)
        this.CONSUME(ASSIGN)
        this.SUBRULE(this.arith_expr)
    })

    private ids_array = this.RULE("ids_array", () => {
        this.CONSUME(LSQBR)
        this.MANY_SEP({
            SEP: COMMA,
            DEF: () => this.CONSUME(ID)
        })
        this.CONSUME(RSQBR)
    })

    private arith_exprs = this.RULE("arith_exprs", () => {
        this.CONSUME(LSQBR)
        this.AT_LEAST_ONE_SEP({
            SEP: COMMA,
            DEF: () => this.SUBRULE(this.arith_expr)
        })
        this.CONSUME(RSQBR)
    })

    private arith_expr = this.RULE("arith_expr", () => {
        this.OR([
            { ALT: () => this.SUBRULE(this.ternary_expr) },
            { ALT: () => this.SUBRULE(this.if_expr) },
            { ALT: () => this.SUBRULE(this.for_expr) }
        ])
    })

    private if_expr = this.RULE("if_expr", () => {
        this.OR([
            { ALT: () => this.SUBRULE(this.if_then_expr) },
            { ALT: () => this.if_then_else_expr }
        ])
    })

    private if_then_expr = this.RULE("if_then_expr", () => {
        this.CONSUME(IF_COND)
        this.SUBRULE(this.ternary_expr)
        this.CONSUME(LEND)
        this.SUBRULE(this.stmts_block)
        this.CONSUME(PLEND)
        this.CONSUME(LBEG)
        this.CONSUME(IF_COND_ELSE)
        this.CONSUME(LEND)
        this.SUBRULE(this.stmts_block)
    })

    private if_then_else_expr = this.RULE("if_then_else_expr", () => {
        this.CONSUME(IF_COND)
        this.SUBRULE(this.ternary_expr)
        this.CONSUME(LEND)
        this.SUBRULE(this.stmts_block)
    })

    private for_expr = this.RULE("for_expr", () => {
        this.OR([
            { ALT: () => this.SUBRULE(this.for_loop_with_step) },
            { ALT: () => this.SUBRULE(this.for_loop_without_step) },
        ])
    })

    private for_loop_with_step = this.RULE("for_loop_with_step", () => {
        this.CONSUME(FOR_STMT)
        this.SUBRULE(this.var_def)
        this.CONSUME(FOR_STMT_TO)
        this.SUBRULE(this.ternary_expr)
        this.CONSUME(FOR_STMT_BY)
        this.SUBRULE(this.ternary_expr)
        this.CONSUME(LEND)
        this.SUBRULE(this.stmts_block)
    })

    private for_loop_without_step = this.RULE("for_loop_without_step", () => {
        this.CONSUME(FOR_STMT)
        this.SUBRULE(this.var_def)
        this.CONSUME(FOR_STMT_TO)
        this.SUBRULE(this.ternary_expr)
        this.CONSUME(LEND)
        this.SUBRULE(this.stmts_block)
    })

    private stmts_block = this.RULE("stmts_block", () => {
        this.SUBRULE(this.fun_body_multiline)
    })

    private ternary_expr = this.RULE("ternary_expr", () => {
        this.SUBRULE(this.or_expr)
        this.OPTION(() => {
            this.CONSUME(COND)
            this.SUBRULE(this.ternary_expr2)
        })
    })

    private ternary_expr2 = this.RULE("ternary_expr2", () => {
        this.SUBRULE(this.ternary_expr)
        this.CONSUME(COND_ELSE)
        this.SUBRULE(this.ternary_expr)
    })

    private or_expr = this.RULE("or_expr", () => {
        this.AT_LEAST_ONE_SEP({
            SEP: OR,
            DEF: () => {
                this.SUBRULE(this.and_expr)
            }
        })
    })

    private and_expr = this.RULE("and_expr", () => {
        this.AT_LEAST_ONE_SEP({
            SEP: AND,
            DEF: () => {
                this.SUBRULE(this.eq_expr)
            }
        })
    })

    private eq_expr = this.RULE("eq_expr", () => {
        this.SUBRULE(this.cmp_expr)
        this.MANY(() => {
            this.OR([
                { ALT: () => this.CONSUME(EQ) },
                { ALT: () => this.CONSUME(NEQ) },
            ])
            this.SUBRULE(this.cmp_expr)
        })
    })

    private cmp_expr = this.RULE("cmp_expr", () => {
        this.SUBRULE(this.add_expr)
        this.MANY(() => {
            this.OR([
                { ALT: () => this.CONSUME(GT) },
                { ALT: () => this.CONSUME(GE) },
                { ALT: () => this.CONSUME(LT) },
                { ALT: () => this.CONSUME(LE) },
            ])
            this.SUBRULE(this.add_expr)
        })
    })

    private add_expr = this.RULE("add_expr", () => {
        this.SUBRULE(this.mult_expr)
        this.MANY(() => {
            this.OR([
                { ALT: () => this.CONSUME(PLUS) },
                { ALT: () => this.CONSUME(MINUS) },
            ])
            this.SUBRULE(this.mult_expr)
        })
    })

    private mult_expr = this.RULE("mult_expr", () => {
        this.SUBRULE(this.unary_expr)
        this.MANY(() => {
            this.OR([
                { ALT: () => this.CONSUME(MUL) },
                { ALT: () => this.CONSUME(DIV) },
                { ALT: () => this.CONSUME(MOD) },
            ])
            this.SUBRULE(this.unary_expr)
        })
    })

    private unary_expr = this.RULE("unary_expr", () => {
        this.OR([
            {
                ALT: () => {
                    this.CONSUME(NOT)
                    this.SUBRULE(this.sqbr_expr)
                }
            },
            {
                ALT: () => {
                    this.SUBRULE(this.sqbr_expr)
                }
            }
        ])
    })

    private sqbr_expr = this.RULE("sqbr_expr", () => {
        this.SUBRULE(this.atom)
        this.OPTION(() => {
            this.CONSUME(LSQBR)
            this.SUBRULE(this.arith_expr)
            this.CONSUME(RSQBR)
        })
    })

    private atom = this.RULE("atom", () => {
        this.OR([
            {
                ALT: () => {
                    this.SUBRULE(this.fun_call)
                }
            },
            {
                ALT: () => {
                    this.CONSUME(ID)
                }
            },
            {
                ALT: () => {
                    this.SUBRULE(this.literal)
                }
            },
            {
                ALT: () => {
                    this.CONSUME(LPAR)
                    this.SUBRULE(this.arith_expr)
                    this.CONSUME(RPAR)
                }
            }
        ])
    })

    private fun_call = this.RULE("fun_call", () => {
        this.CONSUME(ID)
        this.CONSUME(LPAR)
        this.OPTION(() => {
            this.SUBRULE(this.fun_actual_args)
        })
        this.CONSUME(RPAR)
    })

    private fun_actual_args = this.RULE("fun_actual_args", () => {
        this.OR([
            {
                ALT: () => {
                    this.SUBRULE(this.pos_args)
                    this.OPTION(() => {
                        this.CONSUME(COMMA)
                        this.SUBRULE(this.kw_args)
                    })
                }
            },
            {
                ALT: () => {
                    this.SUBRULE(this.kw_args)
                }
            }
        ])
    })

    private pos_args = this.RULE("pos_args", () => {
        this.AT_LEAST_ONE_SEP({
            SEP: COMMA,
            DEF: () => {
                this.SUBRULE(this.arith_expr)
            }
        })
    })

    private kw_args = this.RULE("kw_args", () => {
        this.AT_LEAST_ONE_SEP({
            SEP: COMMA,
            DEF: () => {
                this.SUBRULE(this.kw_arg)
            }
        })
    })

    private kw_arg = this.RULE("kw_arg", () => {
        this.CONSUME(ID)
        this.CONSUME(DEFINE)
        this.SUBRULE(this.arith_expr)
    })

    private literal = this.RULE("literal", () => {
        this.OR([
            {
                ALT: () => {
                    this.SUBRULE(this.num_literal)
                }
            },
            {
                ALT: () => {
                    this.SUBRULE(this.other_literal)
                }
            }
        ])
    })

    private num_literal = this.RULE("num_literal", () => {
        this.OR([
            {
                ALT: () => {
                    this.CONSUME(INT_LITERAL)
                }
            },
            {
                ALT: () => {
                    this.CONSUME(FLOAT_LITERAL)
                }
            }
        ])
    })

    private other_literal = this.RULE("other_literal", () => {
        this.OR([
            {
                ALT: () => {
                    this.CONSUME(STR_LITERAL)
                }
            },
            {
                ALT: () => {
                    this.CONSUME(BOOL_LITERAL)
                }
            },
            {
                ALT: () => {
                    this.CONSUME(COLOR_LITERAL)
                }
            }
        ])
    })

}
