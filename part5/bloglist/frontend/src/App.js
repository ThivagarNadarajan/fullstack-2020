import React, { useState, useEffect } from 'react'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)
	const [notif, setNotif] = useState(null)
	const [error, setError] = useState(false)

	useEffect(() => {
		blogService.getAll().then(blogs => {
			blogs.sort((a, b) => b.likes - a.likes)
			setBlogs(blogs)
		})
	}, [])

	useEffect(() => {
		const loggedUser = window.localStorage.getItem('user')
		if (loggedUser && loggedUser !== 'undefined') {
			const user = JSON.parse(loggedUser)
			setUser(user)
			blogService.setToken(user.token)
		}
	}, [])

	const handleLogin = async event => {
		event.preventDefault()
		let user
		try {
			user = await loginService.login({ username, password })
		} catch {
			setNotif('Failed to log in: invalid credentials')
			setError(true)
			setTimeout(() => setNotif(null), 5000)
			return
		}
		window.localStorage.setItem('user', JSON.stringify(user))
		blogService.setToken(user.token)
		setUser(user)
		setUsername('')
		setPassword('')
		setNotif('Successfully logged in')
		setError(false)
		setTimeout(() => setNotif(null), 5000)
	}

	const handleLogout = () => {
		setUser(null)
		window.localStorage.removeItem('user')
	}

	const textChange = event => {
		switch (event.target.name) {
			case "Username":
				setUsername(event.target.value)
				break
			case "Password":
				setPassword(event.target.value)
				break
			default:
				break
		}
	}

	const addBlog = async (blog) => {
		let addedBlog
		try {
			addedBlog = await blogService.create(blog)
		} catch {
			setNotif('Failed to add blog: missing fields')
			setError(true)
			setTimeout(() => setNotif(null), 5000)
			return
		}
		setBlogs(blogs.concat(addedBlog))
		setNotif('Successfully added blog')
		setError(false)
		setTimeout(() => setNotif(null), 5000)
	}

	const addLike = async (blog) => {
		const updatedBlog = await blogService.update(blog.id, blog)
		const newBlogs = blogs.map(
			b => b.id !== blog.id
				? b
				: updatedBlog
		)
		setBlogs(newBlogs)
	}

	const removeBlog = async (id) => {
		try {
			await blogService.remove(id)
		} catch {
			setNotif('Unauthorized to remove blog')
			setError(true)
			setTimeout(() => setNotif(null), 5000)
			return
		}

		setNotif('Successfully removed blog')
		setError(false)
		setTimeout(() => setNotif(null), 5000)
		const newBlogs = blogs.filter(blog => blog.id !== id)
		setBlogs(newBlogs)
	}

	if (user === null) {
		return (
			<>
				<Notification message={notif} error={error} />
				<LoginForm
					username={username} password={password} handleSubmit={handleLogin}
					handleChange={textChange}
				/>
			</>
		)
	} else {
		return (
			<>
				<Notification message={notif} error={error} />
				<h2>Blogs</h2>
				<div>
					{`${user.name} has logged in.`}
					<button onClick={handleLogout}>Logout</button>
				</div>
				<br />
				<Togglable showLabel="New Blog" hideLabel="Cancel">
					<BlogForm create={addBlog} />
				</Togglable>
				<br />
				{blogs.map(blog => {
					return (
						<Togglable key={blog.id} showLabel="Show" hideLabel="Hide"
							textLabel={`${blog.title} ${blog.author}`}
							style={
								{
									border: "2px solid",
									margin: "0.5rem",
									padding: "4px"
								}
							}>
							<Blog key={blog.id} blog={blog} update={addLike} remove={removeBlog} />
						</Togglable>
					)
				}

				)}
			</>
		)
	}
}

export default App