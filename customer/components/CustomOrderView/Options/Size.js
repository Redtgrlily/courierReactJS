import React from 'react';
import './options.scss';

var Size = React.createClass({

    propTypes: {
        handleChange: React.PropTypes.func,
        key: React.PropTypes.string,
        value: React.PropTypes.string
    },

    render: function() {
        return (
            <select className="size" name="size" value={this.props.value} onChange={this.props.handleChange}>
                <option value="default" disabled>Size</option>
                <option value="12 oz.">12 oz.</option>
                <option value="16 oz.">16 oz.</option>
                <option value="20 oz.">20 oz.</option>
            </select>
        )
    }
});

module.exports = Size;
