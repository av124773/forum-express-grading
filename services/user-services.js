const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userServices = {
  signUp: (req, cb) => {
    if (req.body.password !== req.body.passwordCheck) {
      const err = new Error('Passwords do not match!')
      err.status = 404
      throw err
    }
    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) {
          const err = new Error('Email alread exists!')
          err.status = 404
          throw err
        }
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(newUser => cb(null, { user: newUser }))
      .catch(err => cb(err))
  }
}
module.exports = userServices
