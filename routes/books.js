const express = require('express')
const router = express.Router()

router.post('/add_new',(req,res) =>{
    res.send('Add new Book')
})

router.get('/',(req,res) =>{
    res.send('Get all Books')
})

router
    .route('/:bookid')
    .get((req,res) =>{
        res.send('Get Book by id')
    })
    .put((req,res) =>{
        res.send('Update Book')
    })
    .delete((req,res) =>{
        res.send('Delete Book')
    })


module.exports = router