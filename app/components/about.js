import React from 'react'

import { ThemeConsumer } from '../contexts/theme'

export const mT = (text, sub) => {
	return (
		<ThemeConsumer>
			{({ theme }) => (
					<span className={`math math-${theme}`}>
						&nbsp;{text}{sub && <sub>{sub}</sub>}&nbsp;
					</span>
			)}
		</ThemeConsumer>
	)
}

export default class About extends React.Component {

	intext = (text) => {
		const toRender = text? text : 'heatmap interpolator'
		return (
			<ThemeConsumer>
				{({ theme }) => (
						<span style={{fontWeight: 'bold'}} >
							&nbsp;{toRender}&nbsp;
						</span>
				)}
			</ThemeConsumer>
		)
	}
	
	render() {
		return (
			<ThemeConsumer>
				{({ theme }) => (
					<div className={`inner-container bg-${theme}`}>
						<div className='room-panel-detail'>
							<h1 className={`room-title room-title-${theme}`}>
								About heatmap interpolator
							</h1>
							<div className='about'>
								<h2>
								<br/>About
								</h2>
								<p>
								{this.intext()} interpolates and visualizes a grid-based, 3 dimensional data by creating a smooth heatmap.
								</p>
								<p>
								Let there by a blank image of height {mT('h')} and width {mT('w')},
								and a set of existing pixels <span className={`math math-${theme}`}>
								&nbsp;&#123;p<sub>1</sub>, p<sub>2</sub>, ..., p<sub>n</sub>&#125;&nbsp;</span> where each pixel has {mT('y, x, t')}
								values to represent the y coordinate, x coordinate, and temperature of the given pixel, respectively. (Note: top left 
								pixel has coordinates {mT('y=0, x=0')}) This set of pixels becomes the 'data'.
								</p>
								<p>
								Using the data, and a choice of an algorithm, the temperature of all remaining pixels on the image will be interpolated.
								Based on a provided scale that maps temperature to color, each pixel in the image is then colored in. (If no scale is provided, default
								is a red-to-violet scale for normalized temperatures between 0.0 and 1.0).
								</p>
								<p>
								The {this.intext('Canvas')} tool above provides a simple frontend interface with the API. However, it does not support
								all functionalities of the API - for that, check {this.intext('Using the API')}.
								</p>
								<h2>
								<br/>Algorithms
								</h2>
								<p>
								Currently, these are the algorithms supported:
								</p>
								<div>
									<ul className='about-list'>
										<li>
											Inverse distance weighting
											<br/>- for Canvas, power parameter is set to {mT('p=2')}
										</li>
										<li>
											Barnes interpolation
											<br/>- two passes: {mT('gamma=1.0')} in first pass, {mT('gamma=0.3')} in second pass
											<br/>- radius is set to {mT('min(width/2, height/2)')} by default
										</li>
										<li>
											RBF interpolation
											<br/>- inverse multiquadratic function is used as its RBF
										</li>
										<li>
											Nearest neighbor
										</li>
										<li>
											Wrapper earthmap
											<br/>- treats the entire image as a scaled map of Earth. As such,
											the image 'wraps' around at the edges.
										</li>
									</ul>
								</div>
				
							</div>					
						</div>
					</div>
				)}
			</ThemeConsumer>
		)
	}


}