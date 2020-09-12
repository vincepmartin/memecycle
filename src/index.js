import React from 'react'
import ReactDOM from 'react-dom'
import RideView from './components/RideView/RideView'
import RideUploader from './components/RideUploader/RideUploader'
import RideList from './components/RideList/RideList'
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom'

import * as serviceWorker from './serviceWorker'
import './index.css'

ReactDOM.render(
    <Router basename='/'>
        <Switch>
            <Route exact path='/' component={RideUploader}/>
            <Route path exact ='/ride/' component={RideList}/>
            <Route path='/ride/:rideID' component={RideView}/>
        </Switch>
    </Router>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
