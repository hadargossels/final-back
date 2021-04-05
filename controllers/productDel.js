const faker = require('faker'); //For testing purpose only
const moment = require('moment');
const mongoose = require('mongoose');

const User = require('../models/user');
const Product = require('../models/product');
const {uploader} = require('../utils/index');

const limit_ = 5;

//Get Popular Products
// const getPopularProducts = async function () {
//     let aggregate_options = [];

//     //PAGINATION -- set the options for pagination
//     const options = {
//         page: 1,
//         collation: {locale: 'en'},
//         customLabels: {
//             totalDocs: 'totalResults',
//             docs: 'Products'
//         }
//     };

//     //2
//     //LOOKUP/JOIN -- SECOND STAGE
//     //FIRST JOIN  -- Category ===================================
//     // Here we use $lookup(aggregation) to get the relationship from Product to categories (one to many).

//     //4
//     //FILTER BY DATE -- FOURTH STAGE
//     aggregate_options.push({
//         $match: {"start_date": {$gte: new Date()}}
//     });

//     //5
//     //SORTING -- FIFTH STAGE - SORT BY DATE
//     aggregate_options.push({
//         $sort: {"start_date": -1, "_id": -1}
//     });

//     //SELECT FIELDS
//     aggregate_options.push({
//         $project: {
//             _id: 1,
//             productId: 1,
//             src: 1,        
//             price: 1,
//             name: 1,
//             gallery1: 1,
//             gallery2: 1,
//             gallery3: 1,
//             description: 1,
//             stock: 1,
//             rating: 1,
//             raters: 1,
//             related1: 1,
//             related2: 1,
//             related3: 1,
//             category: 1,
//             brand: 1,
//             color: 1,
//             priceRange: 1,
//             date: 1,
//             featured: 1
//         }
//     });

//     aggregate_options.push({
//         $sample: { size: 5 }
//     });

//     // Set up the aggregation
//     const myAggregate = Product.aggregate(aggregate_options);
//     const result = await Product.aggregatePaginate(myAggregate, options);

//     return result.Products;
// };

// @route GET api/Product
// @desc Returns all Products with pagination
// @access Public
exports.index = function (req, res) {
    if(req.user)
        console.log(req.user)
    Product.find({}).then(function (err, products) {
        if (err)
            res.send(err)
        else {
            let recordset = products.recordset
            // res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Range', `${recordset.length}`)

            res.json({error: false, message : 'success' ,recordset})
        }
    })
}

// exports.index = async function (req, res) {
    // let aggregate_options = [];
    // let group = (req.query.group !== 'false' && parseInt(req.query.group) !== 0);
    // let search = !!(req.query.q);
    // let match_regex = {$regex: req.query.q, $options: 'i'}; //use $regex in mongodb - add the 'i' flag if you want the search to be case insensitive.

    // //PAGINATION -- set the options for pagination
    // const options = {
    //     page: parseInt(req.query.page) || 1,
    //     limit: parseInt(req.query.limit) || limit_,
    //     collation: {locale: 'en'},
    //     customLabels: {
    //         totalDocs: 'totalResults',
    //         docs: 'Products'
    //     }
    // };

    // //1
    // //FILTERING AND PARTIAL TEXT SEARCH -- FIRST STAGE
    // if (search) aggregate_options.push({$match: {"name": match_regex}});

    // //2
    // //LOOKUP/JOIN -- SECOND STAGE
    // //FIRST JOIN  -- Category ===================================
    // // Here we use $lookup(aggregation) to get the relationship from Product to categories (one to many).

    // //3a
    // //FILTER BY USERID -- SECOND STAGE - use mongoose.Types.ObjectId() to recreate the moogoses object id

    // //3b
    // //FILTER BY Category -- THIRD STAGE - use mongoose.Types.ObjectId() to recreate the moogoses object id
    // if (req.query.category) {
    //     aggregate_options.push({
    //         $match: {
    //             category: mongoose.Types.ObjectId(req.query.category)
    //         }
    //     });
    // }


    // //3c
    // //FILTER BY ProductID -- THIRD STAGE - use mongoose.Types.ObjectId() to recreate the moogoses object id
    // if (req.query.id) {
    //     aggregate_options.push({
    //         $match: {
    //             _id: mongoose.Types.ObjectId(req.query.id)
    //         }
    //     });
    // }

    // //4
    // //FILTER BY DATE -- FOURTH STAGE
    // if (req.query.start) {
    //     let start = moment(req.query.start).startOf('day');
    //     let end = moment(req.query.start).endOf('day'); // add 1 day

    //     if (req.query.end) end = req.query.end;

    //     aggregate_options.push({
    //         $match: {"start_date": {$gte: new Date(start), $lte: new Date(end)}}
    //     });

    // }else if (req.query.end) {
    //     aggregate_options.push({
    //         $match: {"start_date": {$lte: new Date(req.query.end)}}
    //     });
    // }else if (!search){
    //     aggregate_options.push({
    //         $match: {"start_date": {$gte: new Date()}}
    //     });
    // }

    // //5
    // //SORTING -- FIFTH STAGE
    // let sort_order = req.query.sort_order && req.query.sort_order === 'asc' ? 1 : -1;
    // let sort_by = req.query.sort_by || "start_date";
    // aggregate_options.push({
    //     $sort: {
    //         [sort_by]: sort_order,
    //         "_id": -1
    //     },
    // });

    // //SELECT FIELDS
    // aggregate_options.push({
    //     $project: {
    //         _id: 1,
    //         productId: 1,
    //         src: 1,        
    //         price: 1,
    //         name: 1,
    //         gallery1: 1,
    //         gallery2: 1,
    //         gallery3: 1,
    //         description: 1,
    //         stock: 1,
    //         rating: 1,
    //         raters: 1,
    //         related1: 1,
    //         related2: 1,
    //         related3: 1,
    //         category: 1,
    //         brand: 1,
    //         color: 1,
    //         priceRange: 1,
    //         date: 1,
    //         featured: 1
    //     }
    // });

    // //6
    // //GROUPING -- LAST STAGE
    // if (group) {
    //     aggregate_options.push({
    //         $group: {
    //             _id: {$dateToString: {format: "%Y-%m-%d", date: "$start_date"}},
    //             data: {$push: "$$ROOT"}
    //         }
    //     });
    //     aggregate_options.push({
    //         $sort: {
    //             "data.start_date": req.query.sort_order && req.query.sort_order === 'asc' ? 1 : -1
    //         }
    //     });
    // }
    // // END GROUPING ===================================

    // // Set up the aggregation
    // const myAggregate = Product.aggregate(aggregate_options);
    // const result = await Product.aggregatePaginate(myAggregate, options);

    // const Products = await Product.find({});
    // result["Products"] = Products;
    // // result["popular"] = await getPopularProducts();
    // // result["grouped"] = group;
    // res.setHeader( 'Access-Control-Expose-Headers', 'Content-Range');
    // res.setHeader('Content-Range', 'branches 0-50/50');
    // res.status(200).json(Products);
