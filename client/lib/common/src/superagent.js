import superagent from 'superagent';
import patch from 'superagent-oauth2-client';

export default patch(superagent);