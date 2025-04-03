
// src/pages/ManageBooks.tsx
import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@/lib/types';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  available: number;
}

export const ManageBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', available: 0 });

  const addBook = () => {
    const book: Book = {
      ...newBook,
      id: Date.now().toString()
    };
    setBooks([...books, book]);
    setNewBook({ title: '', author: '', isbn: '', available: 0 });
  };

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <div className="manage-books">
        <h1>Manage Books</h1>
        <div className="add-book-form">
          <input 
            placeholder="Title" 
            value={newBook.title}
            onChange={(e) => setNewBook({...newBook, title: e.target.value})}
          />
          <input 
            placeholder="Author" 
            value={newBook.author}
            onChange={(e) => setNewBook({...newBook, author: e.target.value})}
          />
          <input 
            placeholder="ISBN" 
            value={newBook.isbn}
            onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
          />
          <input 
            type="number" 
            placeholder="Available Copies" 
            value={newBook.available}
            onChange={(e) => setNewBook({...newBook, available: parseInt(e.target.value)})}
          />
          <button onClick={addBook}>Add Book</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.isbn}</td>
                <td>{book.available}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProtectedRoute>
  );
};
