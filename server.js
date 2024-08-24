const express = require('express')
const app = express()
const { supabase: initPromise } = require('./config');

(async () => {
  const supabase = await initPromise;

  app.set('view engine','ejs')
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));

  app.get('/', (req,res) =>{
      res.render('index')
  })

  //const userRouter = require('./routes/users')(supabase)
  //app.use('/api/users', userRouter)

  const bookRouter = require('./routes/books')(supabase)
  app.use('/api/books', bookRouter)

  //const loanRouter = require('./routes/loans')(supabase)
  //app.use('/api/loans', loanRouter)
////
  const userRouter = require('./routes/users')
  app.use('/api/users',userRouter)

  //const bookRouter = require('./routes/books')
  //app.use('/api/books',bookRouter)

  const loanRouter = require('./routes/loans')
  app.use('/api/loans',loanRouter)

  app.listen(3000)
})();