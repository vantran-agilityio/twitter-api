import bcrypt from 'bcrypt';

export const isPasswordValid = (
  encodedPassword: string,
  password: string,
): boolean => bcrypt.compareSync(password, encodedPassword);
