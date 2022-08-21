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
    if(response.status >=STATUS_OK && response.status <=MAX_STATUS_299){
        response.status = status;
        response.message = message;
    }
}

const _checkIfTeamFound = function(team, response){
    return new Promise((resolve, reject)=>{
        if(team){
            resolve(team);
        }else{
            _fillResponse(response, STATUS_NOT_FOUND, process.env.NO_TEAM_WITH_ID_FOUND);
            reject();
        }
    })

}

const _returnNotFound = function (res, response, status, message) {
    _fillResponse(response, status, message);
    _sendResponse(res, response);
    return;
}
const _geoSearch = function (req, res, offset, count) {
    const lng = parseFloat(req.query.lng);
    const lat = parseFloat(req.query.lat, process.env.CONVERSION_BASE);
    let maxDist = parseInt(process.env.MAXIMUM_DISTANCE)
    let minDist = parseInt(process.env.MINIMUM_DISTANCE)
    if (req.query.maxDist) {
        maxDist = parseInt(req.query.maxDist)
    }
    if (req.query.minDist) {
        minDist = parseInt(req.query.minDist)
    }
    if(isNaN(maxDist) || isNaN(minDist) || isNaN(lat) || isNaN(lng)){
        res.status(STATUS_BAD_REQUEST).json(process.env.INVALID_QUERY_DISTANCE);
        return;
    }
    const point = {
        type: process.env.GEO_SEARCH_QUERY_CORDINATE_TYPE,
        coordinates: [lat, lng]
    }
    const searchQuery = {
        "coordinates": {
            $near: {
                $geometry: point,
                $maxDistance: maxDist,
                $minDistance: minDist
            }
        }
    };
    console.log(searchQuery);
    const response = { status: process.env.STATUS_OK, message: process.env.INITIAL_MSG };
    Team.find(searchQuery).skip(offset).limit(count)
        .then((teams) => _fillResponse(response, STATUS_OK, teams))
        .catch((err) => _fillResponse(response, STATUS_SERVER_ERROR, err))
        .finally(() => _sendResponse(res, response));


}
const _searchByName = function (req, res, offset, count) {
    const searchQuery = {
        "country": {$regex: req.query.search, $options:"i" }
        };

    console.log(searchQuery);
    const response = { status: process.env.STATUS_OK, message: process.env.INITIAL_MSG };
    Team.find(searchQuery).skip(offset).limit(count)
        .then((teams) => _fillResponse(response, STATUS_OK, teams))
        .catch((err) => _fillResponse(response, STATUS_SERVER_ERROR, err))
        .finally(() => _sendResponse(res, response));


}

const getAllTeams = function (req, res) {
    const MAX_COUNT = parseInt(process.env.MAX_COUNT, process.env.CONVERSION_BASE);
    let count = parseInt(process.env.COUNT, process.env.CONVERSION_BASE);
    let offset = parseInt(process.env.OFFSET, process.env.CONVERSION_BASE);

    if (req.query && req.query.count) {
        count = parseInt(req.query.count, process.env.CONVERSION_BASE);
    }
    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, process.env.CONVERSION_BASE)
    }
    if(isNaN(count) || isNaN(offset)){
        res.status(STATUS_BAD_REQUEST).json(process.env.INVALID_QUERY_COUNT);
        return;
    }
    if (count > MAX_COUNT) {
        res.status(STATUS_BAD_REQUEST).json({ message: process.env.MAX_COUNT_ERROR_MSG });
        return;
    };

    if (req.query && req.query.search) {
        _searchByName(req, res, offset, count);
        return;
    }
    if (req.query && req.query.lat && req.query.lng) {
        _geoSearch(req, res, offset, count);
        return;
    }
    const response = { status: process.env.STATUS_OK, message: process.env.INITIAL_MSG };
    Team.find().skip(offset).limit(count)
        .then((teams) => _fillResponse(response, STATUS_OK, teams))
        .catch((err) => _fillResponse(response, STATUS_SERVER_ERROR, err))
        .finally(() => _sendResponse(res, response));

};

