// 80+ char lines are useful in describe/it, so ignore in this file.
/* eslint-disable max-len */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import request from 'supertest-as-promised';
import koa from 'koa';
import mount from 'koa-mount';
import graphqlHTTP from '..';


describe('Useful errors when incorrectly used', () => {

  it('requires an option factory function', () => {
    expect(() => {
      graphqlHTTP();
    }).to.throw(
      'GraphQL middleware requires options.'
    );
  });

  it('requires option factory function to return object', async () => {
    const app = koa();

    app.use(mount('/graphql', graphqlHTTP(() => null)));

    let caughtError;
    try {
      await request(app.listen()).get('/graphql?query={test}');
    } catch (error) {
      caughtError = error;
    }
    expect(caughtError.response.status).to.equal(500);
    expect(JSON.parse(caughtError.response.text)).to.deep.equal({
      errors: [
        { message:
          'GraphQL middleware option function must return an options object or a promise which will be resolved to an options object.' }
      ]
    });
  });

  it('requires option factory function to return object or promise of object', async () => {
    const app = koa();

    app.use(mount('/graphql', graphqlHTTP(() => Promise.resolve(null))));

    let caughtError;
    try {
      await request(app.listen()).get('/graphql?query={test}');
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError.response.status).to.equal(500);
    expect(JSON.parse(caughtError.response.text)).to.deep.equal({
      errors: [
        { message:
          'GraphQL middleware option function must return an options object or a promise which will be resolved to an options object.' }
      ]
    });
  });

  it('requires option factory function to return object with schema', async () => {
    const app = koa();

    app.use(mount('/graphql', graphqlHTTP(() => ({}))));

    let caughtError;
    try {
      await request(app.listen()).get('/graphql?query={test}');
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError.response.status).to.equal(500);
    expect(JSON.parse(caughtError.response.text)).to.deep.equal({
      errors: [
        { message: 'GraphQL middleware options must contain a schema.' }
      ]
    });
  });

  it('requires option factory function to return object or promise of object with schema', async () => {
    const app = koa();

    app.use(mount('/graphql', graphqlHTTP(() => Promise.resolve({}))));

    let caughtError;
    try {
      await request(app.listen()).get('/graphql?query={test}');
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError.response.status).to.equal(500);
    expect(JSON.parse(caughtError.response.text)).to.deep.equal({
      errors: [
        { message: 'GraphQL middleware options must contain a schema.' }
      ]
    });
  });

});
