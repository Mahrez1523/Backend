const UserModel = require('../models/user.model')
const ObjectId = require('mongoose').Types.ObjectId

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password')
    res.status(201).json(users)
}

module.exports.userInfo = async (req, res) => {
    console.log(req.params.id);

    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Unknown ID: ' + req.params.id);
    }

    try {
        const user = await UserModel.findById(req.params.id).select('-password');
        if (user) {
            res.send(user);
        } else {
            res.status(404).send('User not found ' + user);
        }
    } catch (err) {
        console.log('Unknown ID: ' + err);
        res.status(500).send('Server error');
    }
};


module.exports.updateUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    name: req.body.name,
                },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.send(updatedUser);
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

module.exports.deleteUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        await UserModel.deleteOne({ _id: req.params.id })
        res.status(200).json({ message: "Successfuly delete" })
    }
    catch (err) {
        console.log('error' + err)
        return res.status(500).json({ message: err });
    }


}