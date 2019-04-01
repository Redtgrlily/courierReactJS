import React from 'react';
import ShopList from '../ShopList/ShopList';
import Footer from '../../DashboardView/Footer/Footer';
import { Link } from 'react-router';
import '../../App/app.scss';
import './select-shop-view.scss';

var SelectShopView = React.createClass({

    propTypes: {
        shops: React.PropTypes.arrayOf(React.PropTypes.object),
        handleSelectedShop: React.PropTypes.func,
        notification: React.PropTypes.object
    },

    render: function () {

        var loadingIcon;
        if (this.props.shops.length === 0) {
            loadingIcon = <i className="fa fa-spinner fa-spin fa-3x fa-fw margin-bottom"></i>;
        } else if (this.props.shops.length > 0) {
            loadingIcon = <i className="hide fa-spinner fa-spin fa-3x fa-fw margin-bottom"></i>;
        }

        var content;
        // if (!this.props.notification.userLocation) {
        //     content = <div>
        //                 <div className="loading-icon">{loadingIcon}</div>
        //                 <ShopList
        //                     shops={this.props.shops}
        //                     handleSelectedShop={this.props.handleSelectedShop} />
        //               </div>;
        // } else {
        //     content =
        //     <div className="location-notification-container">
        //     <h2>You must allow access to your location to use this app.</h2>
        //     <i className="fa fa-location-arrow fa-5x" aria-hidden="true"></i>
        //     </div>;
        // }

        return (
            <div className="select-shop-container">

                <div>

                </div>

                <div className="title-cover">
                    <h1>Select a Shop</h1>
                    <div className="userProgress">
                        <div id="oneOfFive">
                        </div>
                    </div>
                </div>

                <div className="main-wrap">
                    <div>
                        <div className="loading-icon">{loadingIcon}</div>
                        <ShopList
                            shops={this.props.shops}
                            handleSelectedShop={this.props.handleSelectedShop} />
                    </div>;
                </div>
                <Footer />
            </div>
        )
    }
});

module.exports = SelectShopView;
