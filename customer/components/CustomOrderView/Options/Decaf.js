import React from 'react';
import './options.scss';

var Decaf = React.createClass({

    propTypes: {
        handleChange: React.PropTypes.func,
        key: React.PropTypes.string,
        value: React.PropTypes.bool
    },

    render: function() {
        return (
            <div className="decaf-option">
                <label>
                Decaf?
                <input className="decaf-input" type="checkbox" checked={this.props.value} onChange={this.props.handleChange} />
                </label><br />
            </div>
        )
    }
});

module.exports = Decaf;
