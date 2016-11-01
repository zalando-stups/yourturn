const sinon = require('sinon');

const metrics = require('../../src/metrics');

describe('metrics', () => {
    describe('report', () => {
        describe('#generate', () => {
            it('would return empty report if there are no reporters', () => {
                const report = metrics.report();
                return report.generate().then(report => {
                    expect(report).to.be.empty;
                });
            });

            it('would return empty report if providers are null', () => {
                const report = metrics.report({
                    providers: null
                });
                return report.generate().then(report => {
                    expect(report).to.be.empty;
                });
            });

            it('would return report with values for providers of all kind', () => {
                const report = metrics.report({
                    providers: {
                        simple: 42,
                        'function-call': () => 42,
                        'function-call-2': (counter => () => ++counter)(41)
                    }
                });

                return report.generate()
                    .then(report => {
                    expect(report).to.eql({
                        simple: 42,
                        'function-call': 42,
                        'function-call-2': 42
                    });
                });
            });

            it('would wrap sync provider Error', () => {
                const report = metrics.report({
                    providers: {
                        'bad-boy': () => {
                            throw new Error('oops');
                        }
                    }
                });

                return report.generate()
                    .then(() => {
                        throw new Error('have not expected you here');
                    })
                    .catch(err => {
                        expect(err).to.be.an('error');
                        expect(err.message).to.equal('oops');
                    });
            });
        });
    });

    describe('cachedProvider', () => {
        it('would throw if no provider is provided', () => {
            expect(() => {
                metrics.cachedProvider();
            }).to.throw(Error, 'provider should be not null');
        });

        it('would throw if no defaultValue is provided', () => {
            expect(() => {
                metrics.cachedProvider(() => {});
            }).to.throw(Error, 'defaultResult should be not null');
        });

        it('would return provider itselt if provider is not a function', () => {
            const provider = metrics.cachedProvider({
                foo: 'good'
            }, {
                foo: 'bad'
            });

            return provider().then(result => {
                expect(result).to.eql({
                    foo: 'good'
                });
            });
        });

        it('would return default result if provider failes on first run', () => {
            const provider = metrics.cachedProvider(() => Promise.reject(), 42);

            return provider().then(result => {
                expect(result).to.equal(42);
            })
        });

        it('would return cached result if provider runned at least once', () => {
            const provider = sinon.stub();
            const cached = metrics.cachedProvider(provider, 0);

            provider.onFirstCall().returns(42)
                    .onSecondCall().returns(Promise.reject());

            return cached().then(result => {
                expect(result).to.equal(42);
                return cached();
            })
            .then(result => {
                expect(result).to.equal(42);
            });
        });

        it('would update cached result after last successful provider run', () => {
            const provider = sinon.stub();
            const cached = metrics.cachedProvider(provider, 0);

            provider.onFirstCall().returns(42)
                    .onSecondCall().returns(Promise.reject())
                    .onThirdCall().returns(9000);

            return cached()
            .then(result => {
                expect(result).to.equal(42);
                return cached();
            })
            .then(result => {
                expect(result).to.equal(42);
                return cached();
            })
            .then(result => {
                expect(result).to.equal(9000);
            });
        });

        it('would return bad results if they are sucessfully resolve', () => {
            const provider = metrics.cachedProvider(() => new Error('oops'), {
                something: 'good'
            });

            return provider().then(result => {
                expect(result).to.be.an('error');
                expect(result.message).to.equal('oops');
            });
        });

        it('would return catch even error throw in providers', () => {
            const provider = metrics.cachedProvider(() => {
                throw new Error('oops');
            }, 42);

            return provider().then(result => {
                expect(result).to.equal(42);
            });
        });
    });
});
