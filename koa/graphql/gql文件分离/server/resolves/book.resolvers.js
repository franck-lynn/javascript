// const books = [{
//         title: 'Harry Potter and the Chamber of Secrets',
//         author: 'J.K. Rowling',
//     },
//     {
//         title: 'Jurassic Park',
//         author: 'Michael Crichton',
//     },
// ];

import { Book } from "../model/bookModel";

const bookQuery = {
    Query: {
        books: async () => {
            const books = await Book.find()
            return books
        }
    }
}
export default bookQuery