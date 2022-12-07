// const Product = require('../models/Product');

const { getStocksService, createStockService, getStockByIdService} = require("../services/stock.services");

exports.getStocks = async(req, res, next) => {
    try {
      // http://localhost:5000/api/v1/product?sort=price,quantity&fields=name,price
      // http://localhost:5000/api/v1/product?price[lt]=50
      // http://localhost:5000/api/v1/product?price[gt]=12&sort=price,quantity&fields=name,price

      // http://localhost:5000/api/v1/product?page=3&limit=5
      
      //{price:{$gt:50}}


      let filters = {...req.query};
      console.log(filters);

      // sort, page, limit --> exclude
      const excludeFields = ['sort', 'page', 'limit'];
      excludeFields.forEach(field => delete filters[field]);

      //gt, lt, gte, lte
      // http://localhost:5000/api/v1/product?price[lt]=50
      let filtersString = JSON.stringify(filters);
      filtersString = filtersString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

      filters = JSON.parse(filtersString);



      const queries = {};

      if(req.query.sort){
        // price, quantity --> 'price quantity'
        const sortBy = req.query.sort.split(',').join(' ');
        queries.sortBy = sortBy;

        console.log(sortBy);
      }

      // http://localhost:5000/api/v1/product?sort=price,quantity&fields=name,price
      if(req.query.fields)
      {
        const fields = req.query.fields.split(',').join(' ');
        queries.fields=fields;
        // console.log(queries);
        console.log(fields);
      
      }

      // http://localhost:5000/api/v1/product?page=3&limit=5
      if(req.query.page){

        const {page=1, limit=10} = req.query; // destructure with default value

        // 50 products
        // each page 10 product
        // page 1 --> 1-10
        // page 2 --> 11-20
        // page 3 --> 21-30      ---> page 3 --> skip 1-20 --> 3-1 --> 2 * 10
        // page 4 --> 31-40      ---> page 4 --> skip 1-30 --> 4-1 --> 3 * 10  
        // page 5 --> 41-50

        const skip = (page -1) * parseInt(limit);
        queries.skip = skip;
        queries.limit = parseInt(limit);
      }

      // console.log("original object", req.query);
      // console.log("query object", queryObject);

      const products = await getStocksService(filters, queries);



    //   const products = await Product.find({});


      // const products = await Product.find({}).limit(1);
      // const products = await Product.find({}).sort({quantity: -1});
      // const products = await Product.find({$or: [{_id: "637a9b74e4f0884408015518"}, {name: 'chal'}]});
      // const products = await Product.find({status: {$ne: "out-of-stock"}});
      // const products = await Product.find({quantity: {$gte: 100}});
      // const products = await Product.find({name: {$in: ["Chal", "Dhal"]}});
  
      // --------- projection ------------
      // const products = await Product.find({}, 'name quantity');
      // const products = await Product.find({}, '-name -quantity'); // we don't need these property
      // const products = await Product.find({}).select({name: 1});
  
  
      // ----------- query builder -----------
      // const products = await Product.where("name").equals("Chal").where("quantity").gt(100);
      // const products = await Product.where("name").equals(/\w/).where("quantity").gt(100).limit(2).sort({quantity: -1});
  
      // ----------- find by id -----------
    //   const products = await Product.findById("637ba6be6f2dc9203851050a");
  
  
  
      res.status(200).json({
        status: 'success',
        data: products,
      })
      
    } catch (error) {
      res.status(400).json({
        status: "fail", 
        message: "cant't get the data",
        error: error.message,
      })
    }
  }


exports.createStock = async (req, res, next) => {

    try {
      // two(2) post method to save data - 1) save, 2) create 
  
      // ----- create -------
    //   const result = await Product.create(req.body);
      const result = await createStockService(req.body);
      // result.logger();
  
      // -----  save -----
      
      // const  product = new Product(req.body);
      // instance creation --> Do Something --> save()
      // if(product.quantity == 0){
      //   product.status = 'out-of-stock';
      // }
  
      // const result = await product.save();
     
      res.status(200).json({
        status: "success",
        message: "Successfully created the stock",
        data: result
      }); 
  
    } catch (err) {
      res.status(400).json({
        status: "fail",
        message: "Data is not inserted",
        error: err.message
      })
    }
  
  }


exports.getStockById = async(req, res, next) => {
  try {
    const {id} = req.params;
    const stock = await getStockByIdService(id, req.body);

    if(!stock){
        return res.status(400).json({
            status: 'fail',
            message: "couldn't get the stock",
            error: error.message
          })
    }
    
    res.status(200).json({
        status: "success",
        //   message: "successfully updated the product"
        data: stock
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: "couldn't get the stock",
      error: error.message
    })
  }
}

// exports.updateProductById = async(req, res, next) => {
//   try {
//     const {id} = req.params;

//     const result = await updateProductByIdService(id, req.body);
    
//     res.status(200).json({
//       status: "success",
//       message: "successfully updated the product"
//     })
//   } catch (error) {
//     res.status(400).json({
//       status: 'fail',
//       message: "couldn't update the product",
//       error: error.message
//     })
//   }
// }


// exports.bulkUpdateProduct = async(req, res, next) => {
//   try {
//     const result = await bulkProductUpdateService(req.body);
    
//     res.status(200).json({
//       status: "success",
//       message: "successfully updated the product"
//     })
//   } catch (error) {
//     res.status(400).json({
//       status: 'fail',
//       message: "couldn't update the product",
//       error: error.message
//     })
//   }
// }

// exports.deleteProductById = async(req, res, next) => {
//   try {
//     const {id} = req.params;
//     const result = await deleteProductByIdService(id);

//     if(!result.deletedCount){
//       return res.status(400).json({
//         status: 'fail',
//         error: "Couldn't delete the product "
//       })
//     }
    
//     res.status(200).json({
//       status: "success",
//       message: "successfully deleted the product"
//     })
//   } catch (error) {
//     res.status(400).json({
//       status: 'fail',
//       message: "couldn't delete the product",
//       error: error.message
//     })
//   }
// }


// exports.bulkDeleteProduct = async(req, res, next) => {
//   try {
//     const result = await bulkProductDeleteService(req.body.ids);
    
//     res.status(200).json({
//       status: "success",
//       message: "successfully deleted the given product"
//     })
//   } catch (error) {
//     res.status(400).json({
//       status: 'fail',
//       message: "couldn't delete the given product",
//       error: error.message
//     })
//   }
// }


// exports.fileUpload = async(req, res) => {
//   try {
//     // ------- for single image -------
//     // res.status(200).json(req.file);

//     // ------- for multiple images -----
//     res.status(200).json(req.files);
//   } catch (error) {
    
//   }
// } 