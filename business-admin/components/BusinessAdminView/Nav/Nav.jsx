import React from 'react'
import sass from './nav.scss'

var Nav = React.createClass({
    render: function() {
        return (
            <div className="nav-container">
                <div className="nav-icons">
                    <i className="fa fa-tachometer fa-2x" aria-hidden="true"></i>
                    <i className="fa fa-history fa-2x" aria-hidden="true"></i>
                </div>
            </div>
        )
    }
})

module.exports = Nav;
