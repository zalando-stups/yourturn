const winston = require('winston');
const isEmpty = require('lodash.isempty');

module.exports = store => {
    return (req, res, next) => {
        if (!isEmpty(req.tokeninfo)) {
            const uid = req.tokeninfo.uid;
            const realm = req.tokeninfo.realm;
            store.add(`${realm}/${uid}`).catch(err => {
                winston.error('failed to store unique login: %s', err);
            });
        }

        next();
    }
};
