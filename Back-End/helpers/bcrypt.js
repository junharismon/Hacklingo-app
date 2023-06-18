import bcrypt from "bcryptjs";

/**
 *
 * @param { plain } string plain password that will be hashed
 * @description This function returns a hashed password with bcrypt
 * @returns {string} hashed password
 */

function hashPassword(plain) {
  return bcrypt.hashSync(plain, 10);
}

/**
 *
 * @param { plain } string plain password
 * @param { hash } string hashed password
 * @description This function returns a comparison between password input and hashed password in database
 * @returns {boolean} true if correct, false if incorrect
 */

function checkPassword(plain, hash) {
  return bcrypt.compareSync(plain, hash);
}

export { hashPassword, checkPassword };
