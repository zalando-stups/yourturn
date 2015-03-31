import superagent from 'superagent';

/**
 * Just like superagent.end, but returning a promise.
 *
 * @return {Promise}
 */
superagent.Request.prototype.exec = function() {
    let req = this;
    return new Promise((resolve, reject) => {
        req.end((error, res) => {
            if (error) {
                return reject(error);
            }
            resolve(res);
        });
    });
};

export default superagent;