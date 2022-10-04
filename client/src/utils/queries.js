import { gql } from '@apollo/client';

export const QUERY_ME = gql`
    query me {
        me {
          password
          email
          username
          _id
          savedBooks {
            authors
            description
            bookId
            image
            link
            title
          }
        }
      }
`;