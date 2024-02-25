import bcrypt from 'bcrypt'

export const getHashFromString = async (stringToHash: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(stringToHash, salt)
}