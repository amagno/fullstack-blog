import devConfig from './dev'

const config = () => {
    if(!process.env.production) {
        return devConfig
    }
}


export default config()