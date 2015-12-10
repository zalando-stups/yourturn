function isAvailable(client) {
    return client.connected && client.ready;
}

function unavailableError() {
    return new Error('Redis unavailable');
}

module.exports = {
    isAvailable,
    unavailableError
};