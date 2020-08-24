import React from 'react'

import { ThemeConsumer } from '../contexts/theme'

export default function Title () {
	
	return (
		<ThemeConsumer>
			{({ theme }) => (
				<div>
					<div className={`title title-${theme}`}>
						heatmap interpolator
					</div>
				</div>
			)}
		</ThemeConsumer>
	)

}