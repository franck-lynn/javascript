passport 最小样例总结
=====================
## 步骤
### 1. 先要配置策略
     配置策略调用的函数是: passport.use()
     所谓策略, 就是从客户端或者session 中拿到 username 和 password, 与数据库中保存的用户名和密码进行比较, 
     比较后就调用 done 函数, done 是 策略自己配置的.
     passport.use(new LocalStrategy(
         // 第一个参数是指定 验证的域, 比如说 默认用username, 也可以设置成 email
         // usernameField: email,
         // 密码域默认的是 password, 也可以设置成:
         // passwordField: passwd
         {}, 
         // 第2个参数是函数, 这个函数有 3 个参数, 分别是 username, password, done
         // 这里的逻辑是 : username 和 password 是客户端传过来的, 或者是 session 里拿的, 
         // 再以 username 为条件, 在数据库里找对应的 username 和 password, 找到了, 说明验证是成功的
         // 没有找到, 说明验证失败, 两者都会调用 回调函数 done, done 是 passport 布置的一个回调函数.
         // 处理的内容有: 
         // return done(null, user) // 表明验证通过, 
         // return done(null, false, {message: 'incorrect password.'}) // message 是可选的, 给客户端一个友好提示
         // return done(err) // 最后, 如果有异常, 例如, 数据库不能使用, 还要处理下这个异常.
     ))
    
### 设置session
     // 如果要用到session, session 应该在 passport.initialize()之前调用
     app.keys = ['super-secret-key']
     app.use(session(app))
     app.use(passport.initialize())
     //! 带上session
     app.use(passport.session())

### Authenticate 验证
    验证请求调用的是 passport.authenticate() 函数, 
    一般的调用形式为:
    router.post('/login', async ctx => {
        //!!! 这里要加上 return
        return await passport.authenticate('local',  (err, user, info, status) => {
            // 这是一个立即执行函数.
            if(user) {
                ctx.login(user)
                ctx.redirect('/auth/status')
            }else{
                ctx.status = 400
                ctx.body = {status: 'error'}
            }
        })(ctx)
    })
    authenticate() 函数 
    第1个参数是 指定 哪个策略.
    第2个参数 是 options, 包括 
        session: Boolean, 
        successRedirect: String, 
        failureFlash: Boolean, 
        failureRedirect: String,
        successlash: String
    第3个参数是 callback, 当使用自定义的callback时, 验证之后建立session和发出响应都由这个 callback 做, 
    也就是变成了第2个参数
    
    passport 增加的方法
    ctx.login() 
    ctx.login(user, options, callback) 方法可以为登录用户进行初始化session, 例如, 可以设置{session: false}, 默认为true
    ctx.logout() // 不带参数
    ctx.isAuthenticated() // 不带参数, 作用是 测试该用户是否存在于 session 中, 即是否已经登录了,如已登录, 返回为 true, 否则, false
                          // 这个方法会更常用一些, 毕竟session 通常会保留一段时间, 在此期间, 判断用户是否已经登录就用这个方法就可以了
    isUnauthenticated()：不带参数。和上面的作用相反.
    
    ctx.redirect()
    
### 序列化和反序列化
    序列化和反序列化都只有在登录成功才进行的操作. 是针对 session 进行操作. 对session 进行加密
    
    passport.serializeUser()
    // 这里的 user 是数据库里找到的对应的 user, 把对应的 user.id 
    // 进行 base64 加密, 作为 koa.sess.sig 签名.
    passport.serializeUser((user, done) => done(null, user.id))
    
    passport.desserializeUser()
    // 前面序列化时用到的时 user.id, 所以, 反序列化就 用这个id作为参数,
    // 经过反序列化操作, 这个 id 变成了明文.
    // 拿着 这个id 到 session 里找, 找到了, 就说明已经登录了, 直接运行用户登录, 
    // done 函数是序列化和反序列化都布置的回调函数
    passport.desserializeUser((id, done) => done(null, getUserById(id)))

### 问题
    这个 getUserById() 是什么时候传的?   
<hr>
<hr>

