const express  =require('express');
const teamController = require('../controller/teamController');
const playerController = require('../controller/playerController');
const authController = require('../controller/authenticationController');
const teamRouter = express.Router();

teamRouter.route('')
            .get(teamController.getAllTeams)
            .post(teamController.createTeam);

teamRouter.route('/totalCount')
            .get(teamController.getTotalTeams)

teamRouter.route('/:id')
            .get(authController.authenticate,teamController.getOne)
            .delete(authController.authenticate,teamController.deleteOne)
            .put(teamController.fullyUpdate)
            .patch(teamController.partiallyUpdate);

// teamRouter.route('/:id/players/totalCount')
//             .get(playerController.getTotalPlayers);


teamRouter.route('/:id/players')
            .get(playerController.getAllPlayers)
            .post(playerController.createPlayer);

teamRouter.route('/:id/players/:playerid')
            .get(playerController.getAPlayer)
            .delete(authController.authenticate,playerController.deletePlayer)
            .put(playerController.fullUpdate)
            .patch(playerController.partiallyUpdatePlayer);

module.exports = teamRouter;

