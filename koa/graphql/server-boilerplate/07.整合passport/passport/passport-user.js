import { User } from '../model/user'

// const getUserByName = async (username) => {
//     return await User.findOne({ username })
// }

const getUserByEmail = async( email) => {
    return await User.findOne({email})
}
// const getUserById = async (id) => {
//     return await User.findById(id)
// }

export { getUserByEmail }