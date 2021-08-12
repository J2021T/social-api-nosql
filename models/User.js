const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: "Please enter a username",
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: "Please enter a username",
            match: [/.+\@.+\..+/, 'Please fill a valid email address']
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
            gettters: true
        },
        id: false
    }
);

// gets friend count for a user
UserSchema.virtual('friendCount').get(function() {
    return this.friends.reduce.length;
});

const User = model('User', UserSchema);

module.exports = User;