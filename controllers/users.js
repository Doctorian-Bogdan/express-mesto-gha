const User = require('../models/user');

function readAllUsers(req, res) {
  return User.find({})
    .then((users) => res.status(200).send(users));
}

function readUser(req, res) {
  return User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: `Пользователь по указанному ${req.params.userId} не найден.` });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные. ' });
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
      res.status(200).send(user);
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

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
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
}

function updateAvatar(req, res) {
  const { avatar } = req.body;

  if (!avatar) {
    res.status(400).send('Переданы некорректные данные при обновлении аватара.');
  }

  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then(() => res.status(200).send('Updated successful'))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send(`Пользователь с указанным ${req.user._id} не найден.`);
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
