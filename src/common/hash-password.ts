import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
    return bcrypt.hash(password, 10)
}

export const comparePassword = async (hashedPassword:string, password:string)  => {
    return bcrypt.compare(password, hashedPassword)
}