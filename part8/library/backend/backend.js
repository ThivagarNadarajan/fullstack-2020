const { ApolloServer, UserInputError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const MONGODB_URI = require('./constants.js')

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
	.then(() => {
		console.log('Connected to MongoDB')
	})
	.catch(error => {
		console.log('Error: connection to MongoDB:', error.message)
	})

let authors = [
	{
		name: 'Robert Martin',
		id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
		born: 1952,
	},
	{
		name: 'Martin Fowler',
		id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
		born: 1963
	},
	{
		name: 'Fyodor Dostoevsky',
		id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
		born: 1821
	},
	{
		name: 'Joshua Kerievsky', // birthyear not known
		id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
	},
	{
		name: 'Sandi Metz', // birthyear not known
		id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
	},
]

let books = [
	{
		title: 'Clean Code',
		published: 2008,
		author: 'Robert Martin',
		id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
		genres: ['refactoring']
	},
	{
		title: 'Agile software development',
		published: 2002,
		author: 'Robert Martin',
		id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
		genres: ['agile', 'patterns', 'design']
	},
	{
		title: 'Refactoring, edition 2',
		published: 2018,
		author: 'Martin Fowler',
		id: "afa5de00-344d-11e9-a414-719c6709cf3e",
		genres: ['refactoring']
	},
	{
		title: 'Refactoring to patterns',
		published: 2008,
		author: 'Joshua Kerievsky',
		id: "afa5de01-344d-11e9-a414-719c6709cf3e",
		genres: ['refactoring', 'patterns']
	},
	{
		title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
		published: 2012,
		author: 'Sandi Metz',
		id: "afa5de02-344d-11e9-a414-719c6709cf3e",
		genres: ['refactoring', 'design']
	},
	{
		title: 'Crime and punishment',
		published: 1866,
		author: 'Fyodor Dostoevsky',
		id: "afa5de03-344d-11e9-a414-719c6709cf3e",
		genres: ['classic', 'crime']
	},
	{
		title: 'The Demon ',
		published: 1872,
		author: 'Fyodor Dostoevsky',
		id: "afa5de04-344d-11e9-a414-719c6709cf3e",
		genres: ['classic', 'revolution']
	},
]

const typeDefs = gql`
	type Author {
		name: String!
		id: ID!
		born: Int
		bookCount: Int!
	}

	type Book {
		title: String!
		published: Int!
		author: Author!
		id: ID!
		genres: [String!]!
	}

  	type Query {
	  bookCount: Int!
	  authorCount: Int!
	  allBooks(author: String, genre: String): [Book!]!
	  allAuthors: [Author!]!
  }

  type Mutation {
	  addBook(
		title: String!
		published: Int!
		author: String!
		genres: [String!]!
	  ): Book
	  editAuthor(
		name: String!
		setBornTo: Int!
	  ): Author
  }
`

const resolvers = {
	Query: {
		bookCount: () => Book.collection.countDocuments(),
		authorCount: () => Author.collection.countDocuments(),
		allBooks: async (root, args) => {
			let filteredBooks = await Book.find({}).populate('author', { name: 1, born: 1, id: 1 })
			if (args.author || args.genre) {
				if (args.genre) {
					filteredBooks = filteredBooks.filter(b =>
						b.genres.find(g => g === args.genre)
					)
				}
			}
			return filteredBooks

		},
		allAuthors: () => Author.find({})
	},
	Author: {
		bookCount: async (root) => {
			const books = await Book.find({}).populate('author', { name: 1 })
			const writtenBooks = books.filter(b => b.author.name === root.name)
			return writtenBooks.length
		}
	},
	Mutation: {
		addBook: async (root, args) => {
			const author = await Author.findOne({ name: args.author })
			if (author) {
				const book = new Book({ ...args, author: author._id })
				let bookResult
				try {
					bookResult = await book.save()
				} catch (error) {
					throw new UserInputError(error.message, {
						invalidArgs: args
					})
				}
				return bookResult
			} else {
				const newAuthor = new Author({ name: args.author })
				let authorResult
				try {
					authorResult = await newAuthor.save()
				} catch (error) {
					throw new UserInputError(error.message, {
						invalidArgs: args
					})
				}

				const book = new Book({ ...args, author: authorResult._id })
				let bookResult
				try {
					bookResult = await book.save()
				} catch (error) {
					throw new UserInputError(error.message, {
						invalidArgs: args
					})
				}
				return bookResult
			}
		},
		editAuthor: async (root, args) => {
			await Author.findOneAndUpdate(
				{ name: args.name }, { born: args.setBornTo }
			)
			const result = await Author.findOne({ name: args.name })
			return result
		}
	}
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
})

server.listen().then(({ url }) => {
	console.log(`Server ready at ${url}`)
})
