const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _!id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }
    type Book {
        bookId: ID!
        authors: [String]
        description: String!
        title: String!
        image: String
        link: String
    }
    type Auth {
        token: ID!
        user: User
    }
    type Query {
        me: User
    }
    type Mutation {
        createUser(username: String!, email: string!, password: String!): Auth login(email: String!, password: String!): Auth saveBook(authors: [String]), description: String!, title: String!, bookID: String!, image: String, link: string): User removeBook(bookId: ID!): User
    }
    `