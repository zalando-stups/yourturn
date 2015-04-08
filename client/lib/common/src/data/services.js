import TWINTIP_BASE_URL from 'TWINTIP_BASE_URL';
import KIO_BASE_URL from 'KIO_BASE_URL';

const SERVICES = {
    kio: {
        url: KIO_BASE_URL,
        root: '/apps',
        id: 'id'
    },
    twintip: {
        url: TWINTIP_BASE_URL,
        root: '/apis',
        id: 'application_id'
    }
};

function constructUrl(serviceId, entityId) {
    return `${SERVICES[serviceId].url}${SERVICES[serviceId].root}/${entityId}`;
}

function constructLocalUrl(serviceId, entityId) {
    if (serviceId === 'kio') {
        return `application/${entityId}`;
    }
    return false;
}

export {
    constructUrl as constructUrl,
    constructLocalUrl as constructLocalUrl,
    SERVICES as Services
};