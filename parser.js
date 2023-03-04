import { Lexer, TOKEN_TYPE } from './lexer.js'
import * as AST from "./ast.js"
import { BoolVal, NumberVal, StringVal } from './val.js'


/**
 * 解析Token，生成语法树
 */
class Parser {
    /**
     * @param { Lexer } lexer 
     */
    constructor(lexer) {
        this.lexer = lexer
        this.current_token = this.lexer.get_next_token()
    }

    error() {
        throw new Error('Invalid syntax')
    }

    eat(token_type) {
        if (this.current_token.type == token_type)
            this.current_token = this.lexer.get_next_token()
        else
            this.error()
    }

    /**
     * program : block
     */
    program() {
        var node = this.block()
        return node
    }

    /**
     * block : LBRACE statement_list RBRACE
     */
    block() {
        this.eat(TOKEN_TYPE.LBRACE)
        var nodes = this.statement_list()
        this.eat(TOKEN_TYPE.RBRACE)

        var root = new AST.Block()
        for (var i in nodes)
            root.children.push(nodes[i])

        return root
    }

    /**
     * statement_list : statement (ENDL statement)*
     */
    statement_list() {
        var node = this.statement()

        var results = [node]

        while (this.current_token.type == TOKEN_TYPE.ENDL) {
            this.eat(TOKEN_TYPE.ENDL)
            results.push(this.statement())
        }

        return results
    }

    /**
     * statement : explanatory | block | assignment_statement
     */
    statement() {
        if (this.current_token.type == TOKEN_TYPE.EXCLM)
            var node = this.annotation()
        else if (this.current_token.type == TOKEN_TYPE.LBRACE)
            var node = this.block()
        else if (this.current_token.type == TOKEN_TYPE.ID)
            var node = this.assignment_statement()
        else
            var node = this.empty()

        return node
    }

    /**
     * assignment_statement : variable ASSIGN expr (explanatory)
     */
    assignment_statement() {
        var left = this.variable()
        var token = this.current_token
        this.eat(TOKEN_TYPE.ASSIGN)
        var right = this.expr()

        if (this.current_token.type == TOKEN_TYPE.EXCLM)
            this.annotation()

        return new AST.Assign(left, token ,right)
    }

    /**
     * variable : ID
     */
    variable() {
        var node = new AST.Var(this.current_token)
        this.eat(TOKEN_TYPE.ID)
        return node
    }

    annotation() {
        this.eat(TOKEN_TYPE.EXCLM)
        return new AST.NullOp()
    }

    empty() {
        return new AST.NullOp()
    }

    /**
     * factor : (ADD | SUB | SHARP | FLAT) factor 
     *        | VAL 
     *        | LPAREN expr RPAREN
     *        | VBAR expr VBAR 
     *        | variable
     */
    factor() {
        var token = this.current_token
        
        switch (token.type) {
            case TOKEN_TYPE.ADD:
                this.eat(TOKEN_TYPE.ADD)
                return new AST.UnOp(token, this.factor())

            case TOKEN_TYPE.SUB:
                this.eat(TOKEN_TYPE.SUB)
                return new AST.UnOp(token, this.factor())

            case TOKEN_TYPE.SHARP:
                this.eat(TOKEN_TYPE.SHARP)
                return new AST.UnOp(token, this.factor())

            case TOKEN_TYPE.FLAT:
                this.eat(TOKEN_TYPE.FLAT)
                return new AST.UnOp(token, this.factor())
            
            case TOKEN_TYPE.NUM:
                this.eat(TOKEN_TYPE.NUM)
                return new AST.Val(token, new NumberVal(token.value))

            case TOKEN_TYPE.STR:
                this.eat(TOKEN_TYPE.STR)
                return new AST.Val(token, new StringVal(token.value))
        
            case TOKEN_TYPE.LPAREN:
                this.eat(TOKEN_TYPE.LPAREN)
                var node = this.expr()
                this.eat(TOKEN_TYPE.RPAREN)
                return node

            case TOKEN_TYPE.VBAR:
                this.eat(TOKEN_TYPE.VBAR)
                var node = new AST.UnOp(token, this.expr())
                this.eat(TOKEN_TYPE.VBAR)
                return node

            case TOKEN_TYPE.ID:
                return this.variable()

            default:
                this.error()
        }
    }

    /**
     * term   : factor ((MUL | DIV | EXDIV | MOD) factor)*
     */
    term() {
        var node = this.factor()

        while (this.current_token.type == TOKEN_TYPE.MUL   ||
               this.current_token.type == TOKEN_TYPE.DIV   ||
               this.current_token.type == TOKEN_TYPE.EXDIV ||
               this.current_token.type == TOKEN_TYPE.MOD) {
            var token = this.current_token
            if (token.type == TOKEN_TYPE.MUL)
                this.eat(TOKEN_TYPE.MUL)
            else if (token.type == TOKEN_TYPE.DIV)
                this.eat(TOKEN_TYPE.DIV)
            else if (token.type == TOKEN_TYPE.EXDIV)
                this.eat(TOKEN_TYPE.EXDIV)
            else if (token.type == TOKEN_TYPE.MOD)
                this.eat(TOKEN_TYPE.MOD)

            node = new AST.BinOp(node, token, this.factor())
        }

        return node
    }

    /**
     * expr   : term ((ADD | SUB) term)*
     */    
    expr() {
        var node = this.term()

        while (this.current_token.type == TOKEN_TYPE.ADD || 
               this.current_token.type == TOKEN_TYPE.SUB) {
            var token = this.current_token
            if (token.type == TOKEN_TYPE.ADD)
                this.eat(TOKEN_TYPE.ADD)
            else if (token.type == TOKEN_TYPE.SUB)
                this.eat(TOKEN_TYPE.SUB)

            node = new AST.BinOp(node, token, this.term())
        }

        return node
    }


    parse() {
        var node = this.program()
        if (this.current_token.type != TOKEN_TYPE.EOF)
            this.error()

        return node
    }
}

const AST_TYPE = AST.AST_TYPE

export { Parser, AST_TYPE }