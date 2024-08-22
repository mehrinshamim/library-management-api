const express = require('express')
const router = express.Router()
const { supabase } = require('../config');
const auth = require('../auth'); 

router.post('/signup', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
  
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (error) {
        console.error(`Error signing up: ${error.status} - ${error.message}`);
        if (error.status === 400) {
          return res.status(400).json({ error: 'Invalid email or password format' });
        } else if (error.status === 409) {
          return res.status(409).json({ error: 'Email address already in use' });
        } else {
          return res.status(500).json({ error: 'Error signing up' });
        }
      }
  
      return res.json({ message: 'Signup successful' });
    } catch (error) {
      console.error(`Internal server error: ${error.message}`);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

router.post('/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
  
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      return res.json({ message: 'Signin successful' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  

  router
  .route('/:userid')
  .get((req,res)=>{
    const userid=req.params.userid
    res.send(`Display user ${req.params.id}'s Details`)
  })
  .put((req,res)=>{
    const userid=req.params.userid
    res.send(`Update user ${req.params.id}'s Details`)
  })
  .delete((req,res)=>{
    const userid=req.params.userid
    req.sendStatus(204)
  })

router.post('/userid:/logout',(req,res) =>{
    res.send('Logout Successful')
})

module.exports = router;