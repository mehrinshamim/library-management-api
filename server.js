const express = require('express')
const app = express()

app.set('view engine','ejs')
app.use(express.json()); 


app.get('/', (req,res) =>{
    res.render('index')
})


const userRouter = require('./routes/users')
app.use('/users',userRouter)

const bookRouter = require('./routes/books')
app.use('/books',bookRouter)

const loanRouter = require('./routes/loans')
app.use('/loans',loanRouter)



app.listen(3000) //app is listening on port 3000