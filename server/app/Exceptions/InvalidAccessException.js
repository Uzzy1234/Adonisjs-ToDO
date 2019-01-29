'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class InvalidAccessException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle (error, { response }) {
    return response.status(403).json({
      status: 'fail',
      message: 'You are not authorized'
    })
  }
}

module.exports = InvalidAccessException
