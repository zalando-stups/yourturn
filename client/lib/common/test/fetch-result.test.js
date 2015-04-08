import {Done, Failed, Pending} from 'common/src/fetch-result';

describe('The FetchResult', () => {
    it('should have the correct result', () => {
        var fetchResult = new Done(1);
        expect(fetchResult.getResult()).to.equal(1);
    });

    it('should have the correct status', () => {
        var done = new Done(),
            failed = new Failed(),
            pending = new Pending();

        expect(done.isDone()).to.be.true;
        expect(done.isFailed()).to.be.false;
        expect(done.isPending()).to.be.false;

        expect(failed.isDone()).to.be.false;
        expect(failed.isFailed()).to.be.true;
        expect(failed.isPending()).to.be.false;

        expect(pending.isDone()).to.be.false;
        expect(pending.isFailed()).to.be.false;
        expect(pending.isPending()).to.be.true;
    });

});