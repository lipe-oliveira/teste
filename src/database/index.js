const mongoose = require('mongoose');

//mongoose.connect('mongodb+srv://deploy:homemaranha@cluster0-bgfbm.mongodb.net/test?retryWrites=true&w=majority');
mongoose.connect('mongodb+srv://teste:teste@teste.nyqxa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

mongoose.Promise = global.Promise;

module.exports = mongoose;
