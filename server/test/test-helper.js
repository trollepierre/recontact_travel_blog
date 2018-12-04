import {
  after, afterEach, before, beforeEach, describe, it,
} from 'mocha'

import sinon from 'sinon'

import chai from 'chai'

import request from 'supertest'

const { assert } = sinon

const { expect } = chai
chai.use(require('chai-as-promised'))
chai.use(require('sinon-chai'))

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
}
