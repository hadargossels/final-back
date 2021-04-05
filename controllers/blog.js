const faker = require('faker'); //For testing purpose only
const moment = require('moment');
const mongoose = require('mongoose');

const User = require('../models/user');
const Blog = require('../models/blog');
const {uploader} = require('../utils/index');

const limit_ = 5;

//Get Popular Blogs
const getPopularBlogs = async function () {
    let aggregate_options = [];

    //PAGINATION -- set the options for pagination
    const options = {
        page: 1,
        collation: {locale: 'en'},
        customLabels: {
            totalDocs: 'totalResults',
            docs: 'Blogs'
        }
    };

    //2
    //LOOKUP/JOIN -- SECOND STAGE
    //FIRST JOIN  -- Category ===================================
    // Here we use $lookup(aggregation) to get the relationship from Blog to categories (one to many).

    //4
    //FILTER BY DATE -- FOURTH STAGE
    aggregate_options.push({
        $match: {"start_date": {$gte: new Date()}}
    });

    //5
    //SORTING -- FIFTH STAGE - SORT BY DATE
    aggregate_options.push({
        $sort: {"start_date": -1, "_id": -1}
    });

    //SELECT FIELDS
    aggregate_options.push({
        $project: {
            _id: 1,
            src: 1,        
            price: 1,
            name: 1,
            gallery1: 1,
            gallery2: 1,
            gallery3: 1,
            description: 1,
            stock: 1,
            rating: 1,
            raters: 1,
            related1: 1,
            related2: 1,
            related3: 1,
        }
    });

    aggregate_options.push({
        $sample: { size: 5 }
    });

    // Set up the aggregation
    const myAggregate = Blog.aggregate(aggregate_options);
    const result = await Blog.aggregatePaginate(myAggregate, options);

    return result.Blogs;
};

// @route GET api/Blog
// @desc Returns all Blogs with pagination
// @access Public
exports.index = async function (req, res) {
    let aggregate_options = [];
    let group = (req.query.group !== 'false' && parseInt(req.query.group) !== 0);
    let search = !!(req.query.q);
    let match_regex = {$regex: req.query.q, $options: 'i'}; //use $regex in mongodb - add the 'i' flag if you want the search to be case insensitive.

    //PAGINATION -- set the options for pagination
    const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || limit_,
        collation: {locale: 'en'},
        customLabels: {
            totalDocs: 'totalResults',
            docs: 'Blogs'
        }
    };

    //1
    //FILTERING AND PARTIAL TEXT SEARCH -- FIRST STAGE
    if (search) aggregate_options.push({$match: {"name": match_regex}});

    //2
    //LOOKUP/JOIN -- SECOND STAGE
    //FIRST JOIN  -- Category ===================================
    // Here we use $lookup(aggregation) to get the relationship from Blog to categories (one to many).
    aggregate_options.push({
        $lookup: {
            from: 'categories',
            localField: "category",
            foreignField: "_id",
            as: "categories"
        }
    });
    //deconstruct the $purchases array using $unwind(aggregation).
    aggregate_options.push({$unwind: {path: "$categories", preserveNullAndEmptyArrays: true}});

    //3a
    //FILTER BY USERID -- SECOND STAGE - use mongoose.Types.ObjectId() to recreate the moogoses object id
    if (req.query.user) {
        aggregate_options.push({
            $match: {
                userId: mongoose.Types.ObjectId(req.query.user)
            }
        });
    }

    //3b
    //FILTER BY Category -- THIRD STAGE - use mongoose.Types.ObjectId() to recreate the moogoses object id
    if (req.query.category) {
        aggregate_options.push({
            $match: {
                category: mongoose.Types.ObjectId(req.query.category)
            }
        });
    }


    //3c
    //FILTER BY BlogID -- THIRD STAGE - use mongoose.Types.ObjectId() to recreate the moogoses object id
    if (req.query.id) {
        aggregate_options.push({
            $match: {
                _id: mongoose.Types.ObjectId(req.query.id)
            }
        });
    }

    //4
    //FILTER BY DATE -- FOURTH STAGE
    if (req.query.start) {
        let start = moment(req.query.start).startOf('day');
        let end = moment(req.query.start).endOf('day'); // add 1 day

        if (req.query.end) end = req.query.end;

        aggregate_options.push({
            $match: {"start_date": {$gte: new Date(start), $lte: new Date(end)}}
        });

    }else if (req.query.end) {
        aggregate_options.push({
            $match: {"start_date": {$lte: new Date(req.query.end)}}
        });
    }else if (!search){
        aggregate_options.push({
            $match: {"start_date": {$gte: new Date()}}
        });
    }

    //5
    //SORTING -- FIFTH STAGE
    let sort_order = req.query.sort_order && req.query.sort_order === 'asc' ? 1 : -1;
    let sort_by = req.query.sort_by || "start_date";
    aggregate_options.push({
        $sort: {
            [sort_by]: sort_order,
            "_id": -1
        },
    });

    //SELECT FIELDS
    aggregate_options.push({
        $project: {
            _id: 1,
            src: 1,        
            price: 1,
            name: 1,
            gallery1: 1,
            gallery2: 1,
            gallery3: 1,
            description: 1,
            stock: 1,
            rating: 1,
            raters: 1,
            related1: 1,
            related2: 1,
            related3: 1,
        }
    });

    //6
    //GROUPING -- LAST STAGE
    if (group) {
        aggregate_options.push({
            $group: {
                _id: {$dateToString: {format: "%Y-%m-%d", date: "$start_date"}},
                data: {$push: "$$ROOT"}
            }
        });
        aggregate_options.push({
            $sort: {
                "data.start_date": req.query.sort_order && req.query.sort_order === 'asc' ? 1 : -1
            }
        });
    }
    // END GROUPING ===================================

    // Set up the aggregation
    const myAggregate = Blog.aggregate(aggregate_options);
    const result = await Blog.aggregatePaginate(myAggregate, options);

    const categories = await Category.find({});
    result["categories"] = categories;
    result["popular"] = await getPopularBlogs();
    result["grouped"] = group;
    res.status(200).json(result);
};


