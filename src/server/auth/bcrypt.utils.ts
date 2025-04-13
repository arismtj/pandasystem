import bcrypt from "bcrypt"

export async function bcryptHash(text: string): Promise<string> {
  const salt = await bcrypt.genSalt()

  return bcrypt.hash(text, salt)
}

export async function bcryptCompare(text: string, hashedText: string,): Promise<boolean> {
  return bcrypt.compare(text, hashedText)
}