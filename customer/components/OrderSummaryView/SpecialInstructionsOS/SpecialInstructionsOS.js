import React from 'react';
import './special-instructions.scss';

var SpecialInstructionsOS = React.createClass({

    propTypes: {
        specialInstructions: React.PropTypes.string
    },

    render: function() {
        return (
            <div>
                <h4>Special Instructions:</h4>
                <p>{this.props.specialInstructions}</p>
            </div>
        )
    }
});

module.exports = SpecialInstructionsOS;
