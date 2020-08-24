import React from 'react'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'

import Loading from './loading'
import ErrorMessage from './error_message'
import { ThemeConsumer } from '../contexts/theme'
import { calcColor, colorPixel, colorSpot } from '../utils/colorUtils'


export default class Canvas extends React.Component {

	defaultValue = 0.5
	lightBackgroundColor = [255, 255, 255, 255]
	darkBackgroundcolor = [0, 0, 0, 255]

	defaultState = {
		width: 500,
		height: 500,
		formWidth: 500,
		formHeight: 500,
		buffer: 10,
		ctx: null,
		imageData: null,
		i: null,
		j: null,
		temperature: this.defaultValue,
		imageSrc: null,
		backgroundColor: [255, 255, 255, 255],
		sample: [],
		error: null,
		loading: false,
		currColor: "rgba(0,255,0,255)"
	}

	state = {...this.defaultState}

	// React
	componentDidMount() {
		this.paintBlankCanvas()
	}

	componentDidUpdate(prevProps, prevState) {
		const { width, height } = this.state
		const prevWidth = prevState.width
		const prevHeight = prevState.height
		if (prevWidth && prevHeight && (width !== prevWidth || height !== prevHeight)) {
			// canvas to be resized with new dimensions
			this.paintBlankCanvas()
		}
	}

	// Custom
	handleChange = (event) => {
		this.setState({
			[event.target.name]: parseInt(event.target.value)
		})
	}

	handleClick = (event) => {
		const { width, height, buffer } = this.state
		const i = event.nativeEvent.offsetY - buffer
		const j = event.nativeEvent.offsetX - buffer
		if (i >= 0 && j >= 0 && i < height && j < width) {
			this.updateColor(i, j, this.defaultValue, [0, 255, 0, 255])
		}
	}

	handleResize = (event) => {
		event.preventDefault()
		const { formWidth, formHeight } = this.state
		this.setState({
			width: formWidth,
			height: formHeight,

		})
	}

	handleRestart = (event) => {
		this.props.refreshCanvas()
	}

	handleColorChange = (value) => {
		const { i, j } = this.state
		const { temperature, color } = calcColor(value)
		this.updateColor(i, j, temperature, color)
	}

	handleRandom = (event) => {
		event.preventDefault()
		/*
		Assume density is one of:
		- number in [0, 1) in which case it represents fraction of pixels
		- number in [1, inf) in which case it represents number of pixels
		*/
		const density = event.target.density.value
		const { width, height, ctx, imageData, buffer, sample } = this.state
		const numPoints = density < 1 ? Math.floor(width * height * density) : density

		for (let n = 0; n < numPoints; n++) {
			const i = Math.floor(Math.random() * height)
			const j = Math.floor(Math.random() * width)
			const { temperature, color } = calcColor(Math.floor(Math.random() * 101))

			colorSpot(width, height, i, j, imageData, color)
			sample.push({
				location: {
					i: i,
					j: j
				},
				temperature: temperature,
			})
		}
		ctx.putImageData(imageData, buffer, buffer)
		this.setState({
			sample: sample,
			imageData: imageData
		})

	}

	paintBlankCanvas = () => {

		const { width, height, buffer, backgroundColor } = this.state
		const canvas = document.getElementById('canvas')
		if (canvas) {
			const ctx = canvas.getContext('2d')
			const imageData = ctx.createImageData(width, height)
			for (let j=0; j < width; j++) {
				for (let i=0; i < height; i++) {
					colorPixel(width, height, i, j, imageData, backgroundColor)
				}
			}
			ctx.putImageData(imageData, buffer, buffer)
			this.setState({
				ctx: ctx,
				imageData: imageData
			})
		}
	}

	updateColor(i, j, temperature, color) {
		const { width, height, buffer, ctx, imageData, backgroundColor} = this.state
		const iOld = this.state.i
		const jOld = this.state.j

		// un-color old spot
		if (iOld && jOld) {
			colorSpot(width, height, iOld, jOld, imageData, backgroundColor)
		}

		// color new spot
		colorSpot(width, height, i, j, imageData, color)

		ctx.putImageData(imageData, buffer, buffer)
		this.setState({
			imageData: imageData,
			i: i,
			j: j,
			temperature: temperature,
			currColor: `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`
		})
	}

	adjustColor = (value) => {
		const { i, j } = this.state
		const { temperature, color } = calcColor(value)
		this.updateColor(i, j, temperature, color)
	}

	addPoint = () => {
		const {i, j, temperature} = this.state
		this.state.sample.push({
			location: {
				i: i,
				j: j
			},
			temperature: temperature
		})
		this.setState({
			i: null,
			j: null,
			temperature: this.defaultValue
		})
	}

