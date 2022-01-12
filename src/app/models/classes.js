const mongoose = require('../../database/index');
const mongoose_paginate = require('mongoose-paginate');

const schema = new mongoose.Schema({
	name: {
		type: String,
		required: false
	},
	description: {
		type: String,
		required: false
	},
	
	video: {
		type: String,
		required: false
	},

	data_init: {
		type: Date,
	},

	data_end: {
		type: Date,
	},

	date_created: {
		type: Date,
		default: Date.now
	},

	date_uploaded: {
		type: Date,
	},
	
	total_comments: {
		type: Number,
		validate:{
			validator: Number.isInteger,
			message: '{Num} não é valor inteiro'
		}

	}
});

schema.plugin(mongoose_paginate);

const rest = mongoose.model('Classes', schema);
module.exports = rest;
