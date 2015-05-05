import TWINTIP_BASE_URL from 'TWINTIP_BASE_URL';
import KIO_BASE_URL from 'KIO_BASE_URL';
import ESSENTIALS_BASE_URL from 'ESSENTIALS_BASE_URL';

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
    },
    essentials: {
        url: ESSENTIALS_BASE_URL,
        root: '/resource-types',
        id: 'resource_type'
    }
};

function constructUrl(serviceId, entityId) {
    return `${SERVICES[serviceId].url}${SERVICES[serviceId].root}/${entityId}`;
}

function getLocalUrlForService(serviceId, entityId) {
    if (serviceId === 'kio' ) {
        return `/application/detail/${entityId}`;
    }
}

function constructLocalUrl(module, [entityId, subEntityId]) {
    if (module === 'application') {
        return `/application/detail/${entityId}`;
    } else if (module === 'application-version') {
        return `/application/detail/${entityId}/version/detail/${subEntityId}`;
    }
    return false;
}

export {
    constructUrl as constructUrl,
    constructLocalUrl as constructLocalUrl,
    getLocalUrlForService as getLocalUrlForService,
    SERVICES as Services
};
