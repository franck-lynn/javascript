import { model, Schema } from 'mongoose'
import { number } from 'vue-i18n'

const stockModel = new Schema({
    name: {type: String, require: true},
    catalog_number: {type: String, require: true},
    stock: {type: number, default: 0}
})

const Stock = model('Stock', stockModel)

export default Stock