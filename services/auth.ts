import * as jose from 'jose'

export const getHashFromString = async (stringToHash: string): Promise<string> => {
  const bcrypt = require("bcrypt");
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(stringToHash, salt)
}

export const compareHashAndString = async (hash: string, stringToCompare: string): Promise<boolean> => {
  const bcrypt = require("bcrypt");
  return bcrypt.compare(stringToCompare, hash)
}

export const generateToken = async (payload: jose.JWTPayload, options?: { expiresIn?: string, alg?: string }): Promise<string> => {
  const secretString = process.env.JWT_SECRET
  if (!secretString) throw new Error('JWT_SECRET not found')
  const secret = new TextEncoder().encode(secretString)
  
  const expiresIn = options?.expiresIn || '7d'
  const alg = options?.alg || 'HS256'

  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret)
  return jwt
}

export const verifyToken = async (token: string): Promise<jose.JWTVerifyResult | boolean | undefined> => {
  const secretString = process.env.JWT_SECRET
  if (!secretString) throw new Error('JWT_SECRET not found')
  const secret = new TextEncoder().encode(secretString)

  try {
    return await jose.jwtVerify(token, secret)
  } catch (error: any) {
    return false
  }
}