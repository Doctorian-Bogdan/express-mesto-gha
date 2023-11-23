const router = require('express').Router();
const userController = require('../controllers/users');

router.get('/', userController.readAllUsers);
router.get('/:userId', userController.readUser);
router.post('/', userController.createUser);
router.patch('/me', userController.updateUser);
router.patch('/me/avatar', userController.updateAvatar);

module.exports = router;
