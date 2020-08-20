import React, { useState } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { ME, BOOKS_BY_GENRE } from '../queries'

const Recommendations = (props) => {
	const { data: userData, loading: userLoading } = useQuery(ME)
	const genre = userData?.me?.favouriteGenre
	const { data: bookData, bookLoading: bookLoading } = useQuery(BOOKS_BY_GENRE,
		{ variables: { genre }, pollInterval: 2000 }
	)

	if (!props.show) {
		return null
	}

	if (userLoading || bookLoading) {
		return <div>...Recommendation loading</div>
	}

	const books = bookData?.allBooks

	return (
		<div>
			<h2>Recommendations</h2>
			<p>Books in your favourite genre: <b>{genre}</b></p>
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
					{books.map(b =>
						<tr key={b.title}>
							<td>{b.title}</td>
							<td>{b.author.name}</td>
							<td>{b.published}</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}

export default Recommendations