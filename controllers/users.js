const User = require('../models/user');

function readAllUsers(req, res) {
  return User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => {
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
}

function readUser(req, res) {
  return User.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
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

function createUser(req, res) {
  const {
    name,
    about,
    avatar,
  } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
}

function updateUser(req, res) {
  const {
    name,
    about,
  } = req.body;

  return User.findByIdAndUpdate('654d70aab8892557cd3db373', { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.message === 'NotValidId') {
        res.status(404).send({ message: `Пользователь с указанным ${req.user._id} не найден.` });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;

  if (!avatar) {
    res.status(400).send('Переданы некорректные данные при обновлении аватара.');
  }

  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: `Пользователь с указанным ${req.user._id} не найден.` });
      } else {
        res.status(500).send('Ошибка по умолчанию.');
      }
    });
}

module.exports = {
  readAllUsers,
  readUser,
  createUser,
  updateUser,
  updateAvatar,
};
