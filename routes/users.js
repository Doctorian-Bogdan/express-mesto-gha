const router = require('express').Router();
const userController = require('../controllers/users');
const userValidation = require('../middlewares/userValidation');

router.get('/', userController.readAllUsers);
router.get('/me', userController.getCurrentUser);
router.get('/:userId', userValidation.validateUserId, userController.readUser);
router.patch('/me', userValidation.validateUserUpdate, userController.updateUser);
router.patch('/me/avatar', userValidation.validateAvatarUpdate, userController.updateAvatar);

module.exports = router;
