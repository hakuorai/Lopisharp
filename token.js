const TOKEN_TYPE = {
    EOF: -1,
    NUM: 0,
    STR: 1,
    ADD: 2,
    SUB: 3,
    MUL: 4,
    DIV: 5,
    EXDIV: 6,
    MOD: 7,
    LPAREN: 8,
    RPAREN: 9,
    LBRACE: 10,
    RBRACE: 11,
    ASSIGN: 12,
    ID: 13,
    ENDL: 14,
    SHARP: 15,
    FLAT: 16,
    VBAR: 17,
    LABS: 18,
    RABS: 19,
    LLOOP: 20,
    RLOOP: 21
}


function isSpace(c) {
    return c == ' ' || c == '\t' || c == '\r'
}

function isDigit(c) {
    return c >= '0' && c <= '9'
}

function isAlpha(c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
}

function isAlNum(c) {
    return isAlpha(c) || isDigit(c)
}

class Token {
    constructor(type, value) {
        this.type = type
        this.value = value
    }
}

export { Token, TOKEN_TYPE, isSpace, isDigit, isAlpha, isAlNum }