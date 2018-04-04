import React from 'react'
import PropTypes from 'prop-types'
import { Switch, NavLink, Route } from 'react-router-dom'
import HomePage from './HomePage'
import MapPage from './mapPage/MapPage'
import SmartMapPage from './smartMapPage/SmartMapPage'
import AboutPage from './aboutPage/AboutPage'
import NotFoundPage from './NotFoundPage'

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.

class App extends React.Component {
    render() {
        const activeStyle = { color: 'blue' }
        return (
            <div>
                <nav className="nav nav-pills nav-justified">
                    <NavLink className="nav-item nav-link" exact to="/" activeStyle={activeStyle}>Home</NavLink>
                    <NavLink className="nav-item nav-link" to="/map" activeStyle={activeStyle}>Map (d)</NavLink>
                    <NavLink className="nav-item nav-link" to="/smartMapPage" activeStyle={activeStyle}>Map (s)</NavLink>
                </nav>
                <div className="row">
                    <Switch>
                        <Route exact path="/" component={HomePage} />
                        <Route path="/map" component={MapPage} />
                        <Route path="/smartMapPage" component={SmartMapPage} />
                        <Route path="/about" component={AboutPage} />
                        <Route component={NotFoundPage} />
                    </Switch>
                </div>
                
            </div>
        )
    }
}

App.propTypes = {
    children: PropTypes.element,
}

export default App
