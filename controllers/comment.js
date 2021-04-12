let Comment = require("../models/comment")
let Token = require("../models/token")
let bcrypt = require('bcrypt')
const faker = require('faker');
const saltRounds = 10

exports.findAll = function (req, res) {
    Comment.find({},function (err, comments) {
        if (err)
            {res.send(err)
            console.log(err)}
        else {
            res.setHeader('Content-Range', `${comments.length}`)
            res.send(comments)
        }
    })
}


exports.addComment = function (req, res) {

    let CommentData = req.body

    Comment.create({...CommentData}, function (err) {
        if (err)
            res.send(err)

        else
            res.json({error:false, message: 'Comment Added successfully'})
    })
}

exports.findOneComment = function (req, res) {
    Comment.findOne({ id: req.params.id}, function (err, comments) {
        if (err)
            res.send(err)
        else{
            res.send(comments)
        }
    })
}

exports.update = function (req, res) {

    let CommentData = req.body

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({
            error: true,
            message: 'Please provide all required field'
        });
    } else {
        if(req.method === 'PATCH'){
            Comment.patchUpdate(req.params.id, new Comment({...CommentData}), function (err, comment) {
                if (err)
                    return res.send({
                        error: true,
                        message: err.message
                    });

                res.json({
                    error: false,
                    message: 'Comment successfully updated'
                });

            });
        }else{
            Comment.findOneAndUpdate({id: req.params.id}, {$set: CommentData},{ useFindAndModify: false }, function (err, comments) {
                if (err)
                    return res.send({
                        error: true,
                        message: err.message
                    });
                res.send(comments)

            });
        }
    }
};

exports.deleteComment = function (req, res) {
    Comment.findOneAndDelete({id: req.params.id},{ useFindAndModify: false }, function (err, comment) {
        if (err)
            res.send({
                error: true,
                message: err.message
            });
        else

        res.json({
            error: false,
            message: 'Comment successfully deleted'
        });
    });
};

exports.seed = async function (req, res) {

    try {
        let Comments = [];
            for (let j = 0; j < 50; j++) {
                let newComment = new Comment({
                    id: j,
                    name: faker.name.findName(),
                    date: faker.date.recent(),
                    comment: faker.lorem.sentences(2),
                    postId: faker.datatype.number(10)               
                });
                let comment = await newComment.save();
                Comments.push(comment);
            }
        

        res.status(200).json({Comments, message: 'Database seeded!'});
    } catch (error) {
        res.status(500).json({message: "seed error " + error.message});
    }

};
