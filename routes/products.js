const { Product } = require('../models/product');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const multer = require('multer');

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page);
  const pageSize = parseInt(req.query.pageSize);
  const totalCount = await Product.count();
  const products = await Product.find({})
    .skip(pageSize * page - pageSize)
    .limit(pageSize);
  res.send({
    data: products,
    totalCount: totalCount,
  });
});

router.get('/search', async (req, res) => {
  var title = req.query.title;
  const products = await Product.find({
    title: {
      $regex: title,
    },
  })
    .select('title -_id')
    .limit(10)
    .sort('title');
  res.send(products);
});

router.post('/', [auth, multer().single('file')], async (req, res) => {
  req.body.image = Buffer.from(req.file.buffer, 'base64');
  let product = await Product.add(req.body);
  res.send(product);
});

router.get('/:id', async (req, res) => {
  let product = await Product.findById(req.params.id);
  res.send(product);
});

router.put('/:id', [auth, multer().single('file')], async (req, res) => {
  let updateData = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
  };
  if (req.file != undefined) {
    updateData.image = Buffer.from(req.file.buffer, 'base64');
  }
  const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
  });

  if (!product)
    return res.status(404).send('The product with the given ID was not found.');

  res.send(product);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product)
    return res.status(404).send('The product with the given ID was not found.');

  res.send(product);
});

module.exports = router;
