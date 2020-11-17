import path from 'path'
import dotenv from 'dotenv'
const result = dotenv.config({ path: path.resolve('.env') })
console.log("获取的环境变量---> ", result.parsed.TOKEN)