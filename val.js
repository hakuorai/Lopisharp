const TYPE = {
    NULL: 0,
    BOOL: 1,
    NUMBER: 2,
    STRING: 3
}

const TYPE_NAME = {
    [TYPE.NULL]: 'null',
    [TYPE.BOOL]: 'bool',
    [TYPE.NUMBER]: 'number',
    [TYPE.STRING]: 'string'
}

class Value {
    constructor(type, val) {
        this.type = type
        this.val = val
    }
}

class BoolVal extends Value {
    constructor(val) {
        super(TYPE.BOOL, Boolean(val))
    }
}

class NumberVal extends Value {
    constructor(val) {
        super(TYPE.NUMBER, Number(val))
    }
}

class StringVal extends Value {
    constructor(val) {
        super(TYPE.STRING, String(val))
    }
}

/**
 * 返回类型阶数
 * @param {Value} value 
 */
function getOrder(value) {
    return value.type
}


export {TYPE, TYPE_NAME, Value, BoolVal, NumberVal, StringVal}