const FetchResultStatus = {
    PENDING: 'PENDING',
    FAILED: 'FAILED',
    DONE: 'DONE'
};

class FetchResult {
    constructor(result) {
        this.result = result;
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

    isFailed() {
        return this.status === FetchResultStatus.FAILED;
    }

    isDone() {
        return this.status === FetchResultStatus.DONE;
    }
}

class PendingResult extends FetchResult {
    constructor(result) {
        super(result);
        this.status = FetchResultStatus.PENDING;
    }
}

class FailedResult extends FetchResult {
    constructor(result) {
        super(result);
        this.status = FetchResultStatus.FAILED;
    }
}

class DoneResult extends FetchResult {
    constructor(result) {
        super(result);
        this.status = FetchResultStatus.DONE;
    }
}

export {
    PendingResult as Pending,
    FailedResult as Failed,
    DoneResult as Done
}

export default FetchResult;