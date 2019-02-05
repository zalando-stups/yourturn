var winston = require("winston"),
  request = require("superagent-bluebird-promise");

var BPI = process.env.BUSINESS_PARTNER_ID;

function info(req, res) {
  console.log("/tokeninfo req body", req.body);
  console.log("BPI", BPI);

  request
    .post(process.env.YTENV_OAUTH_TOKENINFO_URL)
    .accept("json")
    .set({
      Authorization: `Bearer ${req.body.access_token}`,
      "content-type": "application/x-www-form-urlencoded"
    })
    .send({
      business_partner_id: BPI
    })
    .then(response => {
      console.log("/tokeninfo response", response);
      res
        .status(200)
        .type("json")
        .send(response.text)
    }
    )
    .catch(err => {
      console.log("/tokeninfo error", err);
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
