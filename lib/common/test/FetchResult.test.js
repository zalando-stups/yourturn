import FetchResult from 'common/src/FetchResult';

describe('The FetchResult', () => {
    var fetchResult;

    afterEach( () => {
        fetchResult = null;
    });

    it('should have the right promise', () => {
        let p = Promise.resolve(1);
        fetchResult = new FetchResult(p);
        expect(fetchResult.promise).to.equal(p);
    });

    it('should start in PENDING state', () => {
        fetchResult = new FetchResult(new Promise(()=>{}));
        expect(fetchResult.isResolved()).to.be.false;
        expect(fetchResult.isRejected()).to.be.false;
        expect(fetchResult.isPending()).to.be.true;
        expect(fetchResult.getResult()).to.be.undefined;
    });

    it('should have the value after RESOLVED', done => {
        var value = 1;
        fetchResult = new FetchResult(Promise.resolve(value));
        fetchResult.promise.then(() => {
            expect(fetchResult.getResult()).to.equal(value);
            expect(fetchResult.isPending()).to.be.false;
            expect(fetchResult.isRejected()).to.be.false;
            expect(fetchResult.isResolved()).to.be.true;
            done();
        });
    });

    it('should have the error after REJECTED', done => {
        var error = new Error('Whoops');
        fetchResult = new FetchResult(Promise.reject(error));
        fetchResult.promise.catch(() => {
            expect(fetchResult.getResult()).to.equal(error);
            expect(fetchResult.isPending()).to.be.false;
            expect(fetchResult.isResolved()).to.be.false;
            expect(fetchResult.isRejected()).to.be.true;
            done();
        });
    });
});