const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await user.comparePassword(req.body.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();
  res.send({
    token,
    user: {
      email: user.email,
      isAdmin: user.isAdmin,
      name: user.name,
    },
  });
});

module.exports = router;
