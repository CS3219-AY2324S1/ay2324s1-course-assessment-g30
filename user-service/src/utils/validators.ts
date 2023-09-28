export const isValidPassword = (password: string) => {
  const minLength = 8;
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(password);

  if (
    password.length < minLength ||
    !hasLowerCase ||
    !hasUpperCase ||
    !hasDigit ||
    !hasSpecialChar
  ) {
    return false;
  }

  return true;
};

export const isValidUsername = (username: string) => {
  // Username has
  // - at least 1 and at most 30 characters
  // - consist of only alphabets, numbers, ".", "_" and "-"
  const pattern = /^[a-z0-9._-]{1,30}$/;

  // Test if the input value matches the pattern
  if (!pattern.test(username)) {
    return false;
  }

  return true;
};
