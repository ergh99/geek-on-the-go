var http = require("http");
var util = require("util");
var express = require('express');
var router = express.Router();
var parseString = require('xml2js').parseString;

var bggRoot = "http://boardgamegeek.com/xmlapi2/thing?id=";

hbs.registerHelper('gameURL', function(game) {
  return "http://boardgamegeek.com/boardgame/" + game.objectid;
});

/* GET game page. */
router.get('/:id', function (req, res) {
    'use strict';
    http.get(bggRoot + req.params.id, function (response) {
        var xmlResp = '';
        response.on('data', function (chunk) { xmlResp += chunk; });
        response.on('end', function () {
            res.redirect('/');
            parseString(xmlResp, function (err, result) {
            console.log(util.inspect(result, false, null));
                if (err) {
                    console.log(err.message);
                    res.redirect('/');
                }
                res.render('games', { game: {
                    name: result.items.item[0].name[0].$.value,
                    objectid: result.items.item[0].$.id,
                    thumbnail: result.items.item[0].thumbnail
                }});
            });
        });
    });
});

module.exports = router;
