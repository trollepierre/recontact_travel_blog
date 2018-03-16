const {
  describe, it, before, after, beforeEach, afterEach,
} = require('mocha');

const sinon = require('sinon');
const { assert } = sinon;

const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));

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
