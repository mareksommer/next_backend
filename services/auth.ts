import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const getHashFromString = async (stringToHash: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(stringToHash, salt)
}

export const compareHashAndString = async (hash: string, stringToCompare: string): Promise<boolean> => {
  return bcrypt.compare(stringToCompare, hash)
}

export const generateToken = (payload: string | object | [], options?: { expiresIn?: string }): string => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET not found')

  const expiresIn = options?.expiresIn || '1d'
  const signOptions = { ...options, expiresIn }
  return jwt.sign(payload, secret, signOptions)
}

export const verifyToken = (token: string): object | string | undefined | boolean => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET not found')

  try {
    return jwt.verify(token, secret)
  } catch (error: any) {
    return false
  }
}