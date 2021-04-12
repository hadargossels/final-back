const User = require('../models/user');
const {uploader, sendEmail} = require('../utils/index');
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

        //Get mail options
        // let domain = "http://" + req.headers.host;
        // let subject = "New Account Created";
        // let to = user.email;
        // let from = process.env.FROM_EMAIL;
        // let link = "http://" + req.headers.host + "/api/auth/reset/" + user.resetPasswordToken;
        // let html = `<p>Hi ${user.username}<p><br><p>A new account has been created for you on ${domain}. Please click on the following <a href="${link}">link</a> to set your password and login.</p> 
        //           <br><p>If you did not request this, please ignore this email.</p>`

        // await sendEmail({to, from, subject, html});

        // res.status(200).json({message: 'An email has been sent to ' + user.email + '.'});
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
// exports.update = async function (req, res) {
//     try {
//         // const update = req.body;
//         // const id = req.params.id;
//         // const userId = req.user.id;

//         // //Make sure the passed id is that of the logged in user
//         // if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});

//         // const user = await User.findOneAndUpdate({id: req.params.id}, {$set: update},{ useFindAndModify: false }, {new: true});

//         // //if there is no image, return success message
//         // if (!req.file) return res.status(200).json({user, message: 'User has been updated'});

//         // //Attempt to upload to cloudinary
//         // const result = await uploader(req);
//         // const user_ = await User.findByIdAndUpdate(id, {$set: update}, {$set: {profileImage: result.url}}, {new: true});

//         // if (!req.file) return res.status(200).json({user: user_, message: 'User has been updated'});
        
//     //     User.findOneAndUpdate({id: req.params.id}, {$set: req.body},{ useFindAndModify: false }, function (err, users) {
//     //         if (err)
//     //             return res.send({
//     //                 error: true,
//     //                 message: err.message
//     //             });
//     //         res.send(users)

//     //     });
//         const update = req.body;
//     User.findOneAndUpdate(req.params.id, new User(update), function (err, user) {
//         if (err)
//             return res.send({
//                 error: true,
//                 message: err.message
//             });

//         res.json({
//             error: false,
//             message: 'User successfully updated'
//         });
//     })

//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// };

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
            for (let j = 1; j < 51; j++) {
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
                    profileImage: faker.internet.avatar(),
                   
                });
                let user = await newUser.save();
                Users.push(user);
                
            }
        

        res.status(200).json({Users, message: 'Database seeded!'});
    } catch (error) {
        res.status(500).json({message: "seed error " + error.message});
    }

};
