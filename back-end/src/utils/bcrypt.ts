import bcrypt from "bcrypt";
const saltRounds = 10;

const Bcrypt = () => {
  const hashPassword = async (plainPassword: string) => {
    try {
      const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw error;
    }
  };

  const comparePasswords = async (
    userEnteredPassword: string,
    hashedPasswordFromDatabase: string
  ) => {
    try {
      const result = await bcrypt.compare(
        userEnteredPassword,
        hashedPasswordFromDatabase
      );
      return result;
    } catch (error) {
      throw error;
    }
  };

  return {
    hashPassword,
    comparePasswords,
  };
};

export default Bcrypt;
