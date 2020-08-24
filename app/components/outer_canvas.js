import React from 'react'

import Canvas from './canvas'


export default class OuterCanvas extends React.Component {

	state = {
		key: 1
	}

	refreshCanvas = () => {
		const {key} = this.state
		const newKey = key? 0 : 1

		this.setState({
			key: newKey
		})
	}

	render() {
		return (
			<Canvas key={this.state.key} refreshCanvas={this.refreshCanvas.bind(this)}/>
		)
	}
}