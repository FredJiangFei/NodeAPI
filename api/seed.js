const { User } = require('./models/user')
const { Product } = require('./models/product')
require('./startup/db')()
var fs = require('fs')
var path = require('path')

const data = {
  users: [
    {
      name: 'Admin',
      email: 'admin@123.com',
      password: '123123',
      isAdmin: true,
    },
    {
      name: 'Fred',
      email: 'fred@123.com',
      password: '123123',
    },
    {
      name: 'Tom',
      email: 'tom@123.com',
      password: '123123',
    }
  ],
}

async function seed() {
  await User.deleteMany({})
  await Product.deleteMany({})

  for (let user of data.users) {
    await User.add(user)
  }

  const productsJson = await fs.readFileSync('data/products.json', 'utf8')
  const products = JSON.parse(productsJson)
  for (let product of products) {
    var fsPath = path.join(__dirname, `images/${product.title}.jpg`)
    if (fs.existsSync(fsPath)) {
      var image = fs.readFileSync(fsPath, { encoding: 'base64' })
      product.image = image
    }
    await Product.add(product)
  }
  console.info('Done!')
}

seed()
