import RESOURCE_WHITELIST from 'RESOURCE_WHITELIST';

export default {
    DATE_FORMAT: 'YYYY-MM-DD HH:mm',
    //QUICKFIX #133
    RESOURCE_WHITELIST: RESOURCE_WHITELIST
                            .split(' ')
                            .map(s => s.trim())
                            .filter(s => s.length > 0)
};
