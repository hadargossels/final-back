let User = require("../models/user")
let Token = require("../models/token")
let bcrypt = require('bcrypt')
const faker = require('faker');
const saltRounds = 10

exports.findAll = function (req, res) {
    User.find({},function (err, users) {
        if (err)
            {res.send(err)
            console.log(err)}
        else {
            res.setHeader('Content-Range', `${users.length}`)
            res.send(users)
        }
    })
}


exports.addUser = function (req, res) {

    let UserData = {
        id: req.body.id,    
        src: req.body.src,    
        price: req.body.price,    
        name: req.body.name,
        gallery1: req.body.gallery1,
        gallery2: req.body.gallery2,
        gallery3: req.body.gallery3,
        description: req.body.description,
        stock: req.body.stock,
        rating: req.body.rating,
        raters: req.body.raters,
        related1: req.body.related1,
        related2: req.body.related2,
        related3: req.body.related3,
        category: req.body.category,
        brand: req.body.brand,
        color: req.body.color,
        priceRange: req.body.priceRange,
        date: req.body.date,
        featured: req.body.featured
    }

    User.create(UserData, function (err) {
        if (err)
            res.send(err)

        else
            res.json({error:false, message: 'User Added successfully'})
    })
}

exports.findOneUser = function (req, res) {
    User.findOne({ id: req.params.id}, function (err, users) {
        if (err)
            res.send(err)
        else{
            res.send(users)
        }
    })
}

exports.update = function (req, res) {

    let UserData = {
        id: req.params.id,    
        src: req.body.src,    
        price: req.body.price,    
        name: req.body.name,
        gallery1: req.body.gallery1,
        gallery2: req.body.gallery2,
        gallery3: req.body.gallery3,
        description: req.body.description,
        stock: req.body.stock,
        rating: req.body.rating,
        raters: req.body.raters,
        related1: req.body.related1,
        related2: req.body.related2,
        related3: req.body.related3,
        category: req.body.category,
        brand: req.body.brand,
        color: req.body.color,
        priceRange: req.body.priceRange,
        date: req.body.date,
        featured: req.body.featured
    }
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({
            error: true,
            message: 'Please provide all required field'
        });
    } else {
        if(req.method === 'PATCH'){
            User.patchUpdate(req.params.id, new User(UserData), function (err, user) {
                if (err)
                    return res.send({
                        error: true,
                        message: err.message
                    });

                res.json({
                    error: false,
                    message: 'User successfully updated'
                });

            });
        }else{
            User.findOneAndUpdate({id: req.params.id}, {$set: UserData},{ useFindAndModify: false }, function (err, users) {
                console.log(UserData)
                if (err)
                    return res.send({
                        error: true,
                        message: err.message
                    });
                res.send(users)

            });
        }
    }
};

exports.deleteUser = function (req, res) {
    User.findOneAndDelete({id: req.params.id},{ useFindAndModify: false }, function (err, user) {
        if (err)
            res.send({
                error: true,
                message: err.message
            });
        else

        res.json({
            error: false,
            message: 'User successfully deleted'
        });
    });
};


exports.createNewUser = function(req,res){
    let username = req.body.username
    let password = req.body.password

    if (req.body.password) {
            bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                if (err)
                    console.log(err)
                password = hash

                const user = {
                    username: 'gagi',
                    lastname: 'shmagi',
                    pass: password
                }

                const {pass,...other} = user
                console.log(other)

                const token = Token.generateAccessToken(other)

                return res.json({
                    token
                })

            })
    }




}

exports.seed = async function (req, res) {

    try {
        let Users = [];
            for (let j = 0; j < 50; j++) {
                let newUser = new User({
                    id: j,
                    src: faker.image.image(),
                    price: faker.commerce.price(1,40),
                    name: faker.commerce.userName(),
                    gallery1: faker.image.image(),
                    gallery2: faker.image.image(),
                    gallery3: faker.image.image(),
                    description: faker.commerce.userDescription(),
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
                let user = await newUser.save();
                Users.push(user);
            }
        

        res.status(200).json({Users, message: 'Database seeded!'});
    } catch (error) {
        res.status(500).json({message: "seed error " + error.message});
    }

};
