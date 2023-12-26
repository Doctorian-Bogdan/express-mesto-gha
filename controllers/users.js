const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

function login(req, res) {
  const {
    email,
    password,
  } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(() => {
      res.status(401).send({ message: 'Присланный токен некорректен' });
    });
}

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
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const { _id } = user;
      res.status(201).send({
        email,
        name,
        about,
        avatar,
        _id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else if (err.code === 11000) {
        res.status(409).send({ message: 'Пользователь с таким email уже существует' });
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

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
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

function getCurrentUser(req, res) {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: `Пользователь с указанным ${req.user._id} не найден.` });
      }
      res.status(200).send(user);
    })
    .catch(() => {
      res.status(400).send({ message: 'Переданы некорректные данные при получении профиля.' });
    });
}

module.exports = {
  login,
  readAllUsers,
  readUser,
  createUser,
  updateUser,
  updateAvatar,
  getCurrentUser,
};
