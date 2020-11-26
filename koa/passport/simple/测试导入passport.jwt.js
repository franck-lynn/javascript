// const passport = require('koa-passport')
// const JwtStrategy = require('passport-jwt').Strategy
// const ExtractJwt = require('passport-jwt').ExtractJwt

import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "gamercode" // 数字签名，与生成token时的一样，不能告诉用户
}

console.log(opts)
