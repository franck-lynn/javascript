import { getDirectives, MapperKind, mapSchema } from '@graphql-tools/utils';
import { defaultFieldResolver } from 'graphql'

// 自定义指令的函数, 输入自定义指令的名称 和回调函数
// 返回自定义指令的类型, schema
const directive = (directiveName, callback) => {
    return {
        [directiveName + "DirectiveTypeDefs"]: `directive @${directiveName} on FIELD_DEFINITION`,
        [directiveName + "DirectiveTransformer"]: (schema) => mapSchema(schema, {
            [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
                const directives = getDirectives(schema, fieldConfig);
                if (directives[directiveName]) {
                    const { resolve = defaultFieldResolver } = fieldConfig;
                    fieldConfig.resolve = async function(source, args, context, info) {
                        const result = await resolve(source, args, context, info);
                        if (callback && typeof result === 'string') {
                            // return result.toUpperCase();
                            return callback(result)
                        }
                        return result;
                    }
                    return fieldConfig;
                }
            }
        })
    }
}

const { upperDirectiveTypeDefs, upperDirectiveTransformer } = directive('upper', str => str.toUpperCase())
const { upperCaseDirectiveTypeDefs, upperCaseDirectiveTransformer } = directive('upperCase', str => str.toUpperCase())



export {
    upperDirectiveTypeDefs,
    upperDirectiveTransformer,
    upperCaseDirectiveTypeDefs,
    upperCaseDirectiveTransformer
}