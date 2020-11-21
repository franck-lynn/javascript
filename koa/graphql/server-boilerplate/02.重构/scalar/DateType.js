import { GraphQLScalarType } from "graphql";
import { Kind } from 'graphql/language'
import moment from 'moment'

const DateType = new GraphQLScalarType({
    name: 'DateType',
    description: '自定义的日期类型',
    // serialize: (value) => value.toString(), // 序列化函数, 用于将结果转换成适合 http 传输的数据类型
    serialize: (value) => {
        return moment(value).format("YYYY-MM-DD")
    }, 
    parseValue: (value) => { // 解析函数, 用于将客户端通过 variables 参数传递的数据为 Date 类型
        if (typeof value === 'string') {
            return new Date(value)
        }
        throw new Error('参数类型错误')
    },
    // 配置中的 parseValue, parseLiteral 都用于解析客户端参数, 分别处理两种参数传递的方式
    parseLiteral: (ast) => { // 解析函数, 将客户端传递的字面量参数解析为Date 类型
        if (ast.kind === Kind.STRING || ast.kind === Kind.Int) {
            return new Date(ast.value)
        }
        return null;
    }
})

export { DateType }