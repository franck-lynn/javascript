koa 获取请求的方式: 
==================
1. 请求参数是冒号
     地址: http://localhost:3000/users/123
     路由: /user/:id
     解析: 解析处理 的是  id='123'


2. 请求字符串 ? 是请求字符串
     地址: http://localhost:3000/users?name=任盈盈&age=20
     路由: 只要定义 '/user' 就可以, 通过 ctx.query 可以进行解构


3. 请求体
     地址: /users 
     content-type=application/json
     参数: {'name': '赵敏', 'age': 20, sex: '女'}
     通过 post 提交, koa-body 解析