const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: String,
  price: Number,
  image: {
    type: String,
  },
});

productSchema.statics.add = async function (prd) {
  let product = new this({
    title: prd.title,
    description: prd.description,
    price: prd.price,
    image: prd.image,
  });
  product.id = product._id;
  product = await product.save();
  return product;
};

productSchema.statics.getAll = async function () {
  return await this.find();
};

mongoose.set('useFindAndModify', false);
const Product = mongoose.model('Product', productSchema);
exports.Product = Product;
