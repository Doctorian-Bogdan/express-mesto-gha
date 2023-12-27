const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

function readAllCards(req, res, next) {
  return Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      next(err);
    });
}

function createCard(req, res, next) {
  const owner = req.user._id;

  const {
    name,
    link,
  } = req.body;

  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки. '));
      } else {
        next(err);
      }
    });
}

function deleteCard(req, res, next) {
  return Card.findByIdAndDelete(req.params.cardId)
    .orFail(next(new NotFoundError('Данный пользователь не найден')))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        res.status(403).send({ message: 'Можно удалять только свои карточки' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные. '));
      } else if (err.message === 'NotValidId') {
        next(new NotFoundError(`Пользователь с указанным ${req.user._id} не найден.`));
      } else {
        next(err);
      }
    });
}

function updateLike(req, res, next) {
  // eslint-disable-next-line max-len
  return Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Данная карточка не найдена'));
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка. '));
      } else if (err.message === 'NotValidId') {
        next(new NotFoundError(`Пользователь с указанным ${req.user._id} не найден.`));
      } else {
        next(err);
      }
    });
}

function deleteLike(req, res, next) {
  // eslint-disable-next-line max-len
  return Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Данная карточка не найдена'));
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка. '));
      } else if (err.message === 'NotValidId') {
        next(new NotFoundError(`Пользователь с указанным ${req.user._id} не найден.`));
      } else {
        next(err);
      }
    });
}

module.exports = {
  readAllCards,
  createCard,
  deleteCard,
  updateLike,
  deleteLike,
};
