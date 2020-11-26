import Koa from 'koa'
const app = new Koa()

app.use(ctx => {
	const url = ctx.req.url
	if(url === '/setcookie'){
		ctx.cookies.set('user', 'vip')
		ctx.body = 'cookie 设置完毕!'
	}else{
		ctx.body = ctx.cookies.get('user')
	}
	
})

app.listen(3000, () => console.log("服务器运行在 http://localhost:3000"))