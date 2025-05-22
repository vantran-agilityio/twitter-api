import bcrypt from 'bcrypt';

export const isPasswordValid = (
  encodedPassword: string,
  password: string,
): boolean => bcrypt.compareSync(password, encodedPassword);

export const isEmailValid = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
