let Blog = require("../models/blog")
let Token = require("../models/token")
let bcrypt = require('bcrypt')
const faker = require('faker');
const saltRounds = 10

exports.findAll = function (req, res) {
    Blog.find({},function (err, blogs) {
        if (err)
            {res.send(err)
            console.log(err)}
        else {
            res.setHeader('Content-Range', `${blogs.length}`)
            res.send(blogs)
        }
    })
}


exports.addBlog = function (req, res) {

    let BlogData = req.body

    Blog.create({...BlogData}, function (err) {
        if (err)
            res.send(err)

        else
            res.json({error:false, message: 'Blog Added successfully'})
    })
}

exports.findOneBlog = function (req, res) {
    Blog.findOne({ id: req.params.id}, function (err, blogs) {
        if (err)
            res.send(err)
        else{
            res.send(blogs)
        }
    })
}

exports.update = function (req, res) {

    let BlogData = req.body

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({
            error: true,
            message: 'Please provide all required field'
        });
    } else {
        if(req.method === 'PATCH'){
            Blog.patchUpdate(req.params.id, new Blog({...BlogData}), function (err, blog) {
                if (err)
                    return res.send({
                        error: true,
                        message: err.message
                    });

                res.json({
                    error: false,
                    message: 'Blog successfully updated'
                });

            });
        }else{
            Blog.findOneAndUpdate({id: req.params.id}, {$set: BlogData},{ useFindAndModify: false }, function (err, blogs) {
                if (err)
                    return res.send({
                        error: true,
                        message: err.message
                    });
                res.send(blogs)

            });
        }
    }
};

exports.deleteBlog = function (req, res) {
    Blog.findOneAndDelete({id: req.params.id},{ useFindAndModify: false }, function (err, blog) {
        if (err)
            res.send({
                error: true,
                message: err.message
            });
        else

        res.json({
            error: false,
            message: 'Blog successfully deleted'
        });
    });
};

exports.seed = async function (req, res) {

    try {
        let Blogs = [];
            for (let j = 0; j < 50; j++) {
                let newBlog = new Blog({
                    id: j,
                    title: faker.lorem.words(3),
                    content: faker.lorem.paragraphs(3),
                    date: faker.date.recent(),
                    comments: faker.datatype.number(15),
                    src: faker.image.image()                   
                });
                let blog = await newBlog.save();
                Blogs.push(blog);
            }
        

        res.status(200).json({Blogs, message: 'Database seeded!'});
    } catch (error) {
        res.status(500).json({message: "seed error " + error.message});
    }

};
