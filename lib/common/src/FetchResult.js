let FetchResultStatus = {
    PENDING: 0,
    REJECTED: 1,
    RESOLVED: 2
};

export default class FetchResult {
    constructor(promise) {
        this.promise = promise;
        this.result = undefined;
        this.status = FetchResultStatus.PENDING;
        this.promise.then(
            this._resolveHandler.bind(this),
            this._rejectHandler.bind(this));
    }

    _resolveHandler(value) {
        this.result = value;
        this.status = FetchResultStatus.RESOLVED;
    }

    _rejectHandler(error) {
        this.result = error;
        this.status = FetchResultStatus.REJECTED;
    }

    getResult() {
        return this.result;
    }

    getStatus() {
        return this.status;
    }

    isPending() {
        return this.status === FetchResultStatus.PENDING;
    }

    isRejected() {
        return this.status === FetchResultStatus.REJECTED;
    }

    isResolved() {
        return this.status === FetchResultStatus.RESOLVED;
    }
}