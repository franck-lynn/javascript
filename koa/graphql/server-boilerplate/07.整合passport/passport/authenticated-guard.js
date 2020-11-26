const isAuthenticated = () => next => (root, args, context, info) => {
    // console.log("04. 获取 apollo-server 中的上下文: ", context)
    if (!context.currentUser) {
        throw new Error(`Unauthenticated, 没有认证!`);
    }

    return next(root, args, context, info);
}
export { isAuthenticated }