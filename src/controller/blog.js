const {execsql}=require('../db/mysql')

const sd = require('silly-datetime')

const getlist=(author,keyword)=>{    
    var sql=`select * from blog where 1=1  `
    if(author){
        sql+=` and author like '%${author}%'`
    }        
    if(keyword){
        sql+=` and title like '%${keyword}%'`
    }   
    return execsql(sql)    
}
const getdetail=(id)=>{
    var sql=`select * from blog where 1=1  `
    if(id){
        sql+=` and id = '${id}'`      
        return execsql(sql).then(rows => {
            return rows[0]
        })
    }   
    
}
const insertblog=(blogdata={})=>{  
    const title = blogdata.title    
    const content =blogdata.content
    const author = blogdata.author
    const createTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
    const sql = `
        insert into blog (title, content, createtime, author)
        values ('${title}', '${content}', '${createTime}', '${author}');
    `
    console.log(sql)
    return execsql(sql).then(insertData => {      
        return {
            id: insertData.insertId
        }
    })
}
const updateblog=(id,blogdata={})=>{
    const title = blogdata.title
    const content = blogdata.content
    const author = blogdata.author
    const sql = `
        update blog set title='${title}', content='${content}', author='${author}' where id=${id}    `

    return execsql(sql).then(updateData => {       
        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}
const deleteblog=(id)=>{
    const sql = `
        delete from  blog  where id=${id}    `

    return execsql(sql).then(delteData => {       
        if (delteData.affectedRows > 0) {
            return true
        }
        return false
    })
}
module.exports={getlist,getdetail,insertblog,updateblog,deleteblog}