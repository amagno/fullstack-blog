import jwt from 'jsonwebtoken'
import { User, Token } from '../data/models/user'

const EXPIRES = '1h'
const SECRET = 'secret'

export const tokenVerifyMiddleware = (req, res, next) => {
    const token = req.query.token || req.header['x-access-token'] || null

    jwt.verify(token, SECRET, (err, decoded) => {
        if(err) {
            req.user = null
        } 
        if(decoded) {
            req.user = decoded.id
        }          
    })
    next()
}
const getUser = async (email) => {
    try {   
        return await User.findOne({ email }).exec()
    } catch(error) {
        throw new Error(error)
    }
}

const getToken = async (userId) => {
    try {
        return await Token.findOne({ userId }).exec()
    } catch(error) {
        throw new Error(error)
    }
}
const saveToken = async (token, userId) => {
     try {
        return await new Token({ token, userId }).save()
    } catch(error) {
        throw new Error(error)
    }
}
export const tokenSign = async ({ email, password }) => {
    const user = await getUser(email)
    let tokenStorage = undefined

    if(!user) {
        throw new Error('E-mail not exixsts in data base!')
    }
    if(user.password != password) {
        throw new Error('Password invalid!')
    }
    tokenStorage = await getToken(user.id)

    if(!tokenStorage) {
        const token = await jwt.sign({ id: user.id }, SECRET, { expiresIn: EXPIRES })
        tokenStorage = await saveToken(token, user.id)
    } 
    

    return {
        token: tokenStorage.token,
        expires: EXPIRES
    }
}