const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const { OK, CREATED_OK } = require('../utils/constants');

function login(req, res, next) {
  const {
    email,
    password,
  } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
}

function readAllUsers(req, res, next) {
  return User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(next);
}

function readUser(req, res, next) {
  return User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError(`Пользователь с указанным _id: ${req.params.userId} не найден.`));
        return;
      }
      res.status(OK).send(user);
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

function createUser(req, res, next) {
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
      res.status(CREATED_OK).send({
        email,
        name,
        about,
        avatar,
        _id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email существует.'));
      } else {
        next(err);
      }
    });
}

function updateUser(req, res, next) {
  const {
    name,
    about,
  } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else if (err.message === 'NotValidId') {
        next(new NotFoundError(`Пользователь с указанным ${req.user._id} не найден.`));
      } else {
        next(err);
      }
    });
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;

  if (!avatar) {
    next(new BadRequestError('Переданы некорректные данные.'));
  }

  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError(`Пользователь с указанным _id: ${req.params.userId} не найден.`));
        return;
      }
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError(`Пользователь с указанным _id: ${req.params.userId} не найден.`));
      } else {
        next(err);
      }
    });
}

function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError(`Пользователь с указанным _id: ${req.params.userId} не найден.`));
        return;
      }
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      }
      next(err);
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
