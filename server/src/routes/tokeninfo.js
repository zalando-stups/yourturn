var winston = require("winston"),
  request = require("superagent-bluebird-promise");

function info(req, res) {
  var accessToken = req.get("authorization");
  accessToken
  console.log("accessToken", accessToken);
  request
    .get(process.env.YTENV_OAUTH_TOKENINFO_URL)
    .accept("json")
    .set({
      "Authorization": accessToken
    })
    .then(response => {

      console.log("response", response);
      return res
        .status(200)
        .type("json")
        .send(response.text)
    }
    )
    .catch(err => {
      console.log("err", err);
      if (err.status !== 400) {
        winston.error("Could not GET /tokeninfo: %d %s", err.status || 0, err.message);
      }
      return res.status(err.status || 0).send(err);
    });
}

module.exports = {
  info
};
