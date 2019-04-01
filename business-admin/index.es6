import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { browserHistory, Router } from 'react-router'
import routes from './routes'
import store from './store'
import style from './style.scss'

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory} routes={routes} />
    </Provider>,
    document.getElementById('root')
)

// if order is more than 10 minutes away, show in other panel
// create notification and 'ding' sound when order comes in
// can only order 30 min out or something
// timer for orders placed at pickup time
// create timer based on time until arrival that counts down and then renders 'customer is here' when it hits 0:00
// create responsive navigation
// add email or text notification options for user on consumer side
// create upcoming orders and 'triggered orders' sections
// create notification animation thing when an order is completed, or animation of order being removed
// add select time component to additional info so it only displays times in the future

// Create previous orders page -- all completed orders
// fix refresh bug on customer
