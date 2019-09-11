const {getlist,getdetail,insertblog,updateblog,deleteblog}=require('../controller/blog')
const {SuccessModel,ErrorModel}=require('../model/resModel')

const handleBlogRouter=(req,res)=>{
    const method=req.method; 
    
    //获取博客列表
    if(method==='GET'&&req.path==='/api/blog/list'){

        const author=req.query.author||''
        const keyword=req.query.keyword||''
        
        const result = getlist(author,keyword)
        return result.then(listdata => {
            return new SuccessModel(listdata)
        })

        // let listdata=getlist(author,keyword)
        // if(listdata){
        //     return  new SuccessModel(listdata)
        // }
        // else{  
        //     return  new ErrorModel("列表数据失败")      
        // }
        
    }
    //获取博客详情
    if(method==='GET'&&req.path==='/api/blog/detail'){
        const id=req.query.id||''  
        const result = getdetail(id)
        return result.then(listdata => {
            return new SuccessModel(listdata)
        })   
    }
    //新增博客
    if(method==='POST'&&req.path==='/api/blog/insert'){
        let result=insertblog(req.body)
        return result.then(data => {
            return new SuccessModel(data)
        })
        
    }
    //更新博客
    if(method==='POST'&&req.path==='/api/blog/update'){
        const id=req.query.id||''         
        let result=updateblog(id,req.body)     
        return result.then(data => {
            return new SuccessModel(data)
        })
        
    }
    //删除博客
    if(method==='POST'&&req.path==='/api/blog/delete'){
        const id=req.query.id||''         
        let result=deleteblog(id)     
        return result.then(data => {
            return new SuccessModel(data)
        })
    }
}
module.exports={handleBlogRouter}