
const { Product } = require('../models/product');
const mongoose = require('mongoose');
const config = require('config');

describe('product test', () => {
    beforeAll(async () => {
        const db = config.get('db_test');
        await mongoose.connect(db, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });
    });

    afterEach(async () => {
        await Product.deleteMany()
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it('should save product to database', async () => {
        let product = await Product.add({
            title: 'Iphone SE',
            price: 2999
        });

        const inserted = await Product.findOne({_id: product._id});
        expect(inserted.title).toEqual(product.title);
        expect(inserted.price).toEqual(product.price);
    })

    it('should get all products', async () => {
        let product1 = await Product({
            title: 'Iphone SE',
            price: 2999
        });
        await product1.save();

        let product2 = await Product({
            title: 'Hua Wei',
            price: 1
        });
        await product2.save();

        const products = await Product.getAll();
        expect(products.length).toEqual(2);
    })
})