const { execsql } = require('../db/mysql')

const checklogin = (userid, password) => {
    
    const sql = `
        select userid, username from user where userid='${userid}' and password='${password}'
    `
    console.log('sql is', sql)
    return execsql(sql).then(rows => {
        return rows[0] || {}
    })
}
module.exports = { checklogin }