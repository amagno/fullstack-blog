import express from 'express'
import config from '../config'
import routes from './routes'
import middlewares from './middlewares'
import bodyParser from 'body-parser'
import graphqlHTTP from 'express-graphql'
import schema from '../graphql'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import db from '../data/mongo-init'
import { formatError } from 'apollo-errors'
import { tokenVerifyMiddleware } from '../tools/auth'


//db.init()
const app = express()



app.use(bodyParser.json())

app.use(tokenVerifyMiddleware)

app.use('/graphql', cors(), graphqlHTTP((req, res) => {
    let user = req.user ? req.user : undefined
    console.log('!!!!!! USER !!!!!! =======================> ' + user)

    return { 
        schema,
        graphiql: true,
        context: {
            user: req.user
        },
        formatError
    }
}))

app.listen(config.server.port, () => {
        console.log(`App is running on http://localhost:${config.server.port}/`)
})