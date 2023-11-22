const router = require('express').Router();
const cardController = require('../controllers/cards');

router.get('/', cardController.readAllCards);
router.post('/', cardController.createCard);
router.delete('/:cardId', cardController.deleteCard);
router.put('/:cardId/likes', cardController.updateLike);
router.delete('/:cardId/likes', cardController.deleteLike);

module.exports = router;
