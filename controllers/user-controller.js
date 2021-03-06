const { User, Thought } = require('../models');

const userController = {
    // get all users
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    // get one user by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .select('-__v')

        .then(dbUserData => {
            if (!dbUserData) {
                res.sendStatus(404).json({ message: 'no user with that id found' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    // create user
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    },

    // update user by id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUserData => {
            if (!dbUserData) {
                res.sendStatus(404).json({ message: 'no user found with that id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // delete user (and thoughts created by user)
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'no user found with that id' });
                return;
            } else if (dbUserData.thoughts) {
                return Thought.deleteMany(
                    { _id: { $in: dbUserData.thoughts } }
                );
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // add a friend to friend list
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'no user found with that id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // delete friend
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'no user found with that id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    }
};

module.exports = userController;