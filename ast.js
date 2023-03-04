const AST_TYPE = {
    NULL: 0,
    UNOP: 1,
    BINOP: 2,
    VAL: 4,
    BLOCK: 5,
    ASSIGN: 6,
    VAR: 7,
}


class AST 
{}

class NullOp extends AST 
{
    constructor() {
        super()

        this.nodetype = AST_TYPE.NULL
    }
}

/**
 * 一元操作符
 */
class UnOp extends AST {
    constructor(op, factor) {
        super()

        this.nodetype = AST_TYPE.UNOP

        this.token = op
        this.op = op
        this.factor = factor
    }
}

/**
 * 二元操作符
 */
class BinOp extends AST {
    constructor(left, op, right) {
        super()
        
        this.nodetype = AST_TYPE.BINOP

        this.left = left
        this.token = op
        this.op = op
        this.right = right
    }
}

/**
 * 值量
 */
class Val extends AST {
    /**
     * Make sure value is Value from val.js
     */
    constructor(token, value) {
        super()

        this.nodetype = AST_TYPE.VAL

        this.token = token
        this.value = value        
    }
}

/**
 * 代码块
 */
class Block extends AST {
    constructor() {
        super()

        this.nodetype = AST_TYPE.BLOCK

        this.children = []
    }
}

/**
 * 赋值号
 */
class Assign extends AST {
    constructor(left, op, right) {
        super()

        this.nodetype = AST_TYPE.ASSIGN

        this.left = left
        this.token = op
        this.op = op
        this.right = right
    }
}

/**
 * 变量
 */
class Var extends AST {
    constructor(token) {
        super()

        this.nodetype = AST_TYPE.VAR
        
        this.token = token
        this.value = token.value
    }
}

export {AST_TYPE, NullOp, UnOp, BinOp, Val, Block, Assign, Var}