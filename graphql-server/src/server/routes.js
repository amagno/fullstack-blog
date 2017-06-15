export default (router) => {
    router.get('/', (req, res) => {
        res.json({
            hello: 'World'
        })
    })

}