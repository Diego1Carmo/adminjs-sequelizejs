import Sequelize from 'sequelize'

import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'

import Database from './database'
import Resource from './resource'
import db from '../models/index.js'

chai.use(sinonChai)

const config = require('../config/config')

describe('Database', () => {
  before(function () {
    this.sequelize = new (Sequelize as any)(config[process.env.NODE_ENV as string]) as any
    this.sequelize.define('User', {
      firstName: Sequelize.STRING,
      lastName: Sequelize.STRING,
      email: Sequelize.STRING,
      arrayed: Sequelize.ARRAY(Sequelize.STRING),
    }, {})
  })

  describe('.isAdapterFor', () => {
    it('returns true when user gives entire db object generated by cli', () => {
      expect(Database.isAdapterFor(db)).to.equal(true)
    })

    it('returns true when user gives sequelize', function () {
      expect(Database.isAdapterFor(this.sequelize)).to.equal(true)
    })
  })

  describe('#resources', () => {
    it('fetches all resources when entire db is given', () => {
      const database = new Database(db)
      expect(database.resources()).to.have.lengthOf(Object.keys(db.sequelize.models).length)
      expect(database.resources()[0]).to.be.an.instanceof(Resource)
    })

    it('fetches all resources when user gives sequelize', function () {
      const database = new Database(this.sequelize)
      expect(database.resources()).to.have.lengthOf(1)
      expect(database.resources()[0]).to.be.an.instanceof(Resource)
    })
  })
})
