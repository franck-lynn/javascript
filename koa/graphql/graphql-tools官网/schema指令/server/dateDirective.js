import { getDirectives, MapperKind, mapSchema } from '@graphql-tools/utils';
import { defaultFieldResolver } from 'graphql'
import mement from 'moment'

// 日期转化指令
const dateDirective = (directiveName) => {
    return {
        [directiveName + "DirectiveTypeDefs"]: `directive @${directiveName} (format: String) on FIELD_DEFINITION`,
        [directiveName + "DirectiveTransformer"]: (schema) => mapSchema(schema, {
            [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
                const directives = getDirectives(schema, fieldConfig);
                const directiveArgumentMap = directives[directiveName];
                 console.log("格式化日期的字符串", directiveArgumentMap)
                if (directiveArgumentMap) {
                    const { resolve = defaultFieldResolver } = fieldConfig;
                    const { format } = directiveArgumentMap // 格式化日期的字符串
                    console.log("格式化日期的字符串", format)
                    fieldConfig.resolve = async function(source, args, context, info) {
                        const date = await resolve(source, args, context, info)
                        return mement(date).format(format)
                    }
                    return fieldConfig;
                }
            }
        })
    }
}

const { dateDirectiveTypeDefs, dateDirectiveTransformer } = dateDirective('date')

export { dateDirectiveTypeDefs, dateDirectiveTransformer }