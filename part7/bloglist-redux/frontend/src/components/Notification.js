import React from 'react'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'

const StyledDiv = styled.div`
	border-radius: 5px;
	padding: 10px;
	background: lightgray;
	margin-bottom: 1rem;

	${(props) => (props.error && css`
		color: red;
		background: #ffcccc
	`) ||
		css`
		color: green;
		background: #c8f7d1`}

`

const Notification = (props) => {
	const message = props.notification.message
	const error = props.notification.error

	if (message === null) {
		return null
	} else {
		return (
			<StyledDiv id="notification" error={error}>
				{message}
			</StyledDiv>
		)
	}
}

const mapStateToProps = (state) => {
	return { notification: state.notification }
}

export default connect(mapStateToProps, null)(Notification) 