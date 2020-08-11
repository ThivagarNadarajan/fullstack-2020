import React, { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import { useQuery, useMutation } from '@apollo/client'

const Authors = (props) => {
	const [author, setAuthor] = useState('Robert Martin')
	const [year, setYear] = useState('')
	const [editAuthor] = useMutation(EDIT_AUTHOR)
	const result = useQuery(ALL_AUTHORS, {
		pollInterval: 2000
	})

	const selectChange = (event) => {
		setAuthor(event.target.value)
	}

	const textChange = (event) => {
		setYear(event.target.value)
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		editAuthor({ variables: { name: author, setBornTo: parseInt(year) } })
		setYear('')
	}

	if (!props.show) {
		return null
	}

	if (result.loading) {
		return <div>...Authors Loading</div>
	}

	const authors = [...result.data.allAuthors]

	return (
		<div>
			<h2>authors</h2>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>
							born
            </th>
						<th>
							books
            </th>
					</tr>
					{authors.map(a =>
						<tr key={a.id}>
							<td>{a.name}</td>
							<td>{a.born}</td>
							<td>{a.bookCount}</td>
						</tr>
					)}
				</tbody>
			</table>

			<h3>Set Birth Year</h3>
			<form onSubmit={handleSubmit}>
				<select value={author} onChange={selectChange}>
					{authors.map(a =>
						<option key={a.id} value={a.name}>
							{a.name}
						</option>
					)}
				</select>
				<br />
				<input placeholder="Year" onChange={textChange} value={year}></input>
				<br />
				<button type="submit">Update</button>
			</form>

		</div>
	)
}

export default Authors
