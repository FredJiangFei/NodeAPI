const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = await User.add(req.body);

  res.send({
    name: user.name,
    email: user.email
  });
});

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const totalCount = await User.count();
    const users = await User.find({})
      .skip(pageSize * page - pageSize)
      .limit(pageSize);
    res.send({
      data: users,
      totalCount: totalCount,
    });
  });

module.exports = router;
