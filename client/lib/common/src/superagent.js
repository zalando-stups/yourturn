import superagent from 'superagent';
import patch from '@zalando/superagent-oauth2-client';

export default patch(superagent);