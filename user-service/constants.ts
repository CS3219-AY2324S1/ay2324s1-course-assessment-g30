// HTTP Error codes
const HTTP_ERROR_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500
};

// Request Error Messages
const REQUEST_ERROR_MESSAGES = {
  MISSING_FIELDS_ERROR: 'Missing Fields',
  INVALID_FIELD_ERROR: 'Invalid Fields were provided',
  USERNAME_IN_USE_ERROR: 'Username is in use',
  EMAIL_IN_USE_ERROR: 'Email is in use',
  INTERNAL_SERVER_ERROR:
    "Internal server error, this shouldn't have happened : (",
  DB_FAILURE: 'Failed to add user to database',
  MISSING_USER: 'User profile not found'
};

// JWT Related
const SALT_ROUNDS = 10;
const TOKEN_DURATION = '7 days';

export {
  HTTP_ERROR_CODES,
  REQUEST_ERROR_MESSAGES,
  SALT_ROUNDS,
  TOKEN_DURATION
};
