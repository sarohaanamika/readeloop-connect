
import { Author, Book, Loan, Publisher, User } from "./types";

// Sample Publishers
export const publishers: Publisher[] = [
  {
    id: "pub1",
    name: "Penguin Random House",
    address: "1745 Broadway, New York, NY",
    contactInfo: "info@penguinrandomhouse.com",
  },
  {
    id: "pub2",
    name: "HarperCollins",
    address: "195 Broadway, New York, NY",
    contactInfo: "contact@harpercollins.com",
  },
  {
    id: "pub3",
    name: "Macmillan Publishers",
    address: "120 Broadway, New York, NY",
    contactInfo: "info@macmillan.com",
  },
  {
    id: "pub4",
    name: "Simon & Schuster",
    address: "1230 Avenue of the Americas, New York, NY",
    contactInfo: "customerservice@simonandschuster.com",
  },
];

// Sample Authors
export const authors: Author[] = [
  {
    id: "auth1",
    name: "Jane Austen",
    bio: "Jane Austen was an English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century.",
  },
  {
    id: "auth2",
    name: "George Orwell",
    bio: "Eric Arthur Blair, known by his pen name George Orwell, was an English novelist, essayist, journalist and critic. His work is characterized by lucid prose, social criticism, opposition to totalitarianism, and support of democratic socialism.",
  },
  {
    id: "auth3",
    name: "Haruki Murakami",
    bio: "Haruki Murakami is a Japanese writer. His novels, essays, and short stories have been bestsellers in Japan and internationally, with his work translated into 50 languages and has sold millions of copies.",
  },
  {
    id: "auth4",
    name: "J.K. Rowling",
    bio: "Joanne Rowling, better known by her pen name J. K. Rowling, is a British author and philanthropist. She wrote Harry Potter, which has won multiple awards and sold more than 500 million copies.",
  },
  {
    id: "auth5",
    name: "Stephen King",
    bio: "Stephen Edwin King is an American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels. His books have sold more than 350 million copies.",
  },
  {
    id: "auth6",
    name: "Agatha Christie",
    bio: "Dame Agatha Mary Clarissa Christie, Lady Mallowan, was an English writer known for her 66 detective novels and 14 short story collections, particularly those revolving around fictional detectives Hercule Poirot and Miss Marple.",
  },
  {
    id: "auth7",
    name: "F. Scott Fitzgerald",
    bio: "Francis Scott Key Fitzgerald was an American novelist, essayist, and short-story writer. He is best known for his novels depicting the flamboyance and excess of the Jazz Age.",
  },
  {
    id: "auth8",
    name: "Toni Morrison",
    bio: "Toni Morrison was an American novelist, essayist, book editor, and college professor. Her first novel, The Bluest Eye, was published in 1970. The critically acclaimed Song of Solomon brought her national attention and won the National Book Critics Circle Award.",
  },
];

