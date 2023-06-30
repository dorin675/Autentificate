const NotFoundError = new Error('Resource not found');
const UnauthorizedError = new Error('Unauthorized access');
const DatabaseError = new Error('Database error');
const syntaxError = new SyntaxError('Invalid syntax');
const typeError = new TypeError('Invalid type');
const referenceError = new ReferenceError('Variable not defined');
const rangeError = new RangeError('Value out of range');
const uriError = new URIError('Invalid URI');


const errorDictionary = {
  notFound: NotFoundError,
  unauthorized: UnauthorizedError,
  databaseError: DatabaseError,
  SyntaxError: syntaxError,
  TypeError: typeError,
  ReferenceError: referenceError,
  RangeError: rangeError,
  URIError: uriError
};

module.exports.handleError=(errorCode) => {
  const error = errorDictionary[errorCode.name];
  console.log(errorCode.message)
  if (error) {
    console.log(error.message);
  } else {
    console.log('Unknown error');
  }
}