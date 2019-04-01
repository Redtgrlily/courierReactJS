import React from 'react';
import AddItemNotification from '../AddItemNotification/AddItemNotification';
import './order-total-row.scss';

var OrderTotalRow = React.createClass({

    propTypes: {
        itemDetails: React.PropTypes.shape({
            itemName: React.PropTypes.string,
            milkType: React.PropTypes.string,
            price: React.PropTypes.number,
            quantity: React.PropTypes.string,
            size: React.PropTypes.string
        }),
        handleDeleteItemFromOrder: React.PropTypes.func,
        toggleDeleteNotification: React.PropTypes.func
    },

    _handleDeleteItem: function() {
        this.props.handleDeleteItemFromOrder(this.props.index);
        this.props.toggleDeleteNotification();
    },

    render: function() {

        var itemName = this.props.itemDetails.itemName;
        var price = this.props.itemDetails.price;
        var quantity = this.props.itemDetails.quantity;
        var size = this.props.itemDetails.size;
        var milkType = this.props.itemDetails.milkType;
        var decaf = this.props.itemDetails.decaf;
        var hotOrCold = this.props.itemDetails.hotOrCold;

        var cleanMilkType = function(milkType) {
	        var newMilk = milkType.split('-');
            var newerMilk = newMilk.map(
                function(word) {
			        return word[0].toUpperCase() + word.slice(1, word.length);
		        });
	        return newerMilk.join(' ');
        }

        var cleanHotOrCold = function(hotOrCold) {
            return hotOrCold[0].toUpperCase() + hotOrCold.slice(1, hotOrCold.length);

        }

        return (
                <tr className='order-total-row'>
                    <td>
                        <p>{quantity}
                            <span> - </span>
                            {size}
                            <span> </span>
                            {itemName}
                        </p>
                        <p>
                            {milkType ? cleanMilkType(milkType) : ''}
                            {decaf ? ' | Decaf' : ''}
                            {hotOrCold ? cleanHotOrCold(hotOrCold) : ''}
                        </p>
                    </td>
                    <td className='td-price'>
                        ${(price * quantity).toFixed(2)}
                        <span
                            title='Delete item from order'
                            onClick={this._handleDeleteItem}
                            className="delete-button" >
                            <i className="fa fa-times fa-lg delete-item"></i>
                        </span>
                    </td>
                </tr>
            )
    }
});

module.exports = OrderTotalRow;
