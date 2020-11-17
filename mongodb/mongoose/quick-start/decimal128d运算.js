import { Decimal128 } from 'mongodb'
import { Decimal } from 'decimal.js';
// https://blog.csdn.net/qi_dabin/article/details/84564446
// https://www.jianshu.com/p/37829c87faa9
const a = Decimal128.fromString('0.1')
const b = Decimal128.fromString('0.2')
// https://mongodb.github.io/node-mongodb-native/3.6/api/Decimal128.html
// 参数要是一个 buffer
// const c = new Decimal128(2)

// console.log("a = ", a, ", b = ", b, ", c = ", c)
const x = new Decimal(a.toString())
const y = new Decimal(b.toString())
// const z = new Decimal(c.toString())
// console.log(z)
console.log(x.plus(y))
// console.log(x.plus(z))
console.log(0.1 + 0.2)