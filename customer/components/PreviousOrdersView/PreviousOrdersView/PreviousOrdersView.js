import React from 'react';
import { Link } from 'react-router';
import './previous-orders-view.scss';
import '../../App/app.scss';
import PreviousOrder from '../PreviousOrder/PreviousOrder';

var PreviousOrdersView = React.createClass({

    componentWillMount: function() {
        this.props.handlePreviousOrders();
    },

    render: function() {

        var previousOrders = this.props.previousOrders.map(function(order, index) {
            return <PreviousOrder
                previousOrder={order}
                key={index} />
        })

        return (
            <div className="previous-orders-container">
                <div className="title-cover">
                    <h1>Previous Orders</h1>
                </div>
                <div className="previous-orders-wrap">
                {previousOrders}
                </div>
            </div>
        )
    }
});

module.exports = PreviousOrdersView;
