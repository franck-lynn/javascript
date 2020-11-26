jwt 原理与实战
=============
### json web token

### 用户登录接口
    获取用户 post 过来的 username password
    const token
    
    校验 username === user, password === pwd
    return res = code, {error: '错误'}
    成功:
    生成一个随机字符串 token 
    return res = 给用户 token
    一份保存到数据库
    用户再发请求, 要带上 token
    再次校验
    需要登录
    验证token合法性 token 无效
### jwt 
    服务端会给用户 token, 服务端 不保存
    以后用户再来访问, 需要携带 token, 服务器获取 token, 通过算法进行校验
    不用在服务端进行保存, 与传统 token 相比, 无需在服务端保存, 不用查数据库  
### jwt 实现过程
    提交  username, password 由 jwt 创建 token, 由三段组成, .分割
    默认 hash256 算法
    第一段 字符串 HEADER, 内部包含算法/token类型
    json 转换成字符串, 然后做 base64 url 加密, 可以反解(base64先加密, + 用 _ 替代, )
    {
        "alg": "HS256",
        "typ": "JWT"
    }
    第二段 字符串, payload
    json 转换成字符串, 然后做 base64 url 加密, 可以反解(base64先加密, + 用 _ 替代, ) 
    
    第三段 字符串 
    第一步: 第一段, 第二段 密文拼接起来, 
    第二步: 对前两部分密文进行 HASH256 加密 + 加盐
    第三步: 对 hash256 加密后的密文再做 base64 URL 加密
    
    以后用户再来访问要携带 token, 后端 token 校验
    获取token
    1. 对token 通过.进行切割 成 3部分
    2. 对第二段 payload 进行 base url 进行解密 , 检测是否超时?     
    3. 把 第 1, 2 段 进行拼接, 再次 hash256 加密, (第三段不能反解) + 加盐
       密文 === 密文, 表示 token 未被修改过, 认证通过


https://github.com/koajs/jwt