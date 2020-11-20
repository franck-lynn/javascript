// 自定义decimal 类型
import Decimal from 'decimal.js'
import { Kind, GraphQLScalarType } from 'graphql'

const DecimalType = new GraphQLScalarType({
    name: 'DecimalType',
    description: '自定义的decimal类型',
    // value 设定为 Decimal 类型, 转化成数字类型给客户端使用, 这里是数据里的 decimal128 类型
    serialize: value => value.toString(),
    parseValue: (value) => {
        // 解析函数, 用于将客户端通过 variables 参数传递的数据为 Decimal 类型
        if (typeof value === 'string' || typeof value === 'number') {
            return new Decimal(value)
        }
        throw new Error('DecimalType报: 不能转化为Decimal类型')
    },
    parseLiteral: (ast) => {
        // 解析函数, 将客户端传递的字面量参数解析为 Decimal 类型
        if (ast.kind === Kind.STRING || ast.kind === Kind.INT || ast.kind === Kind.FLOAT) {
            return new Decimal(ast.value)
        }
        return null
    }
})
export { DecimalType }