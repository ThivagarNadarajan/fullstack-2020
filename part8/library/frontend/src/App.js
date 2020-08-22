import React, { useState } from 'react'

import LoginForm from './components/LoginForm'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommendations from './components/Recommendations'

import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED } from './graphql/subscriptions'

const App = () => {
	const [page, setPage] = useState('authors')
	const [token, setToken] = useState(null)
	const client = useApolloClient()

	const handleLogout = () => {
		setToken(null)
		localStorage.clear()
		client.resetStore()
	}

	useSubscription(BOOK_ADDED, {
		onSubscriptionData: ({ subscriptionData }) => {
			alert("New book added: " + subscriptionData.data.bookAdded.title)
		}
	})

	if (!token) {
		return (
			<div>
				<h2>Login</h2>
				<LoginForm setToken={setToken} />
			</div>
		)
	}

	return (
		<div>
			<div>
				<button onClick={() => setPage('authors')}>Authors</button>
				<button onClick={() => setPage('books')}>Books</button>
				<button onClick={() => setPage('add')}>Add Book</button>
				<button onClick={() => setPage('recommend')}>Recommend</button>
				<button onClick={handleLogout}>Log Out</button>
			</div>

			<Authors
				show={page === 'authors'}
			/>

			<Books
				show={page === 'books'}
			/>

			<NewBook
				show={page === 'add'}
			/>

			<Recommendations
				show={page === 'recommend'}
			/>
		</div>
	)
}

export default App