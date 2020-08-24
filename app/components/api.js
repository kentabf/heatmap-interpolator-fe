import React from 'react'

import { ThemeConsumer } from '../contexts/theme'
import { exampleJSON } from '../utils/exampleJson'

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

export default class Api extends React.Component {

	componentDidMount() {
		document.getElementById("json").innerHTML = JSON.stringify(exampleJSON, undefined, 3);
	}
	
	render() {
		return (
			<ThemeConsumer>
				{({ theme }) => (
					<div className={`inner-container bg-${theme}`}>
						<div className='room-panel-detail'>
							<h1 className={`room-title room-title-${theme}`}>
								About the API
							</h1>
							<div className='about'>
								<h2>
								<br/>The API
								</h2>
								<p>
								The API is simply a {mT('POST')} to {mT('https://heatmap-interpolator.herokuapp.com')},
								using a JSON post body.
								</p>
								<p>
								The JSON will have the following:
								</p>
								<div>
									<ul className='about-list'>
										<li>
											required field {mT('interpolatorType')}, which must be one of {mT('idw')}, {mT('barnes')},
											{mT('rbf')}, {mT('nn')}, or {mT('wrapper')} (corresponding to the different algorithms).
										</li>
										<li>
											required field {mT('data')}, which in turn has {mT('width')}, {mT('height')}, and {mT('sample')}. 
											See below for how to format {mT('sample')}.
										</li>
										<li>
											optional field {mT('scale')}. If omitted, default scale is used (the default red-to-violet scale is
											shown below in the example.)
										</li>
									</ul>
								</div>
								<h2>
								<br/>Example
								</h2>
								<pre id="json"></pre>
							</div>					
						</div>
					</div>
				)}
			</ThemeConsumer>
		)
	}


}

