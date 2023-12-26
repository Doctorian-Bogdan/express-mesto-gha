const router = require('express').Router();
const cardController = require('../controllers/cards');
const cardValidation = require('../middlewares/cardValidation');

router.get('/', cardController.readAllCards);
router.post('/', cardValidation.validateCard, cardController.createCard);
router.delete('/:cardId', cardValidation.validateCardId, cardController.deleteCard);
router.put('/:cardId/likes', cardValidation.validateCardId, cardController.updateLike);
router.delete('/:cardId/likes', cardValidation.validateCardId, cardController.deleteLike);

module.exports = router;
