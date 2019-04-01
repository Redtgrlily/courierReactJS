import React from 'react';
import './shop-details.scss';

var ShopDetails = React.createClass({

    propTypes: {
        selectedShop: React.PropTypes.object,
        distance: React.PropTypes.string
    },

    render: function () {

        var selectedShop = this.props.selectedShop;

        return (
            <div className="shop-details-container">
                <h2>{selectedShop.name}</h2>
                <p>{selectedShop.address_components[0].short_name + ' ' + selectedShop.address_components[1].short_name}</p>

                <p>{selectedShop.address_components[2].short_name + ', ' + selectedShop.address_components[3].short_name + ' ' + selectedShop.address_components[5].short_name}</p>
                <p>{selectedShop.formatted_phone_number}</p>
                <p>Distance: 0.5 mi</p>
            </div>
        )
    }
});

module.exports = ShopDetails;
