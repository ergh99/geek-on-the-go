var http = require("http");
var express = require('express');
var router = express.Router();
var parseString = require('xml2js').parseString;

var bggRoot = "http://boardgamegeek.com/xmlapi2/thing?id=";

/* GET game page. */
router.get('/:id', function(req, res) {
  console.log(req.params.id);
  var request = http.get(bggRoot + req.params.id, function(response) {
    var xmlResp = '';
    response.on('data', function(chunk) { xmlResp += chunk; });
    response.on('end', function(err) {
      parseString(xmlResp, function (err, result) {
        console.log(util.inspect(result, false, null));
		  res.render('games', { game: { name: result.items.item.name, thumbnail: result.items.item.thumbnail }});
	  });
	});
  });
});

module.exports = router;