const getOne = function (req, res) {
    const id = req.params.id;
    const response = { status: STATUS_OK, message: process.env.INITIAL_MSG };
    if (!mongoose.isValidObjectId(id)) {
        _fillResponse(response, STATUS_BAD_REQUEST, process.env.INVALID_OBJECT_ID);
        _sendResponse(res, response)
    }
    else {
        Team.findById(id)
            .then((team) => _checkIfTeamFound(team, response))
            .then((team) => _fillResponse(response, STATUS_OK, team))
            .catch((err) => _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
            .finally(() => _sendResponse(res, response));

    }


}

const createTeam = function (req, res) {
    console.log(req.body)
    const response = { status: STATUS_CREATED, message: process.env.INITIAL_MSG }
    if (req.body && req.body.year && req.body.country) {

        const players = req.body.players ? req.body.players : [];
        const team = { country: req.body.country, year: parseInt(req.body.year), players: players,
             coordinates:[req.body.latitude, req.body.longitude] };
        Team.create(team)
            .then((newTeam) => _fillResponse(response, STATUS_CREATED, newTeam))
            .catch((err) => _fillResponse(response, STATUS_SERVER_ERROR, err))
            .finally(() => _sendResponse(res, response));

    }
    else {
        _fillResponse(response, STATUS_BAD_REQUEST, process.env.API_REQUIRED_FIELDS);
        _sendResponse(res,response);
    }
}


const deleteOne = function (req, res) {
    const id = req.params.id;
    const response = { status: STATUS_OK, message: process.env.INITIAL_MSG }

    if (!mongoose.isValidObjectId(id)) {
        _fillResponse(response, STATUS_BAD_REQUEST, process.env.INVALID_OBJECT_ID);
        _sendResponse(res, response);
    }
    else {
        Team.findByIdAndDelete(id)
            .then((team) => _checkIfTeamFound(team, response))
            .then((deletedTeam) => _fillResponse(response, STATUS_OK, process.env.TEAM_DELETED_SUCCESSFULLY))
            .catch((err) => _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
            .finally(() => _sendResponse(res, response))
    }



}

const updateOne = function (req, res, callbackFunction) {
    const id = req.params.id;
    const response = { message: process.env.INITIAL_MSG, status: STATUS_OK };

    if (!mongoose.isValidObjectId(id)) {
        _fillResponse(response, STATUS_BAD_REQUEST, process.env.INVALID_OBJECT_ID);
    } else {
        Team.findById(id)
            .then((team) =>_checkIfTeamFound(team, response))
            .then((team) => callbackFunction(req, team))
            .then((updatedTeam) =>_fillResponse(response, STATUS_OK, updatedTeam))
            .catch((err) => _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
            .finally(() => _sendResponse(res, response))

    }
    if (response.status != STATUS_OK) {
        _sendResponse(res, response);
    }
}

const partiallyUpdate = function (req, res) {
    updateOne(req, res, _partiallyUpdate);
}

const fullyUpdate = function (req, res) {
    if (req.body && req.body.year && req.body.country) {
        updateOne(req, res, _fullUpdate);
    } else {
        res.status(STATUS_BAD_REQUEST).json(process.env.API_REQUIRED_FIELDS);

    }
}

const _fullUpdate = function (req, team) {
    team.year = req.body.year;
    team.country = req.body.country;
    if (req.body && req.body.latitude) {
        team.coordinates[0] = req.body.latitude;
    };
    if (req.body && req.body.longitude) {
        team.coordinates[1] = req.body.longitude;
    }
    return team.save();

}
const _partiallyUpdate = function (req, team) {

    if (req.body && req.body.year) {
        team.year = req.body.year;
    };
    if (req.body && req.body.country) {
        team.country = req.body.country;
    }
    if (req.body && req.body.latitude) {
        team.coordinates[0] = req.body.latitude;
    };
    if (req.body && req.body.longitude) {
        team.coordinates[1] = req.body.longitude;
    }

    return team.save();

}

const getTotalTeams = function (req, res) {
    const response = {
        status: STATUS_OK,
        message: process.env.INITIAL_MSG
    };
    Team.countDocuments()
    .then((totalCities)=> _fillResponse(response, STATUS_OK, totalCities))
    .catch((err)=> _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
    .finally(()=> _sendResponse(res,response));

}

module.exports = {
    getAllTeams,
    getOne,
    createTeam,
    deleteOne,
    partiallyUpdate,
    fullyUpdate,
    getTotalTeams
}