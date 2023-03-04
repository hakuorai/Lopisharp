'use strict'

/**
 * 支持带括号的四则运算的解释器
 */

/**
 * Token类型
 */
const EOF = -1
const INT = 0
const ADD = 1
const SUB = 2
const MUL = 3
const DIV = 4
const LPAREN = 5
const RPAREN = 6

function isSpace(c) {
    return c == ' ' || c == '\t'
}

function isDigit(c) {
    return c >= '0' && c <= '9'
}

class Token {
    constructor(type, value) {
        this.type = type
        this.value = value
    }
}

/**
 * 将字符解析为Token
 */
class Lexer {
    constructor(text) {
        this.text = text
        this.pos = 0
        this.current_char = text[this.pos]
    }

    error() {
        throw new Error('Invalid character')
    }

    /**
     * 移动索引，更新当前字符
     */
    advance() {
        this.pos++
        if (this.pos >= this.text.length)
            this.current_char = undefined
        else
            this.current_char = this.text[this.pos]
    }

    /**
     * 跳过空白字符
     */
    skip_whitespace() {
        while (isSpace(this.current_char))
            this.advance()
    }

    /**
     * 从当前字符开始解析为整数
     */
    integer() {
        var result = ''
        while (isDigit(this.current_char)) {
            result += this.current_char
            this.advance()
        }
        return parseInt(result)
    }

    /**
     * 词法分析器
     */
    get_next_token() {
        while (this.current_char != null) {

            if (isSpace(this.current_char)) {
                this.skip_whitespace()
                continue
            }

            if (isDigit(this.current_char))
                return new Token(INT, this.integer())

            if (this.current_char == '+') {
                this.advance()
                return new Token(ADD, '+')
            }

            if (this.current_char == '-') {
                this.advance()
                return new Token(SUB, '-')
            }

            if (this.current_char == '*') {
                this.advance()
                return new Token(MUL, '*')
            }

            if (this.current_char == '/') {
                this.advance()
                return new Token(DIV, '/')
            }

            if (this.current_char == '(') {
                this.advance()
                return new Token(LPAREN, '(')
            }

            if (this.current_char == ')') {
                this.advance()
                return new Token(RPAREN, ')')
            }

            this.error()
        }

        return new Token(EOF, null)
    }
}

class Interpreter {
    constructor(lexer) {
        this.lexer = lexer
        this.current_token = this.lexer.get_next_token()
    }

    error() {
        throw Error('Invalid syntax')
    }

    /**
     * 将当前token与期望token类型作比较
     */
    eat(token_type) {
        if (this.current_token.type == token_type)
            this.current_token = this.lexer.get_next_token()
        else
            this.error()
    }
    
    /**
     * factor : INT | LPAREN expr RPAREN
     */
    factor() {
        var token = this.current_token
        
        if (token.type == INT) {
            this.eat(INT)
            return token.value
        }
        else if (token.type == LPAREN) {
            this.eat(LPAREN)
            var result = this.expr()
            this.eat(RPAREN)
            return result
        }
    }

    term() {
        // term   : factor ((MUL | DIV) factor)*
        
        var result = this.factor()

        while (this.current_token.type == MUL || 
               this.current_token.type == DIV) {
            var token = this.current_token

            if (token.type == MUL) {
                this.eat(MUL)
                result *= this.factor()
            }
            else if (token.type == DIV) {
                this.eat(DIV)
                result /= this.factor()
            }
        }

        return result
    }

    /**
     * expr   : term ((ADD | SUB) term)*
     * term   : factor ((MUL | DIV) factor)*
     * factor : INT | LPAREN expr RPAREN
     */
    expr() {
        // term
        var result = this.term()

        // ((ADD | SUB) term)*
        while (this.current_token.type == ADD || 
               this.current_token.type == SUB) {
            var token = this.current_token
            
            if (token.type == ADD) {
                this.eat(ADD)
                result += this.term()
            }
            else if (token.type == SUB) {
                this.eat(SUB)
                result -= this.term()
            }
        }

        return result
    }
}