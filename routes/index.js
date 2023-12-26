const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { auth } = require('../middlewares/auth');
const userValidation = require('../middlewares/userValidation');
const { createUser, login } = require('../controllers/users');

router.post('/signup', userValidation.validateUserInfo, createUser);
router.post('/signin', userValidation.validateUserAuthentication, login);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена.' });
});

module.exports = router;