// Sample Books
export const books: Book[] = [
  {
    id: "book1",
    title: "Pride and Prejudice",
    isbn: "9780679783268",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg",
    description: "Pride and Prejudice follows the turbulent relationship between Elizabeth Bennet, the daughter of a country gentleman, and Fitzwilliam Darcy, a rich aristocratic landowner. They must overcome the titular sins of pride and prejudice in order to fall in love and marry.",
    genre: "Classic Literature",
    publicationYear: 1813,
    publisherId: "pub1",
    publisher: publishers[0],
    authors: [authors[0]],
    available: true,
    rating: 4.7,
    totalCopies: 5,
    availableCopies: 3,
  },
  {
    id: "book2",
    title: "1984",
    isbn: "9780451524935",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1532714506i/40961427.jpg",
    description: "1984 is a dystopian novella by George Orwell published in 1949, which follows the life of Winston Smith, a low ranking member of 'the Party', who is frustrated by the omnipresent eyes of the party, and its ominous ruler Big Brother. 'Big Brother' controls every aspect of people's lives.",
    genre: "Dystopian",
    publicationYear: 1949,
    publisherId: "pub2",
    publisher: publishers[1],
    authors: [authors[1]],
    available: true,
    rating: 4.5,
    totalCopies: 8,
    availableCopies: 5,
  },
  {
    id: "book3",
    title: "Norwegian Wood",
    isbn: "9780375704024",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1699682546i/11297.jpg",
    description: "Norwegian Wood is a 1987 novel by Japanese author Haruki Murakami. The novel is a nostalgic story of loss and burgeoning sexuality. It is told from the first-person perspective of Toru Watanabe, who looks back on his days as a college student living in Tokyo.",
    genre: "Contemporary Fiction",
    publicationYear: 1987,
    publisherId: "pub3",
    publisher: publishers[2],
    authors: [authors[2]],
    available: true,
    rating: 4.1,
    totalCopies: 3,
    availableCopies: 2,
  },
  {
    id: "book4",
    title: "Harry Potter and the Philosopher's Stone",
    isbn: "9780747532743",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg",
    description: "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with some astonishing news: Harry Potter is a wizard, and he has a place at Hogwarts School of Witchcraft and Wizardry.",
    genre: "Fantasy",
    publicationYear: 1997,
    publisherId: "pub4",
    publisher: publishers[3],
    authors: [authors[3]],
    available: true,
    rating: 4.8,
    totalCopies: 10,
    availableCopies: 7,
  },
  {
    id: "book5",
    title: "The Shining",
    isbn: "9780307743657",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1353277730i/11588.jpg",
    description: "Jack Torrance's new job at the Overlook Hotel is the perfect chance for a fresh start. As the off-season caretaker at the atmospheric old hotel, he'll have plenty of time to spend reconnecting with his family and working on his writing. But as the harsh winter weather sets in, the idyllic location feels ever more remote...and more sinister. And the only one to notice the strange and terrible forces gathering around the Overlook is Danny Torrance, a uniquely gifted five-year-old.",
    genre: "Horror",
    publicationYear: 1977,
    publisherId: "pub2",
    publisher: publishers[1],
    authors: [authors[4]],
    available: true,
    rating: 4.4,
    totalCopies: 4,
    availableCopies: 1,
  },
  {
    id: "book6",
    title: "Murder on the Orient Express",
    isbn: "9780062073501",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1486131451i/853510.jpg",
    description: "Just after midnight, a snowdrift stopped the Orient Express in its tracks. The luxurious train was surprisingly full for the time of the year. But by the morning there was one passenger fewer. An American lay dead in his compartment, stabbed a dozen times, his door locked from the inside.",
    genre: "Mystery",
    publicationYear: 1934,
    publisherId: "pub1",
    publisher: publishers[0],
    authors: [authors[5]],
    available: true,
    rating: 4.3,
    totalCopies: 6,
    availableCopies: 4,
  },
  {
    id: "book7",
    title: "The Great Gatsby",
    isbn: "9780743273565",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg",
    description: "The Great Gatsby, F. Scott Fitzgerald's third book, stands as the supreme achievement of his career. This exemplary novel of the Jazz Age has been acclaimed by generations of readers. The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted 'gin was the national drink and sex the national obsession,' it is an exquisitely crafted tale of America in the 1920s.",
    genre: "Classic Literature",
    publicationYear: 1925,
    publisherId: "pub4",
    publisher: publishers[3],
    authors: [authors[6]],
    available: true,
    rating: 4.2,
    totalCopies: 5,
    availableCopies: 3,
  },
  {
    id: "book8",
    title: "Beloved",
    isbn: "9781400033416",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1347984578i/6149.jpg",
    description: "Staring unflinchingly into the abyss of slavery, this spellbinding novel transforms history into a story as powerful as Exodus and as intimate as a lullaby. Sethe, its protagonist, was born a slave and escaped to Ohio, but eighteen years later she is still not free. She has too many memories of Sweet Home, the beautiful farm where so many hideous things happened. And Sethe's new home is haunted by the ghost of her baby, who died nameless and whose tombstone is engraved with a single word: Beloved.",
    genre: "Historical Fiction",
    publicationYear: 1987,
    publisherId: "pub3",
    publisher: publishers[2],
    authors: [authors[7]],
    available: true,
    rating: 4.0,
    totalCopies: 4,
    availableCopies: 2,
  },
];

