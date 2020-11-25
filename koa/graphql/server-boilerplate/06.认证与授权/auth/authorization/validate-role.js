const validateRole = (role) => (next) => (root, args, context, info) => {
    if (context.currentUser.role !== role) {
        throw new Error(`Unauthorized, 没有授权!`);
    }

    return next(root, args, context, info);
}
export { validateRole }