import RESOURCE_WHITELIST from 'RESOURCE_WHITELIST';
import APPLICATION_WHITELIST from 'APPLICATION_WHITELIST';

export default {
    DATE_FORMAT: 'YYYY-MM-DD HH:mm',
    //QUICKFIX #133
    RESOURCE_WHITELIST: RESOURCE_WHITELIST
                            .split(' ')
                            .map(s => s.trim())
                            .filter(s => s.length > 0),
    APPLICATION_WHITELIST: APPLICATION_WHITELIST
                            .split(' ')
                            .map(s => s.trim())
                            .filter(s => s.length > 0)
};