	interpolate = (event) => {
		event.preventDefault()
		const {width, height, sample} = this.state
		if (sample.length < 2) {
			this.setState({
				error: 'Add minimum of 2 points to the canvas'
			})
			return
		}
		const postData = {
			interpolatorType: event.target.interpolatorType.value,
			data: {
				width: width,
				height: height,
				sample: sample
			}
		}
		fetch(window.backendUrl+'/interpolate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(postData)
		})
		.then((response) => {
			if (!response.ok) {
				response.text().then(text => this.setState({
					error: text,
					loading: false
				}))
			} else {
				return response.blob()
			}
		})
		.then((blob) => {
			this.setState({
				imageSrc: URL.createObjectURL(blob),
				loading: false
			})
		})
		this.setState({
			...this.defaultState,
			loading: true
		})
	}

	renderRestart = (restartMessage) => {
		return (
			<div className='center-outer'>
				<button onClick={this.handleRestart}>
					{restartMessage}
				</button>
			</div>
		)
	}

	render() {
		const { width, height, buffer, imageSrc, i, j, error, loading, temperature, currColor } = this.state
		if (loading) {
			// interpolating
			return (
				<Loading text='interpolating' />
			)
		} else if (error || imageSrc) {
			// error with interpolation
			return (
				<ThemeConsumer>
					{({ theme }) => (
						<div className={`inner-container center bg-${theme}`}>
							{this.renderRestart('Go to fresh canvas')}
							{error && <ErrorMessage errorMessage={error}/>}
							{imageSrc && <div className='center-outer'><img src={imageSrc}/></div>}
						</div>
					)}
				</ThemeConsumer>
			)
		} else {
			return (
				<ThemeConsumer>
					{({ theme }) => (
						<div className={`inner-container center bg-${theme}`}>
							<React.Fragment>
								<div className={`space-between room-component room-component-${theme}`}>
									<div className=''>

										{/* resizing */}

										{/* submission */}
										<div className='center-outer'>
											<form id="interpolate" onSubmit={this.interpolate}>	
											<label htmlFor="interpolatorType">Choose interpolation algorithm:&nbsp;</label>
											<select form="interpolate" name="interpolatorType" id="interpolatorType">
													<option value="idw">Inverse Distance Weighting</option>
													<option value="barnes">Barnes Interpolation</option>
													<option value="rbf">RBF Interpolation</option>
													<option value="nn">Nearest Neighbor</option>
													<option value="wrapper">"Wrapper" earthmap</option>
												</select>				
												<input type="submit" value="Interpolate"/>
											</form>
										</div>										
									</div>
								</div>

								<div className='buffer' />


								<div className={`space-between room-component room-component-${theme}`}>
									<div>
										<div className='center-outer'>
											click anywhere on the canvas to add points
										</div>
										<div className='center-outer'>
										<form onSubmit={this.handleRandom}>
											or add it randomly:  
											<select name="density" id="density">
												<option value="5">5 pixels</option>
												<option value="10">10 pixels</option>
												<option value="20">20 pixels</option>
												<option value="50">50 pixels</option>
												<option value="100">100 pixels</option>
												<option value="0.001">0.1% of pixels</option>
												<option value="0.01">1% of pixels</option>
											</select>
											<input type="submit" value="add randomly"/>
										</form>
										</div>
									</div>
									<div style={{height:8, width:400 }}/>

									{/* slider */}
									{i && j && 
										<div className='center-outer'>
											<div style={{width: 400, fontSize: '14px'}}>
												use slider to adjust temperature/color
												<Slider 
													className='slider' 
													// onAfterChange={this.adjustColor}
													onChange={this.handleColorChange}
													defaultValue={temperature*100}
													handleStyle={{
											            height: 16,
											            width: 16,
											            marginLeft: -8,
											            marginTop: -8,
											            backgroundColor: currColor,
											            border: 0
											        }}
													/>
													<br/>
												<button onClick={this.addPoint}>
													Add point
												</button>
											</div>
										</div>
									}

									{/* canvas */}
									<div className='center-outer'>
										<canvas 
											id="canvas" 
											width={`${width + 2*buffer}`} 
											height={`${height + 2*buffer}`} 
											onClick={this.handleClick}/>
									</div>

									{/* reset */}
									<div className='center-outer'>
										<form onSubmit={this.handleResize}>
											<label>
												width&nbsp;
												<input 
													type="number"
													name="formWidth"
													onChange={this.handleChange}
													value={this.state.formWidth}
													/>
												&nbsp;
											</label>
											<label>
												height&nbsp;
												<input 
													type="number"
													name="formHeight"
													onChange={this.handleChange}
													value={this.state.formHeight}
													/>
												&nbsp;
											</label>
											<button>
												Resize
											</button>
										</form>
									</div>
									<div className='buffer'/>
									{this.renderRestart('Reset canvas')}
								</div>
							</React.Fragment>
						</div>
					)}
				</ThemeConsumer>
			)
		}
	}
}