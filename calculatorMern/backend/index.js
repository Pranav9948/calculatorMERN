const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app=express()
app.use(express.json())

mongoose.connect("mongodb://localhost:27017/AAAA").then(()=>console.log("Db connected")).catch(()=>console.log("error in db"))




app.use(cors())
const calcRoute=require('./routers/calcRoutes')
app.use('/',calcRoute)


app.listen(5000,()=>console.log("listening on 5000"))