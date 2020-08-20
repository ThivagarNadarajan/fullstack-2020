const { ApolloServer, UserInputError, gql, AuthenticationError } = require('apollo-server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const config = require('./config.js')
const MONGODB_URI = config.MONGODB_URI
const JWT_SECRET = config.SECRET

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
	.then(() => {
		console.log('Connected to MongoDB')
	})
	.catch(error => {
		console.log('Error: connection to MongoDB:', error.message)
	})

const typeDefs = gql`
	type User {
		username: String!
		favouriteGenre: String!
		id: ID!
	}

	type Token {
		value: String!
	}

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
	  me: User
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
	  createUser(
		username: String!
		favouriteGenre: String!
	  ): User
	  login(
		username: String!
		password: String!
	  ): Token
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
		allAuthors: () => Author.find({}),
		me: (root, args, context) => {
			return context.currentUser
		}
	},
	Author: {
		bookCount: async (root) => {
			const books = await Book.find({}).populate('author', { name: 1 })
			const writtenBooks = books.filter(b => b.author.name === root.name)
			return writtenBooks.length
		}
	},
	Mutation: {
		addBook: async (root, args, context) => {
			const currentUser = context.currentUser
			if (!currentUser) throw new AuthenticationError("Not authenticated")

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
		editAuthor: async (root, args, context) => {
			const currentUser = context.currentUser
			if (!currentUser) throw new AuthenticationError("Not authenticated")

			await Author.findOneAndUpdate(
				{ name: args.name }, { born: args.setBornTo }
			)
			const result = await Author.findOne({ name: args.name })
			return result
		},
		createUser: (root, args, context) => {
			const currentUser = context.currentUser
			if (!currentUser) throw new AuthenticationError("Not authenticated")

			const user = new User({ ...args })
			return user.save()
				.catch(error => {
					throw new UserInputError(error.message, {
						invalidArgs: args
					})
				})

		},
		login: async (root, args) => {
			const user = await User.findOne({ username: args.username })
			if (!user || args.password !== 'pass') {
				throw new UserInputError("Invalid credentials")
			}

			const correctUser = { username: user.username, id: user._id }
			return { value: jwt.sign(correctUser, JWT_SECRET) }
		}
	}
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({ req }) => {
		const auth = req ? req.headers.authorization : null

		if (auth && auth.toLowerCase().startsWith('bearer')) {
			const decodedToken = jwt.verify(
				auth.substring(7), JWT_SECRET
			)
			const currentUser = await User.findById(decodedToken.id)
			return { currentUser }
		}
	}
})

server.listen().then(({ url }) => {
	console.log(`Server ready at ${url}`)
})
