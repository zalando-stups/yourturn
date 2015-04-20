/* globals sinon, expect */
import puppeteer from 'common/src/puppeteer';
import {View} from 'backbone';

class MockView extends View {
    constructor() {
        super();
    }

    render() {
        return this;
    }

    remove() {

    }

    _boundRender() {
        return this;
    }
}

describe('The Puppeteer', () => {
    it('should export an instance', () => {
        expect(puppeteer).to.be.an('object');
    });

    it('should not have an active element at start', () => {
        expect(puppeteer.active).to.be.false;
    });

    it('should call remove() once on the old element', () => {
        let oldEl = new MockView();
        let newEl = new MockView();
        let spy = sinon.spy( oldEl, 'remove' );
        puppeteer.show( oldEl );
        puppeteer.show( newEl );
        expect( spy ).to.have.been.calledOnce;
    });

    it('should hold a reference to the new view after show', () => {
        let oldEl = new MockView();
        let newEl = new MockView();
        puppeteer.show( oldEl );
        expect( puppeteer.active ).to.equal( oldEl );
        puppeteer.show( newEl );
        expect( puppeteer.active ).to.equal( newEl );
    });
});