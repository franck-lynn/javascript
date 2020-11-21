graphql 重构笔记
===============
* 重构的原则是文件分离, 按照功能进行分文件夹存放  
  
1. 新建 app.js, 示例中的名称是 event-booking-app.js
2. @graphql-tools/schema 里有一个 makeExcutableSchema() 生成可执行的schema 方法,
   需要 typeDefs 和 resolvers 属性.
   通过路由中间件注册到 app
3. typeDefs 和 resolves 就是 graphql 的总入口
4. 通过自动读取文件 生成 合并后的 typeDefs 和 resolves. 
   需要注意的是 , resolvers 里面单个的 xx.resolvers.js 文件导出要 export default xx, 因为
   export {} 其返回的是一个对象, 包了一层, 在 index.js 文件里用会报错

















































