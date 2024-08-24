const express = require('express');
const router = express.Router();

const { auth, authAdmin } = require('../auth');

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name ) {
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

    // Create a new user profile
    const { data: userProfile, error: userProfileError } = await supabase
      .from('profiles')
      .insert({ name, role, email });

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
  .get( async (req, res) => {
    const userid = req.params.userid;
    const { data: { user } } = await supabase.auth.getUser();
    const { data: userProfile, error: userProfileError } = await supabase
      .from('profiles')
      .select('name, email, role')
      .eq('email', user.email);

    if (userProfileError) {
      console.error(`Error fetching user profile: ${userProfileError.message}`);
      return res.status(500).json({ error: 'Error fetching user profile' });
    }

    res.json({
      id: user.id,
      name: userProfile[0].name,
      email: userProfile[0].email,
      role: userProfile[0].role,
    });
  })
  .put( async (req, res) => {
    const userid = req.params.userid;
    const { name, email } = req.body;

    const { data, error } = await supabase.auth.updateUser({
      email,
      password: req.body.password,
      data: { hello: 'world' },
    });

    if (error) {
      console.error(`Error updating user: ${error.message}`);
      return res.status(500).json({ error: 'Error updating user' });
    }

    const { data: userProfile, error: userProfileError } = await supabase
      .from('profiles')
      .update({ name, email, role })
      .eq('email', email);

    if (userProfileError) {
      console.error(`Error updating user profile: ${userProfileError.message}`);
      return res.status(500).json({ error: 'Error updating user profile' });
    }

    res.send(`Update user ${req.params.id}'s Details`);
  })
  .delete( async (req, res) => {
    const userid = req.params.userid;
    const { data: { user } } = await supabase.auth.getUser();
    const { error: deleteUserError } = await supabase.auth.deleteUser();
  
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
  })

  module.exports = router;
