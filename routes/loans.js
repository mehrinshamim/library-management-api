const express = require('express');
const { auth, authAdmin } = require('../auth');

module.exports = function(supabase) {
  const router = express.Router();

  // Loan a book
  router.post('/:bookid/loan', async (req, res) => {
    try {
      const bookid = req.params.bookid;
      if (!bookid || typeof bookid !== 'string') {
        return res.status(400).json({ message: 'Invalid book ID' });
      }
  
      // Check if book is available
      let { data: Bookstatus, error2 } = await supabase
        .from('Books')
        .select('lent_status')
        .eq('id', bookid)
  
      if (error2) throw error2;
  
      if (Bookstatus[0].lent_status === 'not available') {
        return res.status(400).json({ message: 'The Book is currently unavailable' });
      }
  
      // Loan book logic here using Supabase    

      const { data, error } = await supabase
        .from('Loans')
        .insert([
          { book_id: bookid, user_id: req.body.user_id }
        ])
        .select()

      const { data1, error1 } = await supabase
        .from('Books')
        .update({ lent_status: 'not available' })
        .eq('id', bookid)
        .select()

      if (error || error1 ) throw error;

      res.json({ message: 'Book loaned successfully. Please return it within 14 days', data: data[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error loaning book' });
    }
  });

  // Return a book
  router.post('/:loanid/return', async (req, res) => {
    try {
      const loanid = req.params.loanid;
      if (!loanid || typeof loanid !== 'string') {
        return res.status(400).json({ message: 'Invalid loan ID' });
      }

      // Return book logic here using Supabase
      const { data, error } = await supabase
        .from('Loans')
        .update({ returned_at: new Date() })
        .eq('id', loanid)
        .select()


        let { data: Loans, error2 } = await supabase
        .from('Loans')
        .select('book_id')

        const bookid = Loans[0].book_id;      

        const { data1, error1 } = await supabase
        .from('Books')
        .update({ lent_status: 'available' })
        .eq('id', bookid)
        .select()

      if (error || error1) throw error;

      res.json({ message: 'Book returned successfully', data: data[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error returning book' });
    }
  });

  // View all loan history
  router.get('/loan-history', async (req, res) => {
    try {
      // Get all loan history logic here using Supabase
      let { data: loans, error } = await supabase
        .from('Loans')
        .select('*')

      if (error) throw error;

      res.json({ message: 'All loan history retrieved successfully', data: loans });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving loan history' });
    }
  });

  // View loan history of a user
  router.get('/:userid/loan-history', async (req, res) => {
    try {
      const userid = req.params.userid;
      if (!userid || typeof userid !== 'string') {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      // Get loan history of user logic here using Supabase
      let { data: userLoans, error } = await supabase
        .from('Loans')
        .select('*')
        .eq('user_id', userid)

      if (error) throw error;

      res.json({ message: 'Loan history of user retrieved successfully', data: userLoans });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving loan history of user' });
    }
  });

  return router;
};