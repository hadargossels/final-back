const faker = require('faker'); //For testing purpose only
const moment = require('moment');
const mongoose = require('mongoose');

const User = require('../models/user');
const Comment = require('../models/comment');
const {uploader} = require('../utils/index');

const limit_ = 5;

//Get Popular Comments
const getPopularComments = async function () {
    let aggregate_options = [];

    //PAGINATION -- set the options for pagination
    const options = {
        page: 1,
        collation: {locale: 'en'},
        customLabels: {
            totalDocs: 'totalResults',
            docs: 'Comments'
        }
    };

    //2
    //LOOKUP/JOIN -- SECOND STAGE
    //FIRST JOIN  -- Category ===================================
    // Here we use $lookup(aggregation) to get the relationship from Comment to categories (one to many).
    aggregate_options.push({
        $lookup: {
            from: 'blog',
            localField: "postId",
            foreignField: "_id",
            as: "blog"
        }
    });
    //deconstruct the $purchases array using $unwind(aggregation).
    aggregate_options.push({$unwind: {path: "$blog", preserveNullAndEmptyArrays: true}});

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
            commentId:1,
            name: 1,
            date: 1,
            comment: 1,
            postId: 1
        }
    });

    aggregate_options.push({
        $sample: { size: 5 }
    });

    // Set up the aggregation
    const myAggregate = Comment.aggregate(aggregate_options);
    const result = await Comment.aggregatePaginate(myAggregate, options);

    return result.Comments;
};

// @route GET api/Comment
// @desc Returns all Comments with pagination
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
            docs: 'Comments'
        }
    };

    //1
    //FILTERING AND PARTIAL TEXT SEARCH -- FIRST STAGE
    if (search) aggregate_options.push({$match: {"name": match_regex}});

    //2
    //LOOKUP/JOIN -- SECOND STAGE
    //FIRST JOIN  -- Category ===================================
    // Here we use $lookup(aggregation) to get the relationship from Comment to categories (one to many).

    //deconstruct the $purchases array using $unwind(aggregation).

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
    //FILTER BY CommentID -- THIRD STAGE - use mongoose.Types.ObjectId() to recreate the moogoses object id
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
            commentId:1,
            name: 1,
            date: 1,
            comment: 1,
            postId: 1
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
    const myAggregate = Comment.aggregate(aggregate_options);
    const result = await Comment.aggregatePaginate(myAggregate, options);

    const categories = await Category.find({});
    result["categories"] = categories;
    result["popular"] = await getPopularComments();
    result["grouped"] = group;
    res.status(200).json(result);
};


// @route POST api/Comment
// @desc Add a new Comment
// @access Public
exports.store = async (req, res) => {
    try {
        const userId = req.user._id;
        const newComment = new Comment({...req.body, userId});

        const Comment = await newComment.save();

        //if there is no image, return success message
        if (!req.file) return res.status(200).json({Comment, message: 'Comment added successfully'});

        //Attempt to upload to cloudinary
        const result = await uploader(req);
        const Comment_ = await Comment.findByIdAndUpdate(Comment._id, {$set: {image: result.url}}, {new: true});

        res.status(200).json({Comment: Comment_, message: 'Comment added successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// @route GET api/Comment/{id}
// @desc Returns a specific Comment
// @access Public
exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const Comment = await Comment.findById(id);

        if (!Comment) return res.status(401).json({message: 'Comment does not exist'});

        res.status(200).json({Comment});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

// @route PUT api/Comment/{id}
// @desc Update Comment details
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        const userId = req.user._id;

        const Comment = await Comment.findOneAndUpdate({_id: id, userId}, {$set: update}, {new: true});

        if (!Comment) return res.status(401).json({message: 'Comment does not exist'});

        //if there is no image, return success message
        if (!req.file) return res.status(200).json({Comment, message: 'Comment has been updated'});

        //Attempt to upload to cloudinary
        const result = await uploader(req);
        const Comment_ = await Comment.findOneAndUpdate({_id: id, userId}, {$set: {image: result.url}}, {new: true});

        res.status(200).json({Comment: Comment_, message: 'Comment has been updated'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// @route DESTROY api/Comment/{id}
// @desc Delete Comment
// @access Public
exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        const userId = req.user._id;

        const Comment = await Comment.findOneAndDelete({_id: id, userId});

        if (!Comment) return res.status(401).json({message: "Comment does not exist or you don't have the required permission."});

        res.status(200).json({message: 'Comment has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


/**
 * Seed the database -  //For testing purpose only
 */
exports.seed = async function (req, res) {

    try {
        let Comments = [];
            for (let j = 0; j < 50; j++) {
                let newComment = new Comment({
                    commentId: j,
                    name: faker.name.firstName(),
                    date: faker.date.soon(),
                    comment: faker.lorem.sentence(),
                    postId: faker.random.number(10)
                   
                });
                let comment = await newComment.save();
                Comments.push(comment);
            }
        

        res.status(200).json({Comments, message: 'Database seeded!'});
    } catch (error) {
        res.status(500).json({message: "seed error " + error.message});
    }

};