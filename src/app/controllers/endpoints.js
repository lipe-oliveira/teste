const express = require('express');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const Classes = require('../models/classes');
const Comments = require('../models/comments');
const auth = require('../../config/auth.json');
const bcrypt = require('bcryptjs');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

// Logar com um usuário (**)
router.post('/users', async (req, res) => {
	try {
		
		const { email, password } = req.body;

		if (!(email && password)) {
			res.status(400).send("Email e/ou Senha necessários!");
		}
		const user = await Users.findOne({ email });
		console.log (user)

		if (user && (await bcrypt.compare(password, user.password))) {
			const token = jwt.sign(
				{},
				auth.secret,
				{
				expiresIn: 86400,
				}
		);

		return res.status(200).json({user, token });
    }
    return res.status(400).send("Credenciais invalidas.");

	} catch (err) {
		console.log(err);
		return res.status(400).send({ error: 'Email não encontrado.' });
	}
});

router.post('/classes', authMiddleware, async (req, res) => {
	const { name, description, video, data_init, data_end, date_created, date_uploaded, total_comments} = req.body;
	
	// Date (formato) => YYYY-MM-DD

	/*
	let new_data_init = new Date(data_init.split('-'));
	new_data_init = new_data_init.toDateString();

	let new_data_end = new Date(data_end.split('-'));
	new_data_end = new_data_end.toDateString();

	let new_date_created = new Date(date_created.split('-'));
	new_date_created = new_date_created.toDateString();

	let new_date_uploaded = new Date(date_uploaded.split('-'));
	new_data_date_uploaded = new_date_uploaded.toDateString();
	*/

	try {
		if (!await Classes.findOne({ name })) {

			const classe = await Classes.create(req.body);

			return res.send({classe});
		}
		else{
			return res.send("Classe já existente.")
		}

	} catch (err) {
		console.log(err);
		return res.status(400).send({ error: 'Falha de registro!' });
	}
});

router.put('/update/:id', authMiddleware, async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

		return res.send(user);
	} catch (err) {
		console.log(`erro: ${err}`);
		return res.status(400).send({ erro: 'Não foi possível completar a ação. Tente novamente!' });
	}
});

// Por um excesso, optei por criar rota para cadastro
router.post('/register', async (req, res) => {
	const { email } = req.body;

	try {
		if (await Users.findOne({ email })) {
			return res.status(400).send({ error: 'E-mail já cadastrado!' });
		}

		let user = await Users.create(req.body);
		console.log(user);

		const token = jwt.sign({ id: user._id }, auth.secret, {
			expiresIn: 86400 
		});

		console.log(token)

		return res.send( {user, token} );
	} catch (err) {
		console.log(err);
		return res.status(400).send({ error: 'Falha de registro!' });
	}
});

router.get('/classes', authMiddleware, async (req, res) => {
	try {
		const {page = 1} = req.query;

		const file = {};

		await (await Classes.paginate({}, {page, limit:50 })).docs
		.forEach(async ( classe, indice) => {
			await (await Comments.find(classe._id)).forEach((item, indice) => {
				if (indice == (parseInt(classe.total_comments) - 1) ){
					file[classe.name] = {classe, last_comment:item.comment, last_comment_date:item.date_created}; 
					return res.send(file);
				}
				
			});
		})

		 
	} catch (err) {
		console.log(err);
	}
});

router.get('/classes/:id', authMiddleware, async (req, res) => {
	try {
		const id = req.params.id;
		console.log(id);

		const classe = await Classes.findById( id );
		let ccomments = await Comments.find({id});
		ccomments = ccomments.reverse();
		console.log(ccomments);

		if (ccomments.length > 2){
			return res.send({classe, comments:[ccomments[0].comment,  ccomments[1].comment, ccomments[2].comment]}); 
		}

		return res.send({classe}); 


		//return res.send({classe, comments:[{"Último comentário": ccomments[0].comment}, {"Penúltimo comentário": ccomments[1].comment}, {"Antepenúltimo comentário": ccomments[2].comment}]}); //.populate('salvos.estabelecimento'));
	} catch (err) {
		console.log(err);
	}
});

router.put('/classes/:id', authMiddleware, async (req, res) => {
	try {
		const id = req.params.id;
		console.log(id);

		return res.send(await Classes.findByIdAndUpdate( id, req.body, { new: true } )); 
	} catch (err) {
		console.log(err);
	}
});

router.delete('/classes/:id', authMiddleware, async (req, res) => {
	try {
		const id = req.params.id;
		console.log(id);

		await Classes.findByIdAndRemove(id);

		return res.send("Classe excluída");

	} catch (err) {
		console.log(`erro: ${err}`);
		return res.status(400).send({ erro: 'Não foi possível deletar a aula.' });
	}
});

router.post('/classes/comments/', authMiddleware, async (req, res) => {
	try {
		const { id_class } = req.body;

		await Comments.create(req.body);

		let {total_comments} = await Classes.findById(id_class);
		total_comments = parseInt(total_comments) + 1;

		await Classes.findByIdAndUpdate(id_class, {total_comments}, {
			new: true
		  })

		const comentarios = await Comments.find({id_class}).populate('id_class');

		return res.send( {comentarios} );
	} catch (err) {
		console.log('erro: ' + err);
		return res.status(400).send({ error: `Falha de autenticação!` });
	}
});

// é o id da aula
router.get('/classes/comments/:id', authMiddleware, async (req, res) => {
	try {
		const id = req.params.id;

		const {page=0} = req.query;

		return res.send(await Comments.find({id}).populate('id_class').skip(page).limit(50));

	} catch (err) {
		console.log('erro: ' + err);
		return res.status(400).send({ error: `Falha de autenticação!` });
	}
});

router.delete('/classes/comments/:id', authMiddleware, async (req, res) => {
	try {
		const id = req.params.id;

		return res.send(await Comments.findByIdAndDelete(id));

	} catch (err) {
		console.log('erro: ' + err);
		return res.status(400).send({ error: `Falha de autenticação!` });
	}
});

module.exports = (app) => app.use('/server', router);
