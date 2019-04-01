import React from 'react';
import './order-ready-time.scss';

var OrderReadyTime = React.createClass({

    propTypes: {
        methodOfTrans: React.PropTypes.string,
        pickupTime: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.bool
        ]),
        duration: React.PropTypes.string,
        expectedPickupTime: React.PropTypes.string
    },

    render: function () {

        var pickupTime;
        if (this.props.pickupTime === true) {
            pickupTime = <div className="order-ready-time-container">
                <h2 className="order-ready-time-pickup">Head to the shop,
                and your order will be ready when you get there!
                </h2>
            </div>
        } else {
            pickupTime = <div className="order-ready-time-container">
                <h2>Your order will be ready at {this.props.pickupTime}</h2>
                <div className="order-ready-time-divider"></div>
            </div>
        }


        return (
            <div>
                {pickupTime}
            </div>
        )
    }
});

module.exports = OrderReadyTime;
