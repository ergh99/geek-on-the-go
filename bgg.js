var Mechanize = require('mechanize');

function withAuthenticatedAgent(bggCredentials, callback) {
  var agent = Mechanize.newAgent();
  agent.get({ uri: "http://boardgamegeek.com/login" }, function(err, page) {
    var loginForm = page.form("the_form");

    // mechanize-js has a bug where all the form fields on the page
    // are included in the POST but when setting an existing field
    // only the first gets updated, so in the case of duplicates the
    // latter field's value wins, usually blank. workaround:
    loginForm.deleteField("username");
    loginForm.deleteField("password");
    loginForm.setFieldValue("username", bggCredentials.username);
    loginForm.setFieldValue("password", bggCredentials.password);

    loginForm.submit(function(err, page) {
        callback(agent, err, page);
    });
  });
};

function addGameToGeekList(bggCredentials, geeklistId, gameId, callback) {
  withAuthenticatedAgent(bggCredentials, function(agent, err, page) {
    agent.get({ uri: "http://boardgamegeek.com/geeklist/item/new/" + geeklistId + "/boardgame" }, function(err, page) {
      var form = page.form("ITEMFORM");

      form.deleteField("action");
      form.setFieldValue("action", "save");

      form.deleteField("objecttype");
      form.setFieldValue("objecttype", "thing");

      form.setFieldValue("objectid", gameId);

      form.submit(callback);
    });
  });
};

module.exports = {
  addGameToGeekList: addGameToGeekList
};
