import bcrypt from 'bcrypt'

const password = "123"
;(async () => {
    const hashPassword = await bcrypt.hash(password, 10)
    console.log(hashPassword)
    
    // const decode = await bcrypt.compare(password, hashPassword)
    const decode = await bcrypt.compare(password, "$2b$12$r6A2gKo9SWPorvgMzm1nsu9J.3QYEkq0jQT/1oJehAU9QDvdHG5n6")
    console.log(decode)
})()