// Sample Users
export const users: User[] = [
  {
    id: "user1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "member",
    membershipStartDate: "2023-01-15",
    address: "123 Main St, Anytown, USA",
    phoneNumber: "555-123-4567",
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "member",
    membershipStartDate: "2023-02-20",
    address: "456 Oak Ave, Somewhere, USA",
    phoneNumber: "555-987-6543",
  },
  {
    id: "user3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "staff",
    address: "789 Elm St, Nowhere, USA",
    phoneNumber: "555-456-7890",
  },
  {
    id: "user4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "admin",
    address: "101 Pine Rd, Everywhere, USA",
    phoneNumber: "555-234-5678",
  },
];

// Sample Loans
export const loans: Loan[] = [
  {
    id: "loan1",
    memberId: "user1",
    bookId: "book1",
    loanDate: "2023-06-01",
    dueDate: "2023-06-15",
    returnDate: "2023-06-14",
    status: "returned",
  },
  {
    id: "loan2",
    memberId: "user2",
    bookId: "book3",
    loanDate: "2023-06-05",
    dueDate: "2023-06-19",
    status: "active",
  },
  {
    id: "loan3",
    memberId: "user1",
    bookId: "book5",
    loanDate: "2023-06-10",
    dueDate: "2023-06-24",
    status: "active",
  },
  {
    id: "loan4",
    memberId: "user2",
    bookId: "book7",
    loanDate: "2023-05-25",
    dueDate: "2023-06-08",
    status: "overdue",
  },
];

// Get Complete Loan Data with Book and User Information
export const getLoansWithDetails = () => {
  return loans.map(loan => {
    const book = books.find(b => b.id === loan.bookId);
    const member = users.find(u => u.id === loan.memberId);
    return { ...loan, book, member };
  });
};

// Helper function to filter books
export const filterBooks = (filters: { search?: string; genre?: string; available?: boolean }) => {
  let filtered = [...books];
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      book => 
        book.title.toLowerCase().includes(searchLower) || 
        book.authors.some(author => author.name.toLowerCase().includes(searchLower)) ||
        book.genre.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters.genre) {
    filtered = filtered.filter(book => book.genre === filters.genre);
  }
  
  if (filters.available !== undefined) {
    filtered = filtered.filter(book => book.availableCopies > 0 === filters.available);
  }
  
  return filtered;
};

// Get all unique genres from books
export const getGenres = () => {
  const genres = new Set<string>();
  books.forEach(book => genres.add(book.genre));
  return Array.from(genres);
};

// Get book recommendations based on genre and user history
export const getRecommendations = (userId: string, count: number = 4) => {
  // Get user's loan history
  const userLoans = loans.filter(loan => loan.memberId === userId);
  
  // Get genres the user has previously read
  const userBookIds = userLoans.map(loan => loan.bookId);
  const userBooks = books.filter(book => userBookIds.includes(book.id));
  const userGenres = new Set(userBooks.map(book => book.genre));
  
  // Find books in those genres that the user hasn't read yet
  let recommendations = books.filter(
    book => 
      userGenres.has(book.genre) && 
      !userBookIds.includes(book.id) &&
      book.availableCopies > 0
  );
  
  // If we don't have enough recommendations, add some popular books
  if (recommendations.length < count) {
    const popularBooks = books
      .filter(book => !userBookIds.includes(book.id) && book.availableCopies > 0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));
    
    recommendations = [
      ...recommendations,
      ...popularBooks.filter(book => !recommendations.includes(book))
    ];
  }
  
  return recommendations.slice(0, count);
};
