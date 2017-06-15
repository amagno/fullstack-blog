import { createResolver } from 'apollo-resolvers'
import { createError, isInstance } from 'apollo-errors'
import { MockList } from 'graphql-tools'
import { User } from '../data/models/user'
import { tokenSign } from '../tools/auth' 
import { Post } from '../data/models/post'

const UnknownError = createError('UnknownError', {
    message: 'An unknown error has ocurred! Please try again later...'
})
const AuthenticationRequiredError = createError('AuthenticationRequiredError', {
    message: 'You must be logged in to do this'
})
const AlrearyLoggedError = createError('AlrearyLoggedError', {
    message: 'You already logged!'
})
const ForbiddenError = createError('ForbiddenError', {
    message: 'You are not allowed to do this'
})
const RegisterUserError = createError('RegisterUserError', {
    message: 'This email already exists!'
})

const baseResolver = createResolver(
    null,
    (root, args, context, error) => isInstance(error) ? error : new UnknownError()
)
const alreadyAuthenticatedResolver = baseResolver.createResolver(
    (root, args, { user }) => {
        if(user) throw new AlrearyLoggedError()
    }
)
const isAuthenticatedResolver = baseResolver.createResolver(
    (root, args, { user }) => {
        if(!user) throw new AuthenticationRequiredError()
    }
)
const isAdmin = isAuthenticatedResolver.createResolver(
    (root, args, { user }) => {
        if(!user.isAdmin) throw new ForbiddenError()
    }
)

export const usersResolver = isAuthenticatedResolver.createResolver(async (root, args, context) => {
    try {
        return await User.find().exec()
    } catch(error) {
        throw new UnknownError(error)
    }
})

export const loginResolver = alreadyAuthenticatedResolver.createResolver(async (root, { input }, context) => {
    try {
        return await tokenSign(input)
    } catch(error) {
        throw new UnknownError(error)
    }
})


export const registerUserResolver = baseResolver.createResolver(async (root, { input }, context) => {
    try {
        return await new User(input).save()
    } catch(error) {
        throw new RegisterUserError(error)
    }
})

const addPost = async (title, body, author) => {
    try {
        return await new Post({ title, body, author }).save()
    } catch(error) {
        throw new Error(error)
    }
}
const getUser = async (id) => {

    try {
        return await User.findOne({ _id: id }).exec()
    } catch(error) {
        throw new UnknownError(error)
    }
}
export const postsResolver = baseResolver.createResolver(async (root, { page, limit }, { user }) => {

    const skip = (page * limit - limit)

    const posts = await Post.find().skip(skip).limit(limit).exec()

    console.log(`Page: ${page} Limit: ${limit}`)

    return posts.map(async (post, index) => {
       return {
           id: post.id,
           title: post.title,
           body: post.body,
           author: await getUser(post.author)
       }
    })
})
export const addPostResolver = isAuthenticatedResolver.createResolver(async (root, { input }, { user }) => {
    console.log(user)
    const post = await addPost(input.title, input.body, user)
    console.log(`Search id =>>>>>>>>> ${post.author}`)
    const author = await getUser(user)

    const { id, title, body, createdAt } = post

    console.log(author)
    return {
        id,
        title,
        body,
        createdAt,
        author
    }
})