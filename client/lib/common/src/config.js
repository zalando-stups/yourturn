import WHITELIST from 'RESOURCE_WHITELIST';

export default {
    DATE_FORMAT: 'MMMM Do YYYY, h:mm:ss a',
    //QUICKFIX #133
    RESOURCE_WHITELIST: WHITELIST
                            .split(' ')
                            .map(s => s.trim())
                            .filter(s => s.length > 0)
};