// @route POST api/Blog
// @desc Add a new Blog
// @access Public
exports.store = async (req, res) => {
    try {
        const userId = req.user._id;
        const newBlog = new Blog({...req.body, userId});

        const Blog = await newBlog.save();

        //if there is no image, return success message
        if (!req.file) return res.status(200).json({Blog, message: 'Blog added successfully'});

        //Attempt to upload to cloudinary
        const result = await uploader(req);
        const Blog_ = await Blog.findByIdAndUpdate(Blog._id, {$set: {image: result.url}}, {new: true});

        res.status(200).json({Blog: Blog_, message: 'Blog added successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// @route GET api/Blog/{id}
// @desc Returns a specific Blog
// @access Public
exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const Blog = await Blog.findById(id);

        if (!Blog) return res.status(401).json({message: 'Blog does not exist'});

        res.status(200).json({Blog});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

// @route PUT api/Blog/{id}
// @desc Update Blog details
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        const userId = req.user._id;

        const Blog = await Blog.findOneAndUpdate({_id: id, userId}, {$set: update}, {new: true});

        if (!Blog) return res.status(401).json({message: 'Blog does not exist'});

        //if there is no image, return success message
        if (!req.file) return res.status(200).json({Blog, message: 'Blog has been updated'});

        //Attempt to upload to cloudinary
        const result = await uploader(req);
        const Blog_ = await Blog.findOneAndUpdate({_id: id, userId}, {$set: {image: result.url}}, {new: true});

        res.status(200).json({Blog: Blog_, message: 'Blog has been updated'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// @route DESTROY api/Blog/{id}
// @desc Delete Blog
// @access Public
exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        const userId = req.user._id;

        const Blog = await Blog.findOneAndDelete({_id: id, userId});

        if (!Blog) return res.status(401).json({message: "Blog does not exist or you don't have the required permission."});

        res.status(200).json({message: 'Blog has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


/**
 * Seed the database -  //For testing purpose only
 */
exports.seed = async function (req, res) {

    try {
        let Blogs = [];
            for (let j = 0; j < 50; j++) {
                let newBlog = new Blog({
                    src: faker.image.image(),
                    price: faker.commerce.price(1,40),
                    name: faker.commerce.blogName(),
                    gallery1: faker.image.image(),
                    gallery2: faker.image.image(),
                    gallery3: faker.image.image(), 
                    description: faker.commerce.blogDescription(),
                    stock: "IN STOCK",
                    rating: faker.random.number(5),
                    raters: faker.random.number(),
                    related1: faker.image.image(),
                    related2: faker.image.image(),
                    related3: faker.image.image(),
                   
                });
                let blog = await newBlog.save();
                Blogs.push(blog);
            }
        

        res.status(200).json({Blogs, message: 'Database seeded!'});
    } catch (error) {
        res.status(500).json({message: "seed error " + error.message});
    }

};