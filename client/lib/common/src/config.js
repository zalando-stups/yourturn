import RESOURCE_WHITELIST from 'RESOURCE_WHITELIST';

export default {
    DATE_FORMAT: 'YYYY-MM-DD HH:mm',
    DATE_FORMAT_DAY_OF_MONTH_WITH_YEAR: 'Do [of] MMM YY',
    /**
     * QUICKFIX #133
     * @deprecated No user is whitelisted anymore
     */
    RESOURCE_WHITELIST: RESOURCE_WHITELIST
                            .split(' ')
                            .map(s => s.trim())
                            .filter(s => s.length > 0)
};
