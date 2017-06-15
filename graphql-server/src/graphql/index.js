
import { makeExecutableSchema, addMockFunctionsToSchema, MockList } from 'graphql-tools'
import schema from './schema.graphql'
import casual from 'casual'
import mongoose from 'mongoose'
import { usersResolver, loginResolver, registerUserResolver, addPostResolver, postsResolver } from './resolvers'

const typeDefs = [ schema ]

const NUMBER_OF_ITEMS = 111

const genMockPosts = (number) => {
    let posts = []

    for(let i = 0; i < number; i++) {
        posts.push({
            id: mongoose.Types.ObjectId(),
            title: casual.title,
            body: casual.text
        })
    }
    return posts
}   

const mocks = {
    Query: () => ({
        users: () => new MockList(50),
        postsWithPages: (root, args) => {

            const start = args.page * args.limit - args.limit
            const posts = genMockPosts(NUMBER_OF_ITEMS).splice(start, args.limit)

            return { total: NUMBER_OF_ITEMS, page: args.page, maxPages: parseInt(NUMBER_OF_ITEMS / args.limit), posts }
        }

    }),
    User: () => ({
        id: mongoose.Types.ObjectId(),
        name: casual.name,
        email: casual.email,
        password: casual.password
    })

}

const resolvers = {
        Query: {
            users: usersResolver,
            posts: postsResolver
        },
        Mutation: {
            login: loginResolver,
            registerUser: registerUserResolver,
            addPost: addPostResolver
        }
}
const executableSchema = makeExecutableSchema({ 
    typeDefs
})

addMockFunctionsToSchema({ schema: executableSchema, mocks, preserveResolvers: false })

export default executableSchema