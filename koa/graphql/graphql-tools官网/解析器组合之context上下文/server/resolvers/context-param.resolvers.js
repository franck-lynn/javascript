// https://www.apollographql.com/docs/apollo-server/security/authentication/
const users = [
    { id: '1', name: '杨钰莹' },
    { id: '2', name: '周芷若' }
];

// Hardcoded data store
const libraries = [
    { branch: 'downtown' },
    { branch: 'riverside' },
]
const books = [
    { title: 'The Awakening', author: 'Kate Chopin', branch: 'riverside' },
    { title: 'City of Glass', author: 'Paul Auster', branch: 'downtown' },
];

const loginSimpleResolvers = {
    Query: {
        numberSix() {
            return 6
        },
        numberSeven() {
            return 7
        },
        user(parent, args, context, info) {
            return users.find(user => user.id === args.id)
        },
        libraries(parent, args, context, info) {
            console.log("context上下文", context.authScope)
            return libraries
        }
    },
    Library: {
        books(parent){
            return books.filter(book => book.branch === parent.branch)
        }
    },
    Book: {
        author(parent) {
            return { name: parent.author }
        }
    }
}
export default loginSimpleResolvers