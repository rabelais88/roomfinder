const express = require('express')
const fs = require('fs')
const SETTINGS = require('./settings.json')
const bodyParser = require('body-parser')

const app = express()
const http = require('http').Server(app)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

http.listen(SETTINGS.HEROKU ? process.env.PORT : SETTINGS.OPENPORT,
  function(){
    console.log("heroku mode: " + SETTINGS.HEROKU)
    console.log("server is up at " + this.address().port)
    console.log("mode: " + process.env.NODE_ENV)
})

app.use('/pub', express.static(__dirname + '/pub'))
app.use('/pub/vue.min.js', express.static(__dirname + '/node_modules/vue/dist/vue.min.js'))

app.get('/',(req,res)=>{
  fs.readFile('index.html','utf8',(err,data)=>{
    res.send(data)
  })
})

