const Product = require('./../models/Product');
const Brand = require('./../models/Brand');

exports.getProductsService = async (filters, queries) => {
  
  // const products = await Product.find({});

  // ------------------ sort by price --------------
  // const products = await Product.find({}).sort({price: 1});

  // ---------- sort by multiple properties & what we want to send to client site --------------
  // const products = await Product.find({}).sort('name ');

  // select is used for what we can to show/send to client site
  // const products = await Product.find({}).sort(queries.sortBy).select('name price');
  // const products = await Product.find({}).sort(queries.sortBy).select(queries.fields);
  // const products = await Product.find({price: {$gt: 50}}).sort(queries.sortBy).select(queries.fields);
  const products = await Product.find(filters)
        .skip(queries.skip)
        .limit(queries.limit)
        .select(queries.fields)
        .sort(queries.sortBy);

  // ----- find/filter ------------
  // const products = await Product.find(query);

  const totalProducts = await Product.countDocuments(filters);
  const pageCount = Math.ceil(totalProducts/queries.limit);
  return {totalProducts, pageCount, products};
}


exports.createProductService = async (data) => {
  const product = await Product.create(data);

  // ------------  brand id adding ----------
  // step 1 -> _id, brand
  const {_id:productId, brand} = product; 
  // step 2 -> update Brand

  const result = await Brand.updateOne(
    {_id:brand.id},
    {$push: {products: productId}}
  );

  console.log(result.nModified);

  return product;
}

exports.updateProductByIdService = async (productId, data) => {
  // for updating has two ways--
  // --------- first way --------
  //   const result = await Product.updateOne({_id: productId}, {$set: data}, {
  //     // runValidator used for validation. if we send name: null, then it will accepted without using this runValidator
  //     runValidators: true,
  //   });
  const result = await Product.updateOne({ _id: productId }, { $inc: data }, {
    // runValidator used for validation. if we send name: null, then it will accepted without using this runValidator
    runValidators: true,
  });


  // ---------- second way ----------
  // const product = await Product.findById(productId);
  // const result = await product.set(data).save();


  return result;
}


exports.bulkProductUpdateService = async (data) => {
  // const result = await Product.updateMany({_id: data.ids}, data.data, {
  //     runValidators: true
  // });

  const products = [];
  data.ids.forEach(product => {
    products.push(Product.updateOne({ _id: product.id }, product.data));
  });

  const result = Promise.all(products);

  console.log(result);

  return result;
}

exports.deleteProductByIdService = async (id) => {
  const result = await Product.deleteOne({ _id: id });

  return result;
}


exports.bulkProductDeleteService = async (ids) => {
  const result = await Product.deleteMany({ _id: ids });

  return result;
}