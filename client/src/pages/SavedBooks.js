import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_SAVED } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
  // const [userData, setUserData] = useState({});
  // use this to determine if `useEffect()` hook needs to run again
  const { loading, data: userData } = useQuery(QUERY_SAVED, {
    variables: { userId: Auth.getProfile().data._id }
  });
  let deletedBookId;
  const [ deleteBook, {error, data}] = useMutation(REMOVE_BOOK, {
    update(cache, {data: {removeBookId}}) {
      try {
        const { getSingleUser } = cache.readQuery({ query: QUERY_SAVED });

        cache.writeQuery({
          query: QUERY_SAVED,
          data: { getSingleUser: {...getSingleUser, savedBooks: getSingleUser.savedBooks.filter((book) => book.bookId != deletedBookId)}}
        })
        
      } catch (error) {
        
      }
    }
  });
  const userDataBooks = userData?.getSingleUser.savedBooks || []

  if(!loading){
    console.log("user data", userData.getSingleUser.savedBooks);
  }
  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await deleteBook({
        variables: { userId: Auth.getProfile().data._id, bookId },
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
      deletedBookId = bookId;
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
