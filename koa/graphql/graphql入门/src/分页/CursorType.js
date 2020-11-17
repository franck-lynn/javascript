import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import { Base64 } from 'js-base64'

const Cursor = new GraphQLScalarType({
    name: 'Cursor',
    description: 'Cursor 游标类型',
    // 序列化
    serialize: value => Base64.encode(value),
    // 校验与解析 variables 的参数
    parseValue: value => Base64.decode(value),
    // 校验与解析 query 的参数
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return Base64.decode(ast.value)
        } else {
            return null;
        }
    },
})

export default Cursor


/*
// 自定义类型 Cursor
// 自定义类型 Cursor 用的函数
const toCursor = ({ value }) => Base64.encode(value)
const fromCursor = str => {
    const value = Base64.decode(str)
    if (value) return { value }
    else return null
}
// 自定义类型 Cursor
new GraphQLScalarType({
    name: 'Cursor',
    serialize: (value) => {
        if (value.value) return toCursor(value)
        else return null
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return fromCursor(ast.value);
        } else {
            return null;
        }
    },
    parseValue: (value) => fromCursor(value)
})


// 根据 id 限制查询
const limitQueryWithId = (query, before, after, order) => {
    const filter = { _id: {} }
    if (before) {
        const op = order === 1 ? '$lt' : '$gt'
        filter._id[op] = ObjectId(before.value)
    }
    if (after) {
        const op = order === 1 ? '$gt' : '$lt'
        filter._id[op] = ObjectId(after.value)
    }
    return query.find(filter).sort([
        ['_id', order]
    ])
}

*/