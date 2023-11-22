const Card = require('../models/card');

function readAllCards(req, res) {
  return Card.find({})
    .then((cards) => res.status(200).send(cards));
}

function createCard(req, res) {
  const owner = req.user._id;

  const {
    name,
    link,
  } = req.body;

  return Card.create({ name, link, owner })
    .then(() => res.status(200).send('Create successful'))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send('Переданы некорректные данные при создании карточки.');
      } else {
        res.status(500).send('Ошибка по умолчанию.');
      }
    });
}

function deleteCard(req, res) {
  return Card.findByIdAndDelete(req.params.cardId)
    .then(() => res.status(200).send('Deleted successful'))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send(`Карточка с указанным ${req.params.cardId} не найдена.`);
      }
    });
}

function updateLike(req, res) {
  // eslint-disable-next-line max-len
  return Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then(() => res.status(200).send('Liked successful'))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send('Переданы некорректные данные для постановки лайка.');
      } else if (err.name === 'CastError') {
        res.status(404).send(`Передан несуществующий ${req.params.cardId} карточки.`);
      } else {
        res.status(500).send('Ошибка по умолчанию.');
      }
    });
}

function deleteLike(req, res) {
  // eslint-disable-next-line max-len
  return Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then(() => res.status(200).send('Disliked successful'))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send('Переданы некорректные данные для снятия лайка.');
      } else if (err.name === 'CastError') {
        res.status(404).send(`Передан несуществующий ${req.params.cardId} карточки.`);
      } else {
        res.status(500).send('Ошибка по умолчанию.');
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
