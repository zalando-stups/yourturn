import TWINTIP_BASE_URL from 'TWINTIP_BASE_URL';
import KIO_BASE_URL from 'KIO_BASE_URL';
import MINT_BASE_URL from 'MINT_BASE_URL';
import ESSENTIALS_BASE_URL from 'ESSENTIALS_BASE_URL';
import PIERONE_BASE_URL from 'PIERONE_BASE_URL';

const SERVICES = {
    kio: {
        url: KIO_BASE_URL,
        root: '/apps',
        id: 'id',
        searchQuery: 'search'
    },
    twintip: {
        url: TWINTIP_BASE_URL,
        root: '/apps',
        id: 'application_id',
        searchQuery: 'search'
    },
    mint: {
        url: MINT_BASE_URL,
        root: '/apps',
        id: 'id'
    },
    essentials: {
        url: ESSENTIALS_BASE_URL,
        root: '/resource-types',
        id: 'id'
    },
    pierone: {
        url: PIERONE_BASE_URL,
        root: '/v1/search',
        searchQuery: 'q'
    }
};

function constructUrl(serviceId, entityId) {
    return `${SERVICES[serviceId].url}${SERVICES[serviceId].root}/${entityId}`;
}

export {
    constructUrl as constructUrl,
    SERVICES as Services
};
