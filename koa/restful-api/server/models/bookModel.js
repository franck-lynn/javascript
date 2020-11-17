import { model, Schema } from 'mongoose'

const bookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String }

})

const M = '常量'
const Book = model('Book', bookSchema)

export {  Book, M}