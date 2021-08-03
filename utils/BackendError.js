class BackendError extends Error {
  constructor(statusCode = 500, message = "An error occurred") {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}
module.exports = BackendError;
