// Mocha
const {
  describe, it, before, after, beforeEach, afterEach,
} = require('mocha');

// Sinon
const sinon = require('sinon');

const { assert } = sinon;

// Chai
const chai = require('chai');

const { expect } = chai;

// Chai plugins
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));

// Supertest
const request = require('supertest');

module.exports = {
  describe,
  it,
  before,
  after,
  beforeEach,
  afterEach,
  expect,
  request,
  sinon,
  assert,
};
