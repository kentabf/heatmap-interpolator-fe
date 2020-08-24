import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import { ThemeProvider } from './contexts/theme'
import Loading from './components/loading'
import Title from './components/title'
import Nav from './components/nav'
import './index.css'

const BACKEND_LOCAL = false

const proxyurl = "https://cors-anywhere.herokuapp.com/"
const remoteBackend = proxyurl + 'https://heatmap-interpolator.herokuapp.com'
const localBackend = 'http://0.0.0.0:1234'
window.backendUrl = BACKEND_LOCAL? localBackend : remoteBackend

const OuterCanvas = React.lazy(() => import('./components/outer_canvas'))
const About = React.lazy(() => import('./components/about'))
const Api = React.lazy(() => import('./components/api'))

class App extends React.Component {
	
	state = {
		theme: 'dark',
		toggleTheme: () => {
			this.setState(({ theme }) => ({
				theme: theme === 'light' ? 'dark' : 'light'
			}))
		}
	}

	render() {
		return (
			<Router>
				<ThemeProvider value={this.state}>
					<div className={this.state.theme}>
						<div className='outer-container'>
							<Title />
							<Nav />
							<React.Suspense fallback ={<Loading text='Loading'/>}>
								<Switch>
									<Route exact path='/' component={OuterCanvas} />
									<Route exact path='/about' component={About} />
									<Route exact path='/about-api' component={Api} />
									<Route render={() => <h1>404</h1>} />
								</Switch>
							</React.Suspense>
						</div>
					</div>
				</ThemeProvider>
			</Router>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('app')
)
