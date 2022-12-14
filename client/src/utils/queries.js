import { gql } from '@apollo/client' 

export const QUERY_SAVED = gql`
    query getSingleUser($username: String, $userId: ID!) {
        getSingleUser(username: $username, userId: $userId) {
            _id
            username
            savedBooks {
                title
                link
                image
                description
                bookId
                authors
            }
        } 
    }
    `;