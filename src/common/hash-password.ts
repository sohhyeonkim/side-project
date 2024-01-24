import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
    return bcrypt.hash(password, 10)
}

export const comparePassword = async (password1:string, password2:string)  => {
    return bcrypt.compare(password1, password2)
}