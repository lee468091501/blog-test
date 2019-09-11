const { handleBlogRouter } = require('./src/router/blog');
const { handleUserRouter } = require('./src/router/user');
const querystring = require('querystring')
const http = require('http')
const { get, set } = require('./src/db/redis')


// 获取 cookie 的过期时间当前时间一天后
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log('d.toGMTString() is ', d.toGMTString())
    return d.toGMTString()
}

// 用于处理 post data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        var postData = ''
        req.on('data', data => {
            postData += data
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )          
        })
    })
    return promise
}

// // session 数据
const SESSION_DATA = {}

const serverhandle = (req, res) => {

    res.setHeader('Content-type', 'application/json')
    const url = req.url;
    req.path = url.split('?')[0];
    req.query = querystring.parse(url.split('?')[1])

    // 解析 cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''  // k1=v1;k2=v2;k3=v3
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val       
    })

    // 解析 session
    let needSetCookie = false
    let userId = req.cookie.userid
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {}
        }
    } else {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        SESSION_DATA[userId] = {}
    }
    req.session = userId



    
    
    getPostData(req).then(postData => {
        req.body = postData      
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {

                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return           
        }

        const userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }                
                res.end(
                    JSON.stringify(userData)
                )
            })
            return    
        }
        // res.writeHead(404, { 'Content-type': 'test/plain' })
        // res.write(' 404 Not Found ')
        // res.end()
    })
}
module.exports = serverhandle