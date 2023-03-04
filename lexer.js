import { Token, TOKEN_TYPE, isSpace, isDigit, isAlpha, isAlNum } from './token.js'


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
     * 不移动索引的情况下返回下一个字符
     */
    peek() {
        var peek_pos = this.pos + 1
        if (peek_pos >= this.text.length)
            return null
        else
            return this.text[peek_pos]
    }

    /**
     * 从当前字符开始解析为实数
     */
    number() {
        var intpart = ''
        var fracpart = ''
        var hasdot = false

        while (isDigit(this.current_char)) {
            intpart += this.current_char
            this.advance()
        }
        if (this.current_char == '.') {
            hasdot = true
            this.advance()
            
            while (isDigit(this.current_char)) {
                fracpart += this.current_char
                this.advance()
            }
        }

        if (hasdot)
            return parseFloat(intpart + '.' + fracpart)
        else
            return parseInt(intpart)
    }

    /**
     * 从当前字符开始解析为字符串
     */
    string() {
        var result = ''
        while (this.current_char != '\'') {
            result += this.current_char
            this.advance()
        }
        this.advance()
        return result
    }

    /**
     * 从当前字符开始解析为变量名
     */
    id() {
        var result = ''
        while (isAlNum(this.current_char)) {
            result += this.current_char
            this.advance()
        }

        return new Token(TOKEN_TYPE.ID, result)
    }

    /**
     * 获取下一个Token
     * TODO: 改为switch语句
     */
    get_next_token() {
        while (this.current_char != null) {

            if (isSpace(this.current_char)) {
                this.skip_whitespace()
                continue
            }

            if (isDigit(this.current_char))
                return new Token(TOKEN_TYPE.NUM, this.number())

            if (this.current_char == "'") {
                this.advance()
                return new Token(TOKEN_TYPE.STR, this.string())
            }

            if (this.current_char == '+') {
                this.advance()
                return new Token(TOKEN_TYPE.ADD, '+')
            }

            if (this.current_char == '-') {
                this.advance()
                return new Token(TOKEN_TYPE.SUB, '-')
            }

            if (this.current_char == '*') {
                this.advance()
                return new Token(TOKEN_TYPE.MUL, '*')
            }

            if (this.current_char == '/' && this.peek() == '/') {
                this.advance()
                this.advance()
                return new Token(TOKEN_TYPE.EXDIV, '//')
            }

            if (this.current_char == '/') {
                this.advance()
                return new Token(TOKEN_TYPE.DIV, '/')
            }

            if (this.current_char == '%') {
                this.advance()
                return new Token(TOKEN_TYPE.MOD, '%')
            }

            if (this.current_char == '#') {
                this.advance()
                return new Token(TOKEN_TYPE.SHARP, '#')
            }

            if (this.current_char == '_') {
                this.advance()
                return new Token(TOKEN_TYPE.FLAT, '_')
            }

            if (this.current_char == '|') {
                this.advance()
                return new Token(TOKEN_TYPE.VBAR, '|')
            }

            if (this.current_char == '(') {
                this.advance()
                return new Token(TOKEN_TYPE.LPAREN, '(')
            }

            if (this.current_char == ')') {
                this.advance()
                return new Token(TOKEN_TYPE.RPAREN, ')')
            }

            if (isAlpha(this.current_char)) {
                return this.id()
            }

            if (this.current_char == '{') {
                this.advance()
                return new Token(TOKEN_TYPE.LBRACE, '{')
            }

            if (this.current_char == '}') {
                this.advance()
                return new Token(TOKEN_TYPE.RBRACE, '}')
            }

            if (this.current_char == '=') {
                this.advance()
                return new Token(TOKEN_TYPE.ASSIGN, '=')
            }

            if (this.current_char == '\n') {
                this.advance()
                return new Token(TOKEN_TYPE.ENDL, '\n')
            }

            this.error()
        }

        return new Token(TOKEN_TYPE.EOF, null)
    }
}

export { Lexer, TOKEN_TYPE }