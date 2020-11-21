const authResolver = {
    Query: {
        greetingWithAuth: async (root, args, context) => {
            // 查询上下文中的 user, context.user 是否为 null
            const user = ''
            if(!user) {
                throw new Error('没有认证 unauthentication')
            }
            return "欢迎光临" + user.name
        }
    }
}

export default authResolver