const router = require('express').Router();

const User = require('../models/user');
const Card = require('../models/card');

router.get('/users', (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users));
});

router.get('/users/:userId', (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send(`Пользователь по указанному ${req.params.userId} не найден.`);
      } else {
        res.status(500).send('Ошибка по умолчанию.');
      }
    });
});

router.post('/users', (req, res) => {
  const {
    name,
    about,
    avatar,
  } = req.body;

  User.create({ name, about, avatar })
    .then(() => res.status(200).send('Create successful'))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send('Переданы некорректные данные при создании пользователя.');
      } else {
        res.status(500).send('Ошибка по умолчанию.');
      }
    });
});

router.get('/cards', (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards));
});

router.post('/cards', (req, res) => {
  const owner = req.user._id;

  const {
    name,
    link,
  } = req.body;

  Card.create({ name, link, owner })
    .then(() => res.status(200).send('Create successful'))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send('Переданы некорректные данные при создании карточки.');
      } else {
        res.status(500).send('Ошибка по умолчанию.');
      }
    });
});

router.delete('/cards/:cardId', (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(() => res.status(200).send('Deleted successful'))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send(`Карточка с указанным ${req.params.cardId} не найдена.`);
      }
    });
});

router.patch('/users/me', (req, res) => {
  const {
    name,
    about,
  } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then(() => res.status(200).send('Updated successful'))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send('Переданы некорректные данные при обновлении профиля.');
      } else if (err.name === 'CastError') {
        res.status(404).send(`Пользователь с указанным ${req.user._id} не найден.`);
      } else {
        res.status(500).send('Ошибка по умолчанию.');
      }
    });
});

router.patch('/users/me/avatar', (req, res) => {
  const { avatar } = req.body;

  if (!avatar) {
    res.status(400).send('Переданы некорректные данные при обновлении аватара.');
  }

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then(() => res.status(200).send('Updated successful'))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send(`Пользователь с указанным ${req.user._id} не найден.`);
      } else {
        res.status(500).send('Ошибка по умолчанию.');
      }
    });
});

router.put('/cards/:cardId/likes', (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
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
});

router.delete('/cards/:cardId/likes', (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
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
});

module.exports = router;
