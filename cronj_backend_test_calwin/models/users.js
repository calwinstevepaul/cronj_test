const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const joiUsers = Joi.object({
    _id: Joi.string().meta({ _mongoose: { _id: "ObjectId", ref: "Users" } }),
    name: {
        first:  Joi.string().required(),
        last:  Joi.string().required(),
        middle:  Joi.string().allow('').allow(null).optional()
    },
    dob:  Joi.string().required(),
    email:  Joi.string().required(),
    phone:  Joi.string().required(),
    occupation:  Joi.string().required(),
    company:  Joi.string().required(),
    password:  Joi.string().required(),
    createdOn: Joi.date()
});

const validateUsers = async function (orderDetails) {
    return joiUsers.validate(JSON.parse(JSON.stringify(orderDetails)));
}

const mongooseUsers = new Schema({
    _id: { type: ObjectId, ref: 'Users' },
    createdOn: Date,
    name: {
        first: String,
        last: String,
        middle: String
    },
    dob: String,
    email: {
        unique: true,
        type: String
    },
    phone: {
        unique: true,
        type: String
    },
    occupation: String,
    company: String,
    password: String

});

const Users = mongoose.model("Users", mongooseUsers);

module.exports.validateUsers = validateUsers;
module.exports.Users = Users;