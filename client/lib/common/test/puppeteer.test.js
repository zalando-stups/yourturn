import puppeteer from 'common/src/puppeteer';

describe('The Puppeteer', () => {
    it('should export an instance', () => {
        expect(puppeteer).to.be.an('object');
    });
});