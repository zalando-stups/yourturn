import WHITELIST from 'RESOURCE_WHITELIST';

export default {
    DATE_FORMAT: 'Do MMMM YYYY hh:mm:ss',
    //QUICKFIX #133
    RESOURCE_WHITELIST: WHITELIST
                            .split(' ')
                            .map(s => s.trim())
                            .filter(s => s.length > 0)
};