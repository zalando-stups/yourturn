var kio = require('./5000-kio'),
    twintip = require('./5001-twintip'),
    auth = require('./5002-auth'),
    essentials = require('./5003-essentials'),
    mint = require('./5004-mint'),
    team = require('./5005-team'),
    token = require('./5006-tokeninfo'),
    pierone = require('./5007-pierone'),
    fullstop = require('./5008-fullstop'),
    user = require('./5009-user'),
    magnificent = require('./5010-magnificent');
    alice = require('./5011-alice');

kio.listen(5000);
console.log('kio on 5000');
twintip.listen(5001);
console.log('twintip on 5001');
auth.listen(5002);
console.log('auth on 5002');
essentials.listen(5003);
console.log('essentials on 5003');
mint.listen(5004);
console.log('mint on 5004');
team.listen(5005);
console.log('team on 5005');
token.listen(5006);
console.log('token on 5006');
pierone.listen(5007);
console.log('pierone on 5007');
fullstop.listen(5008);
console.log('fullstop on 5008');
user.listen(5009);
console.log('user on 5009');
magnificent.listen(5010);
console.log('magnificent on 5010');
alice.listen(5011);
console.log('alice on 5011');
