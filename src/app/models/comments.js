const mongoose = require('../../database/index');
const bcrypt = require('bcryptjs');
const { Double, Int32 } = require('mongodb');
const mongoose_paginate = require('mongoose-paginate');

const schema = new mongoose.Schema({
	id_class: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Classes'
	},

	comment: {
		type: String,
		required: true
	},

	date_created: {
		type: Date,
		default: Date.now
	}
});

schema.plugin(mongoose_paginate);

const User = mongoose.model('Comments', schema);
module.exports = User;
