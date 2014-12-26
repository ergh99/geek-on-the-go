var Mechanize = require('mechanize');

function withAuthenticatedAgent(bggCredentials, callback) {
  var agent = Mechanize.newAgent();
  agent.get({ uri: "http://boardgamegeek.com/login" }, function(err, page) {
    var loginForm = page.form("the_form");
    loginForm.setFieldValue("username", bggCredentials.username);
    loginForm.setFieldValue("password", bggCredentials.password);

    loginForm.submit(null, {}, { followAllRedirects: true }, function(err, page) {
      callback(agent, err, page);
    });
  });
};

function addGameToGeekList(bggCredentials, geeklistId, gameId, callback) {
  withAuthenticatedAgent(bggCredentials, function(agent, err, page) {
    agent.get({ uri: "http://boardgamegeek.com/geeklist/item/new/" + geeklistId + "/boardgame" }, function(err, page) {
      var form = page.form("ITEMFORM");
      form.setFieldValue("objectid", gameId);

      form.submit(null, {}, { followAllRedirects: true }, callback);
    });
  });
};

module.exports = {
  addGameToGeekList: addGameToGeekList
};
