const jwt = require('jsonwebtoken');
const auth = require('../../config/auth.json');

module.exports = (req, res, next) => {
	const authHeader = req.headers.authorization;
	const token = authHeader;

	if (!authHeader) {
		return res.status(400).send({ error: 'Token não providenciado!' });
	}

	//authHeader.replace ("Bearer ", "");
	const parts = authHeader.split(' ');
	console.log(authHeader);

	if (!parts.length === 2) {
		return res.status(400).send({ error: 'Token erro!' });
	}

	jwt.verify(token, auth.secret, (err, decoded) => {
		if (err) {
			return res.status(401).send({ erro: 'Token errado!' });
		}

		console.log(req.userId, decoded.id);
		req.userId = decoded.id;
		
		//res.status(200).send(decoded);

		return next();
	});

	/*

	const [scheme, token] = parts;
	if (/^Bearer$/i.test(scheme)) {
		jwt.verify(token, auth.secret, (err, decoded) => {
			if (err) {
				return res.status(401).send({ erro: 'Token errado!' });
			}
	
			console.log(req.userId, decoded.id);
			req.userId = decoded.id;
	
			return next();
		});
		
	}
	return res.status(401).send({ erro: 'Token malformatado!' });
	*/
};