//     Product.find({})
//     .then((Products) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.setHeader( 'Access-Control-Expose-Headers', 'Content-Range');
//         res.setHeader('Content-Range', 'branches 0-50/50');
//         res.json(Products);
//     }, (err) => next(err))
//     .catch((err) => console.log(err));
// };


// @route POST api/Product
// @desc Add a new Product
// @access Public
exports.store = async (req, res) => {
    try {
        const userId = req.user._id;
        const newProduct = new Product({...req.body, userId});

        const Product = await newProduct.save();

        //if there is no image, return success message
        if (!req.file) return res.status(200).json({Product, message: 'Product added successfully'});

        //Attempt to upload to cloudinary
        const result = await uploader(req);
        const Product_ = await Product.findByIdAndUpdate(Product._id, {$set: {image: result.url}}, {new: true});

        res.status(200).json({Product: Product_, message: 'Product added successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// @route GET api/Product/{id}
// @desc Returns a specific Product
// @access Public
exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const Product = await Product.findById(id);

        if (!Product) return res.status(401).json({message: 'Product does not exist'});

        res.status(200).json({Product});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

// @route PUT api/Product/{id}
// @desc Update Product details
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        const userId = req.user._id;

        const Product = await Product.findOneAndUpdate({_id: id, userId}, {$set: update}, {new: true});

        if (!Product) return res.status(401).json({message: 'Product does not exist'});

        //if there is no image, return success message
        if (!req.file) return res.status(200).json({Product, message: 'Product has been updated'});

        //Attempt to upload to cloudinary
        const result = await uploader(req);
        const Product_ = await Product.findOneAndUpdate({_id: id, userId}, {$set: {image: result.url}}, {new: true});

        res.status(200).json({Product: Product_, message: 'Product has been updated'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// @route DESTROY api/Product/{id}
// @desc Delete Product
// @access Public
exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        const userId = req.user._id;

        const Product = await Product.findOneAndDelete({_id: id, userId});

        if (!Product) return res.status(401).json({message: "Product does not exist or you don't have the required permission."});

        res.status(200).json({message: 'Product has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


/**
 * Seed the database -  //For testing purpose only
 */
exports.seed = async function (req, res) {

    try {
        let Products = [];
            for (let j = 0; j < 50; j++) {
                let newProduct = new Product({
                    productId: j,
                    src: faker.image.image(),
                    price: faker.commerce.price(1,40),
                    name: faker.commerce.productName(),
                    gallery1: faker.image.image(),
                    gallery2: faker.image.image(),
                    gallery3: faker.image.image(),
                    description: faker.commerce.productDescription(),
                    stock: "IN STOCK",
                    rating: faker.random.number(5),
                    raters: faker.random.number(),
                    related1: faker.image.image(),
                    related2: faker.image.image(),
                    related3: faker.image.image(),
                    category: faker.random.arrayElement(["pens","pencils","diaries","notebooks","school","folders"]),
                    brand: faker.random.arrayElement(["brandA","brandB","brandC","brandD"]),
                    color: faker.random.arrayElement(["black","white","red","blue","yellow","purple", "green", "orange", "pink", "multi"]), 
                    priceRange: faker.random.arrayElement(["0-10","11-20","21-30","31-40","41-50"]),
                    date: faker.date.past(),
                    featured: faker.random.number()
                   
                });
                let product = await newProduct.save();
                Products.push(product);
            }
        

        res.status(200).json({Products, message: 'Database seeded!'});
    } catch (error) {
        res.status(500).json({message: "seed error " + error.message});
    }

};