const mongoose = require("mongoose");
const Stock = require('./../models/Stock');
const ObjectId = mongoose.Types.ObjectId;


exports.getStocksService = async (filters, queries) => {

  
  // const stocks = await Stock.find(filters)
  //   .skip(queries.skip)
  //   .limit(queries.limit)
  //   .select(queries.fields)
  //   .sort(queries.sortBy);

  const stocks = await Stock.aggregate([
    // {$match: {'store.name' : 'chattogram'}}
    {$match: {}},
    {
      $project: {
        store:1,
        price:  {$convert: {input: '$price', to: 'int'}},
        quantity: 1
      }
    },
    {$group: {_id: '$store.name', totalProductsPrice: {$sum: {$multiply: ['$price', '$quantity']}}}}
  ])


  const total = await Stock.countDocuments(filters);
  const page = Math.ceil(total / queries.limit);
  return { total, page, stocks };
}


exports.createStockService = async (data) => {
  const stock = await Stock.create(data);
  return stock;
}

exports.getStockByIdService = async (id) => {
  // const stock = await Stock.findOne({ _id: id })
  //   .populate("store.id")
  //   .populate("suppliedBy.id")
  //   .populate("brand.id");


  // pipe line --> many stages
  // data -> one stage -> two stage

  const stock = await Stock.aggregate([
    // stage1
    {$match: {_id: ObjectId(id)}},



    // {
    //   $project: {
    //     category: 1,
    //     quantity: 1,
    //     price: 1,
    //     productId: 1,
    //     name: 1,
    //     'brand.name': {$toLower: '$brand.name'}
    //   }
    // },
    // {
    //   $lookup: {
    //     from: 'brands',
    //     localField:'brand.name',
    //     foreignField: 'name',
    //     as: 'brandDetails'
    //   }
    // }
  ])

  return stock;
}

/* 
exports.updateProductByIdService = async (productId, data) => {
  // for updating has two ways--
  // --------- first way --------
  //   const result = await Product.updateOne({_id: productId}, {$set: data}, {
  //     // runValidator used for validation. if we send name: null, then it will accepted without using this runValidator
  //     runValidators: true,
  //   });
  const result = await Stock.updateOne({ _id: productId }, { $inc: data }, {
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
    products.push(Stock.updateOne({ _id: product.id }, product.data));
  });

  const result = Promise.all(products);

  console.log(result);

  return result;
}

exports.deleteProductByIdService = async (id) => {
  const result = await Stock.deleteOne({ _id: id });

  return result;
}


exports.bulkProductDeleteService = async (ids) => {
  const result = await Stock.deleteMany({ _id: ids });

  return result;
} */