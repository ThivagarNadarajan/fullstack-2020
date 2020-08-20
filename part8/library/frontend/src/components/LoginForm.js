import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setToken }) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [login, result] = useMutation(LOGIN, {
		onError: (error) => {
			console.log(error)
		}
	})

	useEffect(() => {
		if (result.data) {
			const token = result.data.login.value
			setToken(token)
			localStorage.setItem('user-token', token)
		}
	}, [result.data])


	const handleLogin = (event) => {
		event.preventDefault()
		login({ variables: { username, password } })
		setUsername('')
		setPassword('')
	}

	return (
		<form onSubmit={handleLogin}>
			<input placeholder="Username" value={username}
				onChange={event => setUsername(event.target.value)}>
			</input>
			<br />
			<input placeholder="Password" value={password}
				onChange={event => setPassword(event.target.value)}>
			</input>
			<br />
			<button type="submit">Login</button>
		</form>
	)
}

export default LoginForm