import {Provider} from 'common/src/oauth';

export default new Provider({
    id: 'aopenamprovider',
    authorization_url: 'http://localhost:5002/auth'
});