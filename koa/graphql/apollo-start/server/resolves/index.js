const books = [{
        title: 'Harry Potter and the Chamber of Secrets',
        author: 'J.K. Rowling',
    },
    {
        title: 'Jurassic Park',
        author: 'Michael Crichton',
    },
];
const resolvers = {
    Query: {
        books: () => {
            // console.log("参数执行", books)
            return books
        }
    }
}

export {resolvers}
