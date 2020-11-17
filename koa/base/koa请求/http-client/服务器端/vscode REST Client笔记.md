vscode REST Client笔记
========================
### 项目主页
    https://github.com/Huachao/vscode-restclient

### Content-Type 是什么?
    链接：https://segmentfault.com/a/1190000022331737
    Content-Type 实体头部用于指示资源的MIME类型 media type
    Content-Type的句法示例：

    Content-Type: text/html; charset=utf-8
    Content-Type: multipart/form-data; boundary=something










### 请求字符串
    GET http://localhost:3000/comments?page=2&pageSize=10
    
    请求分析: 
    url: http://localhost:3000/comments?page=2&pageSize=10
    请求方法: GET
    
    响应的内容:
    HTTP/1.1 200 OK
    Content-Type: application/json; charset=utf-8
    Content-Length: 28
    Date: Fri, 03 Jul 2020 05:11:00 GMT
    Connection: close

    {
      "page": "2",
      "pageSize": "10"
    }

    打印的内容: 
    [Object: null prototype] { page: '2', pageSize: '10' }
    请求参数返回的是一个对象, 可以通过解构赋值的方式 析构出来

### 请求头 Request Headers






### multipart/form-data
    https://www.imooc.com/article/271663
    一、关于multipart/form-data
    文件上传本质上是一个POST请求。只不过请求头以及请求内容遵循一定的规则（协议）

    请求头（Request Headers）中需要设置 Content-Type 为 multipart/form-data; boundary=${boundary}。其中${boundary}分割线，需要在代码中替换，且尽量复杂，不易重复

    请求正文（Request Body）需要使用在 Header中设置的 ${boundary}来分割当前正文中的FormItem，内容格式如下

https://www.w3cschool.cn/vscodesoup/vscodesoup-b8ju3012.html




自定义请求变量
=============
### http 请求的文件说明
    ### 登录请求
    # 命名这个登录请求
    # @name login # 给这个请求 login 取一个名字
    POST {{url}}/login HTTP/1.1
    {{json}}

    {
        "username": "zs",
        "email": "zj@163.com",
        "password": "123"
    }

    ### 个人信息
    # 获取上面请求返回的数据
    # 用 {{}} 获取上面请求的返回值
    # 在服务器中, ctx.body 里返回了 token, 所以从上次的的response body 里会找到这个 token
    @token = {{login.response.body.token}} 
    GET {{url}}/profile HTTP/1.1
    Authorization: Bearer {{token}}
    Content-Type: application/json

### 附 http 请求的文件: 
```
### 登录请求
# 命名这个登录请求
# @name login
POST {{url}}/login HTTP/1.1
{{json}}

{
    "username": "zs",
    "email": "zj@163.com",
    "password": "123"
}

### 个人信息
# 获取上面请求返回的数据
@token = {{login.response.body.token}}
GET {{url}}/profile HTTP/1.1
Authorization: Bearer {{token}}
Content-Type: application/json
```


