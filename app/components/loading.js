import React from 'react'
import PropTypes from 'prop-types'

import { ThemeConsumer } from '../contexts/theme'

const styles = {
	content: {
		fontSize: '35px',
		position: 'absolute',
		left: '0',
		right: '0',
		right: '0',
		marginTop: '20px',
		textAlign: 'center',
	}
}

const stylesAdditional = {
	content: {
		fontSize: '12px',
		left: '0',
		right: '0',
		right: '0',
		marginTop: '20px',
		textAlign: 'center',
	}
}

export default class Loading extends React.Component {
	state = {
		content: this.props.text,
		additional: this.props.text === 'interpolating'? '(The first time around, it may take a while for the server to wake up...)' : null
	}

	componentDidMount () {
		const { speed, text } = this.props
		this.interval = window.setInterval(() => {
			this.state.content === text + '...'
				? this.setState({ content: text })
				: this.setState(({content}) => ({ content: content + '.'}))
		}, speed)
	}

	componentWillUnmount() {
		window.clearInterval(this.interval)
	}
	
	render() {
		return (
			<ThemeConsumer>
				{({ theme }) => (
					<React.Fragment>
						<p style={styles.content}>
							{this.state.content}
						</p>
						<p style={stylesAdditional.content}>&nbsp;</p>
						<p style={stylesAdditional.content}>
							<br/>{this.state.additional}
						</p>
					</React.Fragment>
				)}
			</ThemeConsumer>
		)
	}
}

Loading.propTypes = {
	text: PropTypes.string.isRequired,
	speed: PropTypes.number.isRequired,
}

Loading.defaultProps = {
	text: 'Loading',
	speed: 500,
}
