var http = require("http");
var util = require("util");
var express = require('express');
var router = express.Router();
var parseString = require('xml2js').parseString;

var bggRoot = "http://boardgamegeek.com/xmlapi2/thing?id=";

/* GET game page. */
router.get('/:id', function(req, res) {
  var request = http.get(bggRoot + req.params.id, function(response) {
    var xmlResp = '';
    response.on('data', function(chunk) { xmlResp += chunk; });
    response.on('end', function(err) {
      parseString(xmlResp, function (err, result) {
//        console.log(util.inspect(result, false, null));
        res.render('games', { game: { name: result.items.item[0].name[0].$.value, thumbnail: result.items.item[0].thumbnail }});
	  });
	});
  });
});

module.exports = router;
