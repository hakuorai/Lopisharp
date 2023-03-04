import { Parser, AST_TYPE } from './parser.js'
import { unaryOperation, binaryOperation } from './operation.js'

class Interpreter {
    /**
     * @param {Parser} parser 
     */
    constructor(parser) {
        this.parser = parser

        this.globals = {}
    }

    evaluate() {
        var tree = this.parser.parse()
        return this.visit(tree)
    }

    visit(node) {
        switch (node.nodetype) {
            case AST_TYPE.NULL:
                return
        
            case AST_TYPE.UNOP:
                var op = node.op.type
                return unaryOperation(op, this.visit(node.factor))
                
            case AST_TYPE.BINOP:
                var op = node.op.type
                return binaryOperation(op, this.visit(node.left), this.visit(node.right))

            /*
            case AST_TYPE.NUM:
                return node.value

            case AST_TYPE.STR:
                return node.value
            */

            case AST_TYPE.VAL:
                return node.value // Value at val.js

            case AST_TYPE.BLOCK:
                for (var i in node.children) {
                    this.visit(node.children[i])
                }                
                break;

            case AST_TYPE.ASSIGN:
                var varname = node.left.value
                this.globals[varname] = this.visit(node.right)
                break;

            case AST_TYPE.VAR:
                var varname = node.value
                var val = this.globals[varname]
                if (val != null)
                    return val
                else
                    throw Error(`Name '${varname}' is not defined`)                

            default:
                throw Error('Unknown node type')
        }
    }
}

export { Interpreter }