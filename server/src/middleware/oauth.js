var request = require("superagent-bluebird-promise");

var BPI = process.env.BUSINESS_PARTNER_ID;

function sendGenericError(res) {
  return res
    .status(401)
    .set("WWW-Authenticate", "OAuth2")
    .send();
}

/**
 * OAuth 2 middleware.
 */
module.exports = function(req, res, next) {
  // if there is no token, respond with 401
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
    return sendGenericError(res);
  }

  var header = req.headers.authorization,
    token = header.substring("Bearer ".length);

  // verify token
  request
    .post(process.env.YTENV_OAUTH_TOKENINFO_URL)
    .accept("json")
    .set({ Authorization: `Bearer ${req.body.access_token}` })
    .send({
      business_partner_id: BPI
    })
    .then(tokeninfo => {
      req.tokeninfo = tokeninfo.body;
      if (tokeninfo.body.realm === "/employees" || tokeninfo.body.realm === "/services") {
        return next();
      }
      return sendGenericError(res);
    })
    .catch(err => sendGenericError(res));
};
