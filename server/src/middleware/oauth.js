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
  console.log("oauth.js BPI", BPI);
  // if there is no token, respond with 401
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
    return sendGenericError(res);
  }

  var header = req.headers.authorization,
    token = header.substring("Bearer ".length);

  console.log("oauth.js token", token);

  // verify token
  request
    .post(process.env.YTENV_OAUTH_TOKENINFO_URL)
    .accept("json")
    .set({
      Authorization: token,
      "content-type": "application/x-www-form-urlencoded"
    })
    .send({
      business_partner_id: BPI
    })
    .then(tokeninfo => {
      console.log("oauth.js tokeninfo", tokeninfo);
      req.tokeninfo = tokeninfo.body;
      if (tokeninfo.body.realm === "/employees" || tokeninfo.body.realm === "/services") {
        return next();
      }
      return sendGenericError(res);
    })
    .catch(err => {console.log("oauth.js tokeninfo", tokeninfo); sendGenericError(res)});
};
