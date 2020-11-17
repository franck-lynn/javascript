import { model, Schema } from 'mongoose'

const bookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String }
})

const Book = model('Book', bookSchema)

export { Book }