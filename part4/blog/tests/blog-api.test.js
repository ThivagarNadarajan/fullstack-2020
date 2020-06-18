const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

/* 6 Blogs */
const initialBlogs = [{ _id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, __v: 0 }, { _id: "5a422aa71b54a676234d17f8", title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5, __v: 0 }, { _id: "5a422b3a1b54a676234d17f9", title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12, __v: 0 }, { _id: "5a422b891b54a676234d17fa", title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10, __v: 0 }, { _id: "5a422ba71b54a676234d17fb", title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0, __v: 0 }, { _id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, __v: 0 }
]

beforeEach(async () => {
	await Blog.deleteMany({})
	for (let blog of initialBlogs) {
		let blogObj = new Blog(blog)
		await blogObj.save()
	}
})

test('blog-api get all', async () => {
	const res = await api.get('/api/blogs')
	expect(res.body.length).toBe(6)
})

test('blog-api id property', async () => {
	const res = await api.get('/api/blogs')
	for (let blog of res.body) {
		expect(blog.id).toBeDefined()
	}
})

test('blog-api post', async () => {
	const newBlog = { author: "Thivagar", likes: 0 }
	await api
		.post('/api/blogs').send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const newList = await Blog.find({})
	expect(newList.length).toBe(initialBlogs.length + 1)
})

test('blog-api likes default 0', async () => {
	await Blog.deleteMany({})
	const newBlog = { author: "Thivagar" }
	await api
		.post('/api/blogs').send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const newList = await Blog.find({})
	expect(newList.length).toBe(1)
	expect(newList[0].likes).toBe(0)
})

test('blog-api url & title missing', async () => {
	const newBlog = { author: "Thivagar", likes: 0 }
	await api
		.post('/api/blogs').send(newBlog)
		.expect(400)

	const newList = await Blog.find({})
	expect(newList.length).toBe(initialBlogs.length)
})

afterAll(() => {
	mongoose.connection.close()
})