const express = require('express')
const articleRouter = require('./routes/articles')
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const Article = require('./models/article')
const methodOverride = require('method-override')


const app = express()
dotenv.config();

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster-01.xalmll0.mongodb.net/BlogDB`)




app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.get('/',async(req, res) => {
    const articles =  await Article.find().sort({createdAt:'desc'})
    res.render('articles/index', {articles:articles})
})



app.use('/articles', articleRouter)
app.listen(3000)
