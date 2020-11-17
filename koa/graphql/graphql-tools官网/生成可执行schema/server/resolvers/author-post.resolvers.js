import { filter, propEq } from "ramda";
import { authors, posts } from "../db/authors-posts";


const authorPostResolver = {
    Query: {
        posts: () => posts,
        author: (parent, { id }) => {
            console.log("1. parent---> ", parent)
            return authors.find(author => author.id === id)
        },
        getAuthor: (parent, {id}) => {
            // 返回这个作者下的贴子
            console.log("2. parent---> ", parent)
            return authors.find(author => author.id === id)
        }
    },

    Mutation: {
        // 顶贴的函数
        upvotePost: (_, { postId }) => {
            console.log('postId ---> ', postId)
            const post = posts.find(post => post.id === postId)
            if (!post) {
                throw new Error(`Couldn't find post with id ${postId}`);
            }
            post.votes += 1;
            return post;
        },
    },

    Author: {
        // 根据贴子的作者的id 查找贴子
        posts: (author) => {
            // return posts.filter(post => author.id === post.authorId)
            return filter(propEq('authorId', author.id), posts)
        }
    },
    Post: {
        // 根据帖子找到作者
        author: post => authors.find(author => post.authorId === author.id)
    }
}

export default authorPostResolver