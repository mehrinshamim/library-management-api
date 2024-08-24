const express = require('express');
const { auth, authAdmin } = require('../auth');

module.exports = function(supabase) {
  const router = express.Router();

  router.post('/signup', async (req, res) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password and name are required' });
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

      const { data: userProfile, error: userProfileError } = await supabase
        .from('profiles')
        .insert({ name: name, email: email });

      if (userProfileError) {
        console.error(`Error creating user profile: ${userProfileError.message}`);
        return res.status(500).json({ error: 'Error creating user profile' });
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
    .get(async (req, res) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data: userProfile, error: userProfileError } = await supabase
          .from('profiles')
          .select('name, email, role')
          .eq('email', user.email)
          .single();

        if (userProfileError) {
          console.error(`Error fetching user profile: ${userProfileError.message}`);
          return res.status(500).json({ error: 'Error fetching user profile' });
        }

        res.json({
          id: user.id,
          name: userProfile.name,
          email: userProfile.email,
          role: userProfile.role,
        });
      } catch (error) {
        console.error(`Error getting user: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
      }
    })
    .put(async (req, res) => {
      try {
        const userid = req.params.userid;
        const { name, email, password } = req.body;

        const { data, error } = await supabase.auth.updateUser({
          email,
          password,
        });

        if (error) {
          console.error(`Error updating user: ${error.message}`);
          return res.status(500).json({ error: 'Error updating user' });
        }

        const { data: userProfile, error: userProfileError } = await supabase
          .from('profiles')
          .update({ name, email })
          .eq('email', email)
          .select();

        if (userProfileError) {
          console.error(`Error updating user profile: ${userProfileError.message}`);
          return res.status(500).json({ error: 'Error updating user profile' });
        }

        res.json({ message: `User ${userid} updated successfully`, data: userProfile[0] });
      } catch (error) {
        console.error(`Error updating user: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
      }
    })
    .delete(async (req, res) => {
      try {
        const userid = req.params.userid;
        const { data: { user } } = await supabase.auth.getUser();
        
        const { error: deleteUserError } = await supabase.auth.admin.deleteUser(userid);
      
        if (deleteUserError) {
          console.error(`Error deleting user: ${deleteUserError.message}`);
          return res.status(500).json({ error: 'Error deleting user' });
        }
      
        const { error: deleteUserProfileError } = await supabase
          .from('profiles')
          .delete()
          .eq('email', user.email);
      
        if (deleteUserProfileError) {
          console.error(`Error deleting user profile: ${deleteUserProfileError.message}`);
          return res.status(500).json({ error: 'Error deleting user profile' });
        }
      
        res.json({ message: `User ${userid} deleted successfully` });
      } catch (error) {
        console.error(`Error deleting user: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

  return router;
};