### 附录: 
### 新建 server.js 文件, 做为 提供服务的服务器
```
// https://www.w3cschool.cn/passport_js_note/xiysfozt.html
import path from 'path'
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-body'
import passport from 'koa-passport'
import { Strategy as LocalStrategy } from 'passport-local'
import koaStatic from 'koa-static'
import session from 'koa-session'
import views from 'koa-views'

const app = new Koa()
const router = new Router()

// body parser, 解析 post 请求
app.use(bodyParser());


// 加载views, render 方法
app.use(views(path.join(__dirname), { map: { html: 'ejs' } }))

const users = { id: 1, username: 'zs', password: '123', mobile: 123456789 }
const fetchUser = (() => {
    const user = users
    return async () => {
        return user;
    }
})()
// 配置策略
passport.use(
    new LocalStrategy(
        // 第1个参数选型的设定
        // 第2个参数是验证函数
        (username, password, done) => {
            // console.log(`03, 客户端的数据: username = ${username}--- password=${password} ---  ${done}`)
            // 从数据库中查找 username, 
            const user = users
            if (username === user.username && password === user.password) {
                return done(null, user)
            }else{
                return done(null, false, { message: '用户名或密码不匹配' })
            }
        }
    )
)
/*
手动解码
{ "passport": { "user": { "username": "zs", "password": "123" } }, "_expire": 1592963002336, "_maxAge": 86400000 }
koa.sess.sig  -session前面
koa.session -session
用id进行序列化的结果
04, 序列化-- - > user = { "id": 1, "username": "zs", "password": "123" }-- - function serialized(e, o) {
    pass(i + 1, e, o);
}--userID = 1
*/
passport.serializeUser((user, done) => {
    console.log(`04, 序列化 ---> user = ${JSON.stringify(user)} --- ${done} --userID = ${user.mobile}`)
    // 只有登录 成功时才进行序列化和反序列化的操作, 是将数据库 中找到的 user 进行序列化
    done(null, user.id)
})
passport.deserializeUser((id, done) => {
    console.log("05, 反序列化 ---> ", id, done.toString())
    // 反序列化也是在登录成功时才进行的操作, 反序列化是拿序列化时的 键 去数据库里找 user, 找到说明操作成功, 
    // 只是这个键 是进行加密的
    const user = fetchUser()
    done(null, user)
})

// 设置session
app.keys = ['super-secret-key']
app.use(session(app))

app.use(passport.initialize())
//! 带上session
app.use(passport.session())


router.get('/success', async ctx => {
    await ctx.render('success.html')
})
router.get('/fail', async ctx => {
    await ctx.render('fail.html')
})
router.get('/login', async ctx => await ctx.render('local本地验证带session-测试.html'))

// 初始化完成, 现在可以进行验证了
router.post('/login', async (ctx, next) => {
    // console.log(ctx.request.body)
    // 自定义 回调函数
    return await passport.authenticate('local', (err, user /* , info */ ) => {
        // console.log("得到了 user", user)
        if (err) {
            // console.log("01, 出现了错误 ---> ", err)
            return next(err)
        }
        if (!user) {
            console.log('没有权限')
            return ctx.redirect('/login');
        }
        // console.log("通过验证!----")
        // ctx.redirect('/success')
        ctx.login(user)
        ctx.redirect('/success')
    })(ctx, next)
})
app.use(router.routes())
app.use(router.allowedMethods())


// 在这个目录下的文件都可以通过服务器对外提供服务, 前端项目也会使用这个html文件, 是做为浏览器的入口文件
app.use(koaStatic(path.join(__dirname), {
    // https://www.npmjs.com/package/koa-static
    // 配置一些选项 index: '默认起始文件.html'
    // http://localhost:3000/index.html 通过这个网址可以访问
    index: 'local本地验证带session-测试.html'
}))

app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000")
})

```
### 测试用例
```
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>local本地验证带session-测试</title>
</head>
<body>
    <h1>本地验证带session-测试</h1>
    <form action="/login" method="post">
        <input type="text" name="username" id="username" class="username" value="zs"><br>
        <input type="text" name="password" id="password" class="password" value="123"><br>
        <button type="submit">提交表单</button>
    </form>
</body>
</html>
```