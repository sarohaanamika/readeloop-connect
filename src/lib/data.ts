import { Author, Book, Loan, Publisher, User, UserRole } from "./types";

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
  {
    id: "pub5",
    name: "Hachette Book Group",
    address: "1290 Avenue of the Americas, New York, NY",
    contactInfo: "contact@hachettebookgroup.com",
  },
  {
    id: "pub6",
    name: "Scholastic",
    address: "557 Broadway, New York, NY",
    contactInfo: "scholastic@scholastic.com",
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
  {
    id: "auth9",
    name: "J.R.R. Tolkien",
    bio: "John Ronald Reuel Tolkien was an English writer, poet, philologist, and academic. He was the author of the high fantasy works The Hobbit and The Lord of the Rings.",
  },
  {
    id: "auth10",
    name: "George R.R. Martin",
    bio: "George Raymond Richard Martin is an American novelist, screenwriter, television producer and short story writer. He is the author of the series of epic fantasy novels A Song of Ice and Fire, which was adapted into the Emmy Award-winning HBO series Game of Thrones.",
  },
  {
    id: "auth11",
    name: "Gabriel García Márquez",
    bio: "Gabriel José de la Concordia García Márquez was a Colombian novelist, short-story writer, screenwriter, and journalist, known affectionately as Gabo or Gabito throughout Latin America.",
  },
  {
    id: "auth12",
    name: "Khaled Hosseini",
    bio: "Khaled Hosseini is an Afghan-American novelist and physician. After graduating from college, he worked as a doctor in California, a predicament that he likened to 'an arranged marriage'. He has published three novels, most notably his 2003 debut The Kite Runner.",
  },
  {
    id: "auth13",
    name: "Ray Bradbury",
    bio: "Ray Douglas Bradbury was an American author and screenwriter. One of the most celebrated authors of the 20th century, he worked in a variety of genres, including fantasy, science fiction, horror, and mystery fiction.",
  },
  {
    id: "auth14",
    name: "Octavia E. Butler",
    bio: "Octavia Estelle Butler was an American science fiction author. A multiple recipient of both the Hugo and Nebula awards, she became in 1995 the first science-fiction writer to receive a MacArthur Fellowship.",
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
  {
    id: "book9",
    title: "The Hobbit",
    isbn: "9780547928227",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg",
    description: "Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar. But his contentment is disturbed when the wizard Gandalf and a company of dwarves arrive on his doorstep one day to whisk him away on an adventure.",
    genre: "Fantasy",
    publicationYear: 1937,
    publisherId: "pub1",
    publisher: publishers[0],
    authors: [authors[8]],
    available: true,
    rating: 4.6,
    totalCopies: 7,
    availableCopies: 4,
  },
  {
    id: "book10",
    title: "A Game of Thrones",
    isbn: "9780553593716",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1562726234i/13496.jpg",
    description: "In a land where summers can last decades and winters a lifetime, trouble is brewing. The cold is returning, and in the frozen wastes to the north of Winterfell, sinister forces are massing beyond the kingdom's protective Wall.",
    genre: "Fantasy",
    publicationYear: 1996,
    publisherId: "pub2",
    publisher: publishers[1],
    authors: [authors[9]],
    available: true,
    rating: 4.4,
    totalCopies: 6,
    availableCopies: 2,
  },
  {
    id: "book11",
    title: "One Hundred Years of Solitude",
    isbn: "9780060883287",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327881361i/320.jpg",
    description: "The brilliant, bestselling, landmark novel that tells the story of the Buendia family, and chronicles the irreconcilable conflict between the desire for solitude and the need for love—in rich, imaginative prose that has come to define an entire genre known as 'magical realism.'",
    genre: "Literary Fiction",
    publicationYear: 1967,
    publisherId: "pub3",
    publisher: publishers[2],
    authors: [authors[10]],
    available: true,
    rating: 4.3,
    totalCopies: 4,
    availableCopies: 3,
  },
  {
    id: "book12",
    title: "The Kite Runner",
    isbn: "9781594631931",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1579036753i/77203.jpg",
    description: "The unforgettable, heartbreaking story of the unlikely friendship between a wealthy boy and the son of his father's servant, The Kite Runner is a beautifully crafted novel set in a country that is in the process of being destroyed.",
    genre: "Historical Fiction",
    publicationYear: 2003,
    publisherId: "pub4",
    publisher: publishers[3],
    authors: [authors[11]],
    available: true,
    rating: 4.5,
    totalCopies: 5,
    availableCopies: 3,
  },
  {
    id: "book13",
    title: "Fahrenheit 451",
    isbn: "9781451673319",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1383718290i/13079982.jpg",
    description: "Guy Montag is a fireman. In his world, where television rules and literature is on the brink of extinction, firemen start fires rather than put them out. His job is to destroy the most illegal of commodities, the printed book, along with the houses in which they are hidden.",
    genre: "Science Fiction",
    publicationYear: 1953,
    publisherId: "pub5",
    publisher: publishers[4],
    authors: [authors[12]],
    available: true,
    rating: 4.2,
    totalCopies: 6,
    availableCopies: 4,
  },
  {
    id: "book14",
    title: "Kindred",
    isbn: "9780807083697",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1339423248i/60931.jpg",
    description: "Dana, a modern black woman, is celebrating her twenty-sixth birthday with her new husband when she is snatched abruptly from her home in California and transported to the antebellum South.",
    genre: "Science Fiction",
    publicationYear: 1979,
    publisherId: "pub6",
    publisher: publishers[5],
    authors: [authors[13]],
    available: true,
    rating: 4.4,
    totalCopies: 4,
    availableCopies: 2,
  },
  {
    id: "book15",
    title: "The Lord of the Rings",
    isbn: "9780618640157",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1566425108i/33.jpg",
    description: "In ancient times the Rings of Power were crafted by the Elven-smiths, and Sauron, the Dark Lord, forged the One Ring, filling it with his own power so that he could rule all others. But the One Ring was taken from him, and though he sought it throughout Middle-earth, it remained lost to him.",
    genre: "Fantasy",
    publicationYear: 1954,
    publisherId: "pub1",
    publisher: publishers[0],
    authors: [authors[8]],
    available: true,
    rating: 4.9,
    totalCopies: 8,
    availableCopies: 5,
  },
  {
    id: "book16",
    title: "A Storm of Swords",
    isbn: "9780553381702",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1571318786i/62291.jpg",
    description: "Of the five contenders for power, one is dead, another in disfavor, and still the wars rage as violently as ever, as alliances are made and broken. Joffrey, of House Lannister, sits on the Iron Throne, the uneasy ruler of the land of the Seven Kingdoms.",
    genre: "Fantasy",
    publicationYear: 2000,
    publisherId: "pub2",
    publisher: publishers[1],
    authors: [authors[9]],
    available: true,
    rating: 4.5,
    totalCopies: 5,
    availableCopies: 3,
  },
];

// Sample Users

export const users: User[] = [
  {
    id: "user1",
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password", // Add password field
    role: UserRole.MEMBER,
    permissions: {
      canManageBooks: false,
      canManageUsers: false,
      canBorrowBooks: true
    },
    membershipStartDate: "2023-01-15",
    address: "123 Main St, Anytown, USA",
    phoneNumber: "555-123-4567",
    profile: {
      avatarUrl: "/images/avatars/john-doe.jpg",
      membershipType: "Standard",
      joinDate: "2023-01-15"
    }
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    password: "password", // Add password field
    role: UserRole.MEMBER,
    permissions: {
      canManageBooks: false,
      canManageUsers: false,
      canBorrowBooks: true
    },
    membershipStartDate: "2023-02-20",
    address: "456 Oak Ave, Somewhere, USA",
    phoneNumber: "555-987-6543",
    profile: {
      avatarUrl: "/images/avatars/jane-smith.jpg",
      membershipType: "Standard",
      joinDate: "2023-02-20"
    }
  },
  {
    id: "user3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    password: "password", // Add password field
    role: UserRole.STAFF,
    permissions: {
      canManageBooks: true,
      canManageUsers: false,
      canBorrowBooks: true
    },
    address: "789 Elm St, Nowhere, USA",
    phoneNumber: "555-456-7890",
    profile: {
      avatarUrl: "/images/avatars/robert-johnson.jpg",
      membershipType: "Staff",
      joinDate: "2023-03-01"
    }
  },
  {
    id: "user4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    password: "password", // Add password field
    role: UserRole.ADMIN,
    permissions: {
      canManageBooks: true,
      canManageUsers: true,
      canBorrowBooks: true
    },
    address: "101 Pine Rd, Everywhere, USA",
    phoneNumber: "555-234-5678",
    profile: {
      avatarUrl: "/images/avatars/sarah-williams.jpg",
      membershipType: "Admin",
      joinDate: "2023-01-01"
    }
  }
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
