# Lopisharp

## 前言

从0开始实现面向对象编程语言

实现参考 [Let’s Build A Simple Interpreter - Ruslan's Blog](https://ruslanspivak.com/lsbasi-part1/) ，强烈推荐该系列教程


## 使用

[点此在浏览器中体验](https://hakuorai.github.io/lopisharp/index.html)


## TODO

...

## 语法

### 1. Hello World

任何Lopisharp代码必须被包含在一对大括号中
```
{}
```

Lopisharp当前版本不内置输入输出，请通过操作全局变量实现
```
{
    a = 'Hello World!'
}
```
执行后的全局变量表：
|Name| Type |   Value   |
|----|------|-----------|
| a  |string|Hello World|


### 2. 基本类型与类型的阶

Lopisharp使用**bool**，**number**和**string**共3种基本类型，以下展示了3种通过字面量赋值方法：
```
{
    myBool   = _1
    myNumber = 3.14
    myString = 'Hello World!'
}
```
执行后的全局变量表：
|Name      | Type |   Value   |
|----------|------|-----------|
|myBool    |bool  |true       |
|myNumber  |number|3.14       |
|myString  |string|Hello World|

你可能注意到 **bool** 赋值的方法有些特别，这是因为 `myBool = _1` 实际上是对 **number** 类型的 `1` 进行了 `_` 运算，而这个运算将 **number** 类型的 **1** *降阶* 为 **bool** 类型的 **true**。

之所以这样做，是因为 **Lopisharp 的设计理念是不用任何关键字**。这同样意味着以下操作是可行的：
```
{
    true = _1
    false = _0
    
    boola = true
    boolb = false
}
```

在此进一步介绍**阶**的概念，3种基本类型的阶如下：
|Type  |Order|
|----  |-----|
|bool  |1    |
|number|2    |
|string|3    |

对值使用升阶运算符 `#` 将使其转换为高1阶的类型，而使用降阶运算符 `_` 将使其转换为低1阶的类型。如果更高/低阶的类型不存在，该值将保持原样。

```
{
    myString    = '3.14'
    myNumber    = _myString
    myBool      = _myNumber
    flatBool    = _myBool

    sharpBool   = #myBool
    sharpNumber = #myNumber
    sharpString = #myString
}
```
|Name|Type|Value|
|----|----|-----|
|myString|string|3.14|
|myNumber|number|3.14|
|myBool|bool|true|
|floatBool|bool|true|
|sharpBool|number|1|
|sharpNumber|string|3.14|
|sharpString|string|3.14|

由于只有3种基本类型，可使用 `##` 前缀实现任意类型转字符串：
```
{
    pi = ##3.14
}
```
|Name|Type|Value|
|----|----|-----|
|pi|string|3.14|


### 3. 特色运算

Lopisharp 的运算符使用方法和功能与主流语言大同小异，这里介绍一些本语言特色。

#### 3.1 string * number
返回 *string* 重复 *number* 次的结果。可左右交换。
```
{
    a = 'kira'
    b = a * 2
}
```
|Name|Type|Value|
|----|----|-----|
|a|string|kira|
|b|string|kirakira|

#### 3.2 string - number
返回 *string* 从末端开始删去 *number* 个字符的结果。不可左右交换。
```
{
    a = 'kirameki'
    b = a - 4
}
```
|Name|Type|Value|
|----|----|-----|
|a|string|kirameki|
|b|string|kira|

#### 3.3 |( 表达式 )|
求 *表达式* 的绝对值。对于 **string** ，返回其长度。
```
{
    num = |( -2 )|
    len = |( 'kira'*num )|
}
```
|Name|Type|Value|
|----|----|-----|
|num|number|2|
|len|number|8|