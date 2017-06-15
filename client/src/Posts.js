import React from 'react'
import { gql, graphql } from 'react-apollo'
import { range, slice } from 'lodash'
import ReactPaginate from 'react-paginate'


const query = gql`
    query getPosts($page: Int, $limit: Int) {
        postsWithPages(page: $page, limit: $limit) {
            total
            page
            maxPages
            posts {
                id
                title
                body
                author {
                    name
                }
            }
        }
    }
` 

class Posts extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            page: 1,
            pages: [],
            limit: 5,
            paginateButtons: 4

        }
    }

    handleClick(page) {
        if(page > this.state.pages.length - this.state.paginateButtons) return null
        if(page < this.state.page ) {
            this.setState({
                page: page - this.state.paginateButtons
            })
        } else {
            this.setState({
                page
            })
        }
        
    }

    componentDidMount () {
        this.props.refetch({ page: this.state.page, limit: this.state.limit })
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        this.setState({
            pages: range(1, nextProps.maxPages + 1)
        })
    }
    render() {
        console.log(this.state)
        const posts = this.props.posts ? this.props.posts : []
        const page = this.state.page - 1
        const paginateButtons = this.state.paginateButtons + page
        const pages = slice(this.state.pages, page, paginateButtons)
        return (
            <div>
                <h1>Hello Posts</h1>
                <blockquoute>Total Posts: {this.props.total} | Page {this.props.page} | Pages: {this.props.maxPages} </blockquoute>
            <ul>
              {posts.map((post, index) => (
                  <li key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.body}</p>
                  </li>
              ))}
            </ul>
              <div style={{ margin: '0 auto', width: '500px' }}>
                <ReactPaginate  pageCount={this.props.maxPages} 
                                pageRangeDisplayed={5} 
                                marginPagesDisplayed={1}
                                containerClassName={"react-paginate"}
                                activeClassName={"active"}
                                
                />
              </div>
            </div>
        )
    }
}

export default graphql(query, {
    props: ({ data: { postsWithPages, refetch }}) => {
        const data = Object.assign({}, postsWithPages)
        return {
            posts: data.posts,
            total: data.total,
            maxPages: data.maxPages,
            page: data.page,
            refetch
        }
    }
})(Posts)