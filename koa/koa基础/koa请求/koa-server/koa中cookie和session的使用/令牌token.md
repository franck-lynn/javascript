令牌 token 
token string ===> header.payload.signature
1. 令牌组成, 用 . 号分割 , 实际都是 json 对象
   标头 header  头里保存的 当前类型和加密算法 默认 jwt {typ: jwt, alg:'HS256} , base64 进行的编码 ==> xxxx. 还可以解码回来 
   有效载荷 payload , 包含声明, 声明是有关实体(通常是用户)和其他类型的什么, 也是 base64 编码, 有效载荷里面不要放敏感信息
   {
       "sub": "123456",
       "name": "json Doe",
       "admin": true
   }
   签名 signature
   
   

















