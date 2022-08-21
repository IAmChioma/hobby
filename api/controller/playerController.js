const mongoose = require('mongoose');

const Team = mongoose.model(process.env.DB_NAME_TEAM);

const STATUS_OK = parseInt(process.env.STATUS_OK);
const STATUS_BAD_REQUEST = parseInt(process.env.STATUS_BAD_REQUEST);
const STATUS_CREATED = parseInt(process.env.STATUS_CREATED);
const STATUS_NO_CONTENT = parseInt(process.env.STATUS_NO_CONTENT);
const STATUS_NOT_FOUND = parseInt(process.env.STATUS_NOT_FOUND);
const STATUS_SERVER_ERROR = parseInt(process.env.STATUS_SERVER_ERROR);
const MAX_STATUS_299 = parseInt(process.env.MAX_STATUS_299);

const _sendResponse = function (res, response) {
    res.status(response.status).json(response.message);
}
const _fillResponse = function (response, status, message) {
    response.status = status;
    response.message = message;
}

const _fillErrorResponse = function (response, status, message) {
    if (response.status >= STATUS_OK && response.status <= MAX_STATUS_299) {
        response.status = status;
        response.message = message;
    }
}
const _checkIfTeamFound = function (team, response) {
    return new Promise((resolve, reject) => {
        if (team) {
            resolve(team);
        } else {
            _fillResponse(response, STATUS_NOT_FOUND, process.env.NO_TEAM_WITH_ID_FOUND);
            reject();
        }
    })

}
const _checkIfPlayerFound = function (team, playerId, response) {
    return new Promise((resolve, reject) => {
        if (team.players.id(playerId)) {
            resolve(team.players.id(playerId));
        } else {
            _fillResponse(response, STATUS_NOT_FOUND, process.env.NO_PLAYER_WITH_ID_FOUND);
            reject();
        }
    })

}
const createPlayer = function (req, res) {
    const response = { status: process.env.STATUS_CREATED, message: process.env.INITIAL_MSG };
    if (req.body && req.body.name) {

        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            _fillResponse(response, STATUS_BAD_REQUEST, process.env.INVALID_OBJECT_ID);
            _sendResponse(res, response);
            return;

        }
        Team.findById(id)
            .then((team) => _checkIfTeamFound(team, response))
            .then((teamFound) => _createPlayer(req, res, teamFound))
            .then((createdPlayer) => _fillResponse(response, STATUS_CREATED, createdPlayer))
            .catch((err) => _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
            .finally(() => _sendResponse(res, response));
    } else {
        _fillResponse(response, STATUS_BAD_REQUEST, process.env.API_PLAYER_REQUIRED_FIELDS);
        _sendResponse(res, response);
    }


};
const deletePlayer = function (req, res) {
    const id = req.params.id;
    const playerId = req.params.playerid;
    const response = { status: process.env.STATUS_OK, message: process.env.INITIAL_MSG };
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(playerId)) {
        _fillResponse(response, STATUS_BAD_REQUEST, process.env.INVALID_OBJECT_ID);
        _sendResponse(res, response);

    }

    else {
        Team.findById(id).select('players')
            .then((team) => _checkIfTeamFound(team, response))
            .then((teamFound) => _deletePlayer(req, teamFound, response))
            .then((deletedPlayer) => _fillResponse(response, STATUS_OK, process.env.PLAYER_DELETED_SUCCESSFULLY))
            .catch((err) => _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
            .finally(() => _sendResponse(res, response));

    }
};
const getAllPlayers = function (req, res) {
    const id = req.params.id;
    const response = { status: process.env.STATUS_OK, message: process.env.INITIAL_MSG };
    if (!mongoose.isValidObjectId(id)) {
        _fillResponse(response, STATUS_BAD_REQUEST, process.env.INVALID_OBJECT_ID);
        _sendResponse(res, response);

    }

    else {
        Team.findById(id).select('players')
            .then((team) => _checkIfTeamFound(team, response))
            .then((players) => _fillResponse(response, STATUS_OK, players))
            .catch((err) => _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
            .finally(() => _sendResponse(res, response));
    }
};
const getAPlayer = function (req, res) {
    const id = req.params.id;
    const playerId = req.params.playerid;
    const response = { status: process.env.STATUS_OK, message: process.env.INITIAL_MSG };
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(playerId)) {
        _fillResponse(response, STATUS_BAD_REQUEST, process.env.INVALID_OBJECT_ID);
        _sendResponse(res, response);
    }

    else {
        Team.findById(id).select('players')
            .then((team) => _checkIfTeamFound(team, response))
            .then((teamFound) => _checkIfPlayerFound(teamFound, playerId, response))
            .then((foundPlayer) => _fillResponse(response, STATUS_OK, foundPlayer))
            .catch((err) => _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
            .finally(() => _sendResponse(res, response));
    }
};
const fullUpdate = function (req, res) {
const response = { status: process.env.STATUS_CREATED, message: process.env.INITIAL_MSG };
if (req.body && req.body.name) {
    _updateOne(req,res,_fullUpdate);
} else {
    _fillResponse(response, STATUS_BAD_REQUEST, process.env.API_PLAYER_REQUIRED_FIELDS);
    _sendResponse(res, response);
}

};
const _updateOne = function (req, res, callbackFunction) {
    const id = req.params.id;
    const playerId = req.params.playerid;
    const response = { message: process.env.INITIAL_MSG, status: process.env.STATUS_OK };
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(playerId)) {
        _fillResponse(response, STATUS_BAD_REQUEST, process.env.INVALID_OBJECT_ID);
        _sendResponse(res, response);
    }

    else {
        Team.findById(id).select('players')
            .then((team) => _checkIfTeamFound(team, response))
            .then((teamFound) => callbackFunction(req, response, teamFound))
            .then((updatedPlayer) => _fillResponse(response, STATUS_OK, updatedPlayer))
            .catch((err) => _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
            .finally(() => _sendResponse(res, response));
    }
};
const partiallyUpdatePlayer = function (req, res) {
    _updateOne(req,res,_partiallyUpdatePlayer);

};
const _createPlayer = function (req, res, team) {
    const player = {};
    player.name = req.body.name;
    player.start_date = req.body.start_date;
    team.players.push(player);
    return team.save();

};
const _deletePlayer = function (req, team, response) {
    const playerId = req.params.playerid;
    return new Promise((resolve, reject) => {
        if (!team.players.id(playerId)) {
            _fillResponse(response, process.env.STATUS_NOT_FOUND, process.env.INVALID_OBJECT_ID_FOR_PLAYER);
            reject()
        } else {
            team.players.id(playerId).remove();
            resolve(team.save());
        }
    })

}

const _fullUpdate = function (req, response, team) {
    const playerId = req.params.playerid;
    return new Promise((resolve, reject) => {
        if (!team.players.id(playerId)) {
            _fillResponse(response, process.env.STATUS_NOT_FOUND, process.env.NO_PLAYER_WITH_ID_FOUND);
            reject()
        } else {
            const player = team.players.id(playerId);
            player.name = req.body.name;
            player.start_date = req.body.start_date;
            resolve(team.save());
        }
    })

};
const _partiallyUpdatePlayer = function (req, response, team) {
    const playerId = req.params.playerid;
    return new Promise((resolve, reject) => {
        if (!team.players.id(playerId)) {
            _fillResponse(response, process.env.STATUS_NOT_FOUND, process.env.NO_PLAYER_WITH_ID_FOUND);
            reject();
        } else {
            const player = team.players.id(playerId);
            if (req.body.name) {
                player.name = req.body.name;
            }
            if (req.body.start_date) {
                player.start_date = req.body.start_date;
            }
            resolve(team.save());
        }
    })

};

const getTotalPlayers = function (req, res) {
    const response = {
        status: STATUS_OK,
        message: process.env.INITIAL_MSG
    };
    Team.findById(id).select('players')
    .then((team) => _checkIfTeamFound(team, response))
    .then((team)=> _fillResponse(response, STATUS_OK, team.players.length))
    .catch((err)=> _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
    .finally(()=> _sendResponse(res,response));
}

module.exports = {
    createPlayer,
    deletePlayer,
    getAPlayer,
    getAllPlayers,
    fullUpdate,
    partiallyUpdatePlayer,
    getTotalPlayers
}