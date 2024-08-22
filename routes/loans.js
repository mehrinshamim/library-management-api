const express = require('express')
const router = express.Router()


router.post('/:bookid/loan',(req,res) =>{
    res.send('Loan a Book')
})

router.post('/:loanid/return',(req,res) =>{
    res.send('Return a book')
})

router.get(('/loan-history'),(req,res) =>{
    res.send('View all loan history')
})

router.get(('/:userid/loan-history'),(req,res) =>{
    res.send("View Loan History of a User")
})












module.exports = router