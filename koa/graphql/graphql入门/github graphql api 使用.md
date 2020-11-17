// https://docs.github.com/cn   
// https://docs.github.com/cn/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token

### 使用 graphql 建立调用
    1. 要调用 Graphql , 先要有令牌
    2. 需要请求一下作用域
       user
       public_repo
       repo
       repo_deployment
       repo:status
       read:repo_hook
       read:org
       read:public_key
       read:gpg_key
    3. 创建令牌
        git 登录后, 右上角 图标点击 setting -> 
        Developer settings -> Personal access tokens 个人访问令牌
        -> Generate new token -> 取个响亮的名字 graphql -> 授予此令牌的
        作用域和权限 -> 
        repo, admin:repo_hook -> 拷贝令牌, 要向密码一样保护令牌
        
        
        
        
        
        
        
        
        
        
        
        
        