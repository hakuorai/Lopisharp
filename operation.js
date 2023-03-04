import { TOKEN_TYPE } from './token.js'
import { Value, BoolVal, NumberVal, StringVal } from './val.js'


/**
 * ------------一元操作------------
 */

/**
 * @param {Number} op 
 * @param {BoolVal} bool 
 */
function opBool(op, bool) {
    switch (op) {
        case TOKEN_TYPE.ADD:
            return bool

        case TOKEN_TYPE.SUB:
            return new BoolVal(!(bool.val))

        case TOKEN_TYPE.SHARP:
            return new NumberVal(bool.val)

        case TOKEN_TYPE.FLAT:
            return bool

        case TOKEN_TYPE.VBAR:
            return bool
    
        default:
            throw Error('Operation Error')
    }
}

/**
 * @param {Number} op 
 * @param {NumberVal} bool 
 */
function opNumber(op, number) {
    switch (op) {
        case TOKEN_TYPE.ADD:
            return number

        case TOKEN_TYPE.SUB:
            return new NumberVal(-number.val)
        
        case TOKEN_TYPE.SHARP:
            return new StringVal(number.val)

        case TOKEN_TYPE.FLAT:
            return new BoolVal(number.val)
            
        case TOKEN_TYPE.VBAR:
            return new NumberVal(Math.abs(number.val))
        
        default:
            throw Error('Operation Error')
    }
}

/**
 * @param {Number} op 
 * @param {StringVal} string 
 */
function opString(op, string) {
    switch (op) {
        case TOKEN_TYPE.ADD:
            return string

        case TOKEN_TYPE.SHARP:
            return string

        case TOKEN_TYPE.FLAT:
            return new NumberVal(string.val)

        case TOKEN_TYPE.VBAR:
            return new NumberVal(string.val.length)

        default:
            throw Error('Operation Error')
    }
}

const UNARY_MAP = [opBool, opNumber, opString]

/**
 * 一元操作
 * @param {Number} op 
 * @param {Value} val 
 */
function unaryOperation(op, val) {
    return UNARY_MAP[val.type-1](op, val)
}


/**
 * ------------二元操作------------
 */

const BINARY_MAP = 
[
    [boolOpBool, boolOpNumber, boolOpString],
    [numberOpBool, numberOpNumber, numberOpString],
    [stringOpBool, stringOpNumber, stringOpString]
]

/**
 * 二元操作
 * @param {Number} op 
 * @param {Value} left 
 * @param {Value} right 
 * @returns {Value}
 */
function binaryOperation(op, left, right) {
    let ltype = left.type
    let rtype = right.type
    return BINARY_MAP[ltype-1][rtype-1](left, op, right)
}

/**
 * @param {BoolVal} left 
 * @param {Number} op Token类型
 * @param {BoolVal} right 
 */
function boolOpBool(left, op, right) {
    switch (op) {
        case TOKEN_TYPE.ADD:
            return new BoolVal(left.val || right.val) 

        case TOKEN_TYPE.MUL:
            return new BoolVal(left.val && right.val)

        default:
            throw Error('Operation Error')
    }
}

/**
 * @param {BoolVal} left 
 * @param {Number} op Token类型
 * @param {NumberVal} right 
 */
function boolOpNumber(left, op, right) {
    
    left = new Number(left.val)
    return numberOpNumber(left, op, right)
}

/**
 * @param {BoolVal} left 
 * @param {Number} op Token类型
 * @param {StringVal} right 
 */
function boolOpString(left, op, right) {
    switch (op) {
        case TOKEN_TYPE.ADD:
            left = new StringVal(left.val)    
            return new StringVal(left.val + right.val)
        
        case TOKEN_TYPE.MUL:
            if (left.val)
                return right
            else
                return new StringVal('')

        default:
            throw Error('Operation Error')
    }
}

function numberOpBool(left, op, right) {
    right = new NumberVal(right.val)
    return numberOpNumber(left, op, right)
}

/**
 * @param {NumberVal} left 
 * @param {Number} op Token类型
 * @param {NumberVal} right 
 */
function numberOpNumber(left, op, right) {
    switch (op) {
        case TOKEN_TYPE.ADD:
            return new NumberVal(left.val + right.val)
        
        case TOKEN_TYPE.SUB:
            return new NumberVal(left.val - right.val)

        case TOKEN_TYPE.MUL:
            return new NumberVal(left.val * right.val)

        case TOKEN_TYPE.DIV:
            return new NumberVal(left.val / right.val)

        case TOKEN_TYPE.EXDIV:
            return new NumberVal(parseInt(left.val / right.val))

        case MOD:
            return new NumberVal(left.val % right.val)
    
        default:
            throw Error('Operation Error')
    }
}

/**
 * @param {NumberVal} left 
 * @param {Number} op Token类型
 * @param {StringVal} right 
 */
function numberOpString(left, op, right) {
    switch (op) {
        case TOKEN_TYPE.ADD:
            var strleft = new StringVal(left.val)
            return new StringVal(strleft.val + right.val)

        case TOKEN_TYPE.MUL:
            return new StringVal(right.val.repeat(left.val))
    
        default:
            throw Error('Operation Error')
    }
}

/**
 * @param {StringVal} left 
 * @param {Number} op Token类型
 * @param {BoolVal} right 
 */
function stringOpBool(left, op, right) {
    return boolOpString(right, op, left)
}

/**
 * @param {StringVal} left 
 * @param {Number} op Token类型
 * @param {NumberVal} right 
 */
function stringOpNumber(left, op, right) {
    if (op == TOKEN_TYPE.SUB) // left去掉末端right个字符
    {
        if (right.val > left.val.length)
            throw Error('Out of Index Error')
        
        let len = left.val.length - right.val
        return new StringVal(left.val.substr(0, len))
    }
    else
        return numberOpString(right, op, left)
}

/**
 * @param {StringVal} left 
 * @param {Number} op Token类型
 * @param {StringVal} right 
 */
function stringOpString(left, op, right) {
    switch (op) {
        case TOKEN_TYPE.ADD:
            return new StringVal(left.val + right.val)
    
        default:
            throw Error('Operation Error')
    }
}


export { unaryOperation, binaryOperation }