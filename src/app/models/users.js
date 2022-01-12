const mongoose = require('../../database/index');
const bcrypt = require('bcryptjs');
let mongoose_paginate = require('mongoose-paginate');

const schema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: { 	
		type: String,
		unique: true,
		required: true,
		lowercase: true
	},
	password: {
		type: String,
		required: true,
		//select: false
	},
	
});

schema.pre('save', async function (next) {
	const hash = await bcrypt.hash(this.password, 10);
	this.password = hash;

	next();
});

schema.plugin(mongoose_paginate);

const User = mongoose.model('Users', schema);
module.exports = User;
