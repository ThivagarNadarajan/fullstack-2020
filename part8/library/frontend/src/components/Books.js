import React, { useState } from 'react'
import { ALL_BOOKS } from '../graphql/queries'
import { useQuery } from '@apollo/client'

const Books = (props) => {
	const result = useQuery(ALL_BOOKS, {
		pollInterval: 2000
	})
	const [filter, setFilter] = useState('')
	let displayedBooks = []

	if (!props.show) {
		return null
	}

	if (result.loading) {
		return <div>...Books Loading</div>
	}

	const books = [...result.data.allBooks]

	let genres = []

	books.forEach(b => {
		b.genres.forEach(g => {
			if (!genres.includes(g)) genres = genres.concat(g)
		})
	})

	if (filter === '') {
		displayedBooks = [...books]
	} else {
		displayedBooks = [...books.filter(b =>
			b.genres.find(g => filter === g)
		)]
	}

	return (
		<div>
			<h2>Books</h2>

			<table>
				<tbody>
					<tr>
						<th></th>
						<th>
							author
            </th>
						<th>
							published
            </th>
					</tr>
					{displayedBooks.map(b =>
						<tr key={b.title}>
							<td>{b.title}</td>
							<td>{b.author.name}</td>
							<td>{b.published}</td>
						</tr>
					)}
				</tbody>
			</table>

			<h3>Genres</h3>
			Filter By Genre:
			{genres.map(g =>
				<button key={g} onClick={(event) => setFilter(event.target.value)}
					value={g}>
					{g}
				</button>)}
			<button onClick={(event) => setFilter('')}>All</button>

		</div>
	)
}

export default Books