const express = require('express');
const { auth, authAdmin } = require('../auth');

module.exports = function(supabase) {
  const router = express.Router();

  router.post('/add_new', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('Books')
        .insert([
          { title: req.body.title, author: req.body.author, published_year: req.body.published_year},
        ])
        .select()
      if (error) {
        throw error;
      }
 
      res.json({ message: 'Book added successfully', data: data[0] });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Error adding book' });
    }
  });

  router.get('/', async (req, res) => {
    try {
      let { data: Books, error } = await supabase
        .from('Books')
        .select('*')
 
      if (error) throw error;
      res.json({ message: 'All books retrieved successfully', data: Books });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving books' });
    }
  });

  router
    .route('/:bookid')
    .get(async (req, res) => {
      try {
        const bookid = req.params.bookid;
        let { data: Book, error } = await supabase
          .from('Books')
          .select('title,author,published_year,lent_status')
          .eq('id', bookid)
        if (error) throw error;
        if (!Book || Book.length === 0) {
          return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book retrieved successfully', data: Book[0] });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error retrieving book' });
      }
    })
    .put(async (req, res) => {
      try {
        const bookid = req.params.bookid;
        const { data, error } = await supabase
          .from('Books')
          .update({ title: req.body.title, author: req.body.author, published_year: req.body.published_year })
          .eq('id', bookid)
          .select()
        if (error) throw error;
        if (!data || data.length === 0) {
          return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book updated successfully', data: data[0] });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error updating book' });
      }
    })
    .delete(async (req, res) => {
      try {
        const bookid = req.params.bookid;
      
        const { data, error } = await supabase
          .from('Books')
          .delete()
          .eq('id', bookid)
        if (error) throw error;
        if (error === null) {
          res.json({ message: 'Book deleted successfully' });
        } else {
          return res.status(404).json({ message: 'Book not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error deleting book' });
      }
    });

  return router;
};