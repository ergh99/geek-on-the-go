require('array.prototype.find');
var http = require("http");
var util = require("util");
var express = require('express');
var router = express.Router();
var hbs = require("hbs");
var parseString = require('xml2js').parseString;

var bggRoot = "http://boardgamegeek.com/xmlapi2/thing?id=";

hbs.registerHelper('gameURL', function (game) {
    if (process.env.DEBUG) { console.log(util.inspect(game)); }
    return "http://boardgamegeek.com/boardgame/" + game.id;
});

function extractGameFromBggXml(bggItem) {
    var game = {};
    game.id = bggItem.$.id;
    game.url = "http://boardgamegeek.com/boardgame/" + game.id;
    game.name = bggItem.name[0].$.value;
    game.thumbnail = bggItem.thumbnail;
    if (bggItem.minplayers) { game.minPlayers = bggItem.minplayers[0].$.value; }
    if (bggItem.maxplayers) { game.maxPlayers = bggItem.maxplayers[0].$.value; }
    var suggested_numplayers = bggItem.poll.find(function (e,i,a) {
        return e.$.name === 'suggested_numplayers';
    });
    if (process.env.DEBUG) { console.log(util.inspect(suggested_numplayers)); }

    return game;
}

/* GET games page. */
router.get('/:id', function (req, res) {
    'use strict';
    http.get(bggRoot + req.params.id, function (response) {
        var xmlResp = '';
        response.on('data', function (chunk) { xmlResp += chunk; });
        response.on('end', function () {
            parseString(xmlResp, function (err, result) {
                if (err) {
                    res.render('error', {
                        message: err.message,
                        error: err
                    });
                }
                if (result.items.item) {
                    var game = extractGameFromBggXml(result.items.item[0]);
                    res.render('games', { game: game } );
                } else {
                    console.log(util.inspect(result, false, null));
                    res.render('error', {
                        message: "Game not found"
                    });
                }
            });
        });
    });
});

module.exports = router;
