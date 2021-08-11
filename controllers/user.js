const User = require('../models/user');
const faker = require('faker');

// @route GET admin/user
// @desc Returns all users
// @access Public
exports.index = async function (req, res) {
    const users = await User.find({});
    res.setHeader('Content-Range', `${users.length}`)
    res.send(users)
};

// @route POST api/user
// @desc Add a new user
// @access Public
exports.store = async (req, res) => {
    try {
        let {email} = req.body;
        // Make sure this account doesn't already exist
        let user = await User.findOne({email});

        if (user) return res.status(401).json({message: 'The email address you have entered is already associated with another account. You can change this users role instead.'});

        let password = '_' + Math.random().toString(36).substr(2, 9); //generate a random password
        let newUser = new User({...req.body, password});

        let user_ = await newUser.save();

        //Generate and set password reset token
        user_.generatePasswordReset();

        // Save the updated user object
        await user_.save();
        res.status(200).json({user: newUser});

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
};

// @route GET api/user/{id}
// @desc Returns a specific user
// @access Public
exports.show = async function (req, res) {
    User.findOne({ id: req.params.id}, function (err, users) {
        if (err)
            res.send(err)
        else{
            res.send(users)
        }
    })
};

// @route PUT api/user/{id}
// @desc Update user details
// @access Public

exports.update = async function (req, res) {
    try {
        let UserData = req.body
        const filter = { id: req.params.id };

        let doc = await User.findOne({ id: req.params.id });
        await User.updateOne(filter, {...UserData}, async function (err, users) {
            if (err) {
                return res.send({
                                    error: true,
                                    message: err.message
                                });
            }
            doc.password = req.body.password;
            await doc.save();
            res.status(200).json({message: 'User has been updated', user: doc});
        });
        
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
    

};

exports.update = function (req, res) {

    let UserData = req.body

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({
            error: true,
            message: 'Please provide all required field'
        });
    } else {
        if(req.method === 'PATCH'){
            User.patchUpdate(req.params.id, new User(UserData), function (err, invoice) {
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
            User.findOneAndUpdate({id: req.params.id}, {$set: UserData},{ useFindAndModify: false }, function (err, invoices) {
                if (err)
                    return res.send({
                        error: true,
                        message: err.message
                    });
                res.send(invoices)

            });
        }
    }
};

// @route DESTROY api/user/{id}
// @desc Delete User
// @access Public
exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        const user_id = req.user._id;

        //Make sure the passed id is that of the logged in user
        if (user_id.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to delete this data."});

        await User.findByIdAndDelete(id);
        res.status(200).json({message: 'User has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.seed = async function (req, res) {

    try {
        let Users = [];
            for (let j = 0; j < 50; j++) {
                let newUser = new User({
                    id: j,
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    country: faker.address.country(),
                    city: faker.address.city(),
                    address: faker.address.streetAddress(),
                    zip: faker.address.zipCode(),
                    phone: faker.phone.phoneNumber(),
                    role: faker.random.arrayElement(["admin", "custumer"]),
                    active: faker.datatype.boolean(),
                    profileImage: faker.internet.avatar()
                   
                });
                let user = await newUser.save();
                Users.push(user);
            }
        

        res.status(200).json({Users, message: 'Database seeded!'});
    } catch (error) {
        res.status(500).json({message: "seed error " + error.message});
    }

};
