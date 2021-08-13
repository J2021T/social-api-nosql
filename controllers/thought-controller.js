const { Thought, User } = require('../models');

const thoughtController = {
    // get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    // get a thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'no thought found with that id' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    // create a thought and add it to user thoughts array
    createThought({ body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: _id } },
                { new: true, runValidators: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'no user found with that id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // update a thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'no thought found with that id' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    // delete a comment
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id})
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'no thought found with that id'});
            }
            return User.findOneAndUpdate(
                { username: dbThoughtData.username },
                { $pull: { thoughts: params.id } },
                { new: true }
            )
        }) 
    },

    // create a reaction to be stored in thoughts reactions field
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId},
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'no thought found with that id'});
            }
            res.json(dbThoughtData)
        })
        .catch(err => res.json(err));
    },

    // delete a reaction
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: params.reactionId } },
            { new: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'no thought found with that id'});
            }
            res.json(dbThoughtData)
        })
        .catch(err => res.json(err));
    }
};

module.exports = thoughtController;