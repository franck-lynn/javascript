
import { Book } from "../models/bookModel";

const resolvers = {
    Query: {
        books: async () => {
            const books = await Book.find()
            console.log("☺☺☺☺☺☺☺", books)
            return books
        }
    }
}

export { resolvers }