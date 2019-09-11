const {checklogin}=require('../controller/user')
const {SuccessModel,ErrorModel}=require('../model/resModel')

const handleUserRouter=(req,res)=>{
    const method=req.method; 
    //验证登陆
    if(method==='POST'&&req.path==='/api/user/login'){
        const {userid,password}=req.body
        let listdata=checklogin(userid,password)
        if (listdata.username) {
            // 设置 session
            req.session.userid = listdata.userid
            req.session.username = listdata.username
            // 同步到 redis
            set(req.sessionId, req.session)

            return new SuccessModel()
        }
        return new ErrorModel('登录失败')
        
    }

     // // 登录验证的测试
    if (method === 'GET' && req.path === '/api/user/login-test') {
        if (req.session) {           
            return Promise.resolve(
                new SuccessModel({
                    session: req.session
                })
            )
        }
        return Promise.resolve(
            new ErrorModel('尚未登录')
        )
    }
}
module.exports={handleUserRouter}