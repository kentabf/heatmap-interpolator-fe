import React from 'react'

import { ThemeConsumer } from '../contexts/theme'

export default function ErrorMessage({ errorMessage, defaultInstruction }) {
	const instructionMessage = defaultInstruction? defaultInstruction : 'Please try again'
	const errorString = `Error: ${errorMessage}`
	if (errorMessage) {
		return (
			<ThemeConsumer>
				{({ theme }) => (
					<div className={`error-message-${theme}`}>
						{errorString}<br/>
						{instructionMessage}
					</div>
				)}
			</ThemeConsumer>
		)	
	} else {
		return null
	}

}