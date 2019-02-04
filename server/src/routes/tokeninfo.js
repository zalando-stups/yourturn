var winston = require("winston"),
  request = require("superagent-bluebird-promise");

function info(req, res) {
  request
    .post(process.env.YTENV_OAUTH_TOKENINFO_URL)
    .accept("json")
    .send({
      access_token: req.query.access_token
    })
    .then(response =>
      res
        .status(200)
        .type("json")
        .send(response.text)
    )
    .catch(err => {
      if (err.status !== 400) {
        // log error on tokeninfo only if it's not
        // because of an invalid token
        winston.error("Could not GET /tokeninfo: %d %s", err.status || 0, err.message);
      }
      return res.status(err.status || 0).send(err);
    });
}

module.exports = {
  info
};
