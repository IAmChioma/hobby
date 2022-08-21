const mongoose = require('mongoose');
const User = mongoose.model("User");
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const STATUS_OK = parseInt(process.env.STATUS_OK);
const STATUS_BAD_REQUEST = parseInt(process.env.STATUS_BAD_REQUEST);
const STATUS_CREATED = parseInt(process.env.STATUS_CREATED);
const STATUS_NOT_FOUND = parseInt(process.env.STATUS_NOT_FOUND);
const STATUS_SERVER_ERROR = parseInt(process.env.STATUS_SERVER_ERROR);
const MAX_STATUS_299 = parseInt(process.env.MAX_STATUS_299);
STATUS_UNAUTHORIZED = parseInt(process.env.STATUS_UNAUTHORIZED);
const generateHash = function (salt, password) {
    return bycrypt.hash(password, salt);
}
const _sendResponse = function (res, response) {
    res.status(response.status).json(response.message);
}
const _fillResponse = function (response, status, message) {
    console.log(status, message)
    response.status = status;
    response.message = message;
}
const _fillErrorResponse = function (response, status, message) {
    if(response.status >=STATUS_OK && response.status <=MAX_STATUS_299){
        response.status = status;
        response.message = message;
    }
}
const createAUser = function (name, username, password) {
    let newUser = new User({
        name: name,
        username: username,
        password: password
    });
    console.log(newUser);
    return User.create(newUser);
}

const createUser = function (req, res) {
    const response = { status: STATUS_CREATED, message: process.env.INITIAL_MSG }
    console.log(req.body);
    if (req.body && req.body.username && req.body.password) {
        bycrypt.genSalt(10)
            .then((salt) => generateHash(salt, req.body.password))
            .then((hashedPassword) => createAUser(req.body.name, req.body.username, hashedPassword))
            .then((user) => _fillResponse(response, STATUS_CREATED, user))
            .catch(err => _fillResponse(response, STATUS_SERVER_ERROR, err))
            .finally(() => _sendResponse(res, response));

    } else {
        _fillResponse(response, process.env.STATUS_BAD_REQUEST, process.env.LOGIN_REQUIRED_FIELDS)
    }

    if (response.status != STATUS_CREATED) {
        _sendResponse(res, response);
    }


}
const login = function (req, res) {
    const response = { status: STATUS_OK, message: process.env.INITIAL_MSG }

    if (req.body && req.body.username && req.body.password) {

        const loginInfo = { username: req.body.username};
        User.findOne(loginInfo)
            .then((user) =>_checkIfUserFound(user, response))
            .then((checkedUser) => _checkAccountPassword(checkedUser, req.body.password, response ))
            .then((user) => _generateToken(user, response))
            .catch((err) => _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
            .finally(() => _sendResponse(res, response));
    } else {
        _fillResponse(response, STATUS_BAD_REQUEST, process.env.API_PLAYER_REQUIRED_FIELDS);
        _sendResponse(res, response);
    }



}

const _checkIfUserFound = function(user, response){
    console.log(user)
    return new Promise((resolve, reject)=>{
        if(user){
            resolve(user);
        }else{
            _fillResponse(response, STATUS_NOT_FOUND, process.env.USERNAME_INCORRECT);
            reject();
        }
    })

}

const _generateToken = function(user, response){
    const token = jwt.sign({name: user.username}, process.env.SECRET_KEY,{expiresIn: process.env.TOKEN_EXPIRATION_TIME});
    console.log(token, user)
    response.status = STATUS_OK;
    response.message = {token:token}

}
const _checkAccountPassword = function(user, password, response){
   

   return new Promise((resolve, reject)=>{
        bycrypt.compare(password, user.password)
            .then((passwordMatch)=>{
                if(passwordMatch){
                _fillResponse(response, STATUS_OK, user)
                resolve(user);
                }else{
                _fillErrorResponse(response, STATUS_UNAUTHORIZED, process.env.UNAUTHORIZED_MSG)
                reject();
            }})
            .catch(err=> reject(err))
});
}


module.exports = {

    createUser,
    login
}