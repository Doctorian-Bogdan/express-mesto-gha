const regExp = /^(http:\/\/|https:\/\/)(www\.)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
const ERROR_CODE = 400;
const SERVER_ERROR = 500;
const ERROR_NOT_FOUND = 404;
const UNAUTHORIZED = 401;
const OK = 200;
const CREATED_OK = 201;

module.exports = {
  ERROR_CODE, SERVER_ERROR, ERROR_NOT_FOUND, UNAUTHORIZED, OK, CREATED_OK, regExp,
};
