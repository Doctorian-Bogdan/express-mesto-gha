const Card = require('../models/card');

function readAllCards(req, res) {
  return Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
}

function createCard(req, res) {
  const owner = req.user._id;

  const {
    name,
    link,
  } = req.body;

  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
}

function deleteCard(req, res) {
  return Card.findByIdAndDelete(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      if (card.owner !== req.user._id) {
        res.status(403).send({ message: 'Можно удалять только свои карточки' });
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные. ' });
      } else if (err.message === 'NotValidId') {
        res.status(404).send({ message: `Пользователь с указанным ${req.user._id} не найден.` });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
}

function updateLike(req, res) {
  // eslint-disable-next-line max-len
  return Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else if (err.message === 'NotValidId') {
        res.status(404).send({ message: `Пользователь с указанным ${req.user._id} не найден.` });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
}

function deleteLike(req, res) {
  // eslint-disable-next-line max-len
  return Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      } else if (err.message === 'NotValidId') {
        res.status(404).send({ message: `Пользователь с указанным ${req.user._id} не найден.` });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
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
