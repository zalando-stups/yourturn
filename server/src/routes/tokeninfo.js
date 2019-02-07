var winston = require("winston"),
  request = require("superagent-bluebird-promise");

function info(req, res) {
  var accessToken = req.get("authorization");
  console.log("accessToken", accessToken);
  request
    .get(process.env.YTENV_OAUTH_TOKENINFO_URL)
    .accept("json")
    .query({
      access_token: accessToken
    })
    .then(response =>
      res
        .status(200)
        .type("json")
        .send(response.text)
    )
    .catch(err => {
      if (err.status !== 400) {
        winston.error("Could not GET /tokeninfo: %d %s", err.status || 0, err.message);
      }
      return res.status(err.status || 0).send(err);
    });
}

module.exports = {
  info
};
