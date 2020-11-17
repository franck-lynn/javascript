/*
https://blog.csdn.net/boweiqiang/article/details/105774631
jwt的签名算法JWT 的签名算法有三种：
1. 对称加密HMAC【 哈希消息验证码】 HS256 / HS384 / HS512
2. 非对称加密RSASSA【 RSA签名算法】 RS256 / RS384 / RS512
3. ECDSA【 椭圆曲线数据签名算法】 ES256 / ES384 / ES512， RSA签名
这里实验的是RSA签名算法验签的过程， 不包括加签的过程
*/
// GPG入门教程
// http://www.ruanyifeng.com/blog/2013/07/gpg.html
import {Base64} from 'js-base64'
import jwt from 'jsonwebtoken'

const jwtToken = 'eyJhbGciOiJSUzI1NiJ9.eyJvcGVyYXRpb25Vc2VySWQiOiJlZTgzMjYyYThkNGIxMWU3YTdiMzZjOTJiZjMxNjA3YiIsInBob25lIjoiMTU3NTcxNjA1MzEiLCJsb2dpbk5hbWUiOiIxNTc1NzE2MDUzMSIsIm5hbWUiOiLmtYvor5XmlLkxIiwiZXhwIjoxNTg3NzA5OTY3LCJyb2xlTmFtZXMiOiJjY-i_kOiQpeS6uuWRmCzku5PnrqHlkZgs5ZWG5ZOB566h55CG5ZGYLOacuuaehOi0n-i0o-S6uizmtYvor5XlkZgs57O757uf566h55CG5ZGYLOiuouWNleeuoeeQhizotYTmlpnnrqHnkIblkZgifQ.Ugzrowz1TD38IK5yuHAxoCURGxByBm0Ep9JtvitijhFw3MGqooaRDxKIOUk6aAFVuV6zfpY7y23oCk3-KsBvVR1oVLIAWSxiRJlVs-sne2vTEplH2xuzQv2N1HuAGvrbYlhMu2rIqitP7D5xQjVruBTmalO9TZUgsc8ONIMBZH4'
// 分割 token
const jwtTokenParts = jwtToken.split('.')
const header = jwtTokenParts[0]
const payload = jwtTokenParts[1]
const signature = jwtTokenParts[2]

// base64 解码
console.log("解码 header --> ", Base64.decode(header))
console.log("解码 payload --> ", Base64.decode(payload))
// 不是 Base64 编码, 解码不出来
// console.log("解码 signature --> ", Base64.decode(signature))
// console.log("jwt.decode() 方法也不行. ", jwt.decode(signature))
// console.log("只能解码出第1, 2部分, 第3部分签名解不出的. ", jwt.decode(jwtToken))


