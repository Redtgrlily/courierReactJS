import React from 'react';
import { Link } from 'react-router';
import dummyData from '../../../dummy-data.json';
import dummyShopData from '../../../dummy-shop-data.json';
import sass from './app.scss';
import AddItemNotification from '../CustomOrderView/AddItemNotification/AddItemNotification';
import UsernameView from '../UsernameView/UsernameView/UsernameView';
import _ from 'lodash';
import api from '../../api';
import request from 'superagent';
import cookie from 'js-cookie';
import moment from 'moment';

var App = React.createClass({

    getInitialState: function () {
        return {
            username: '',
            userLocation: {
                lat: '',
                lng: ''
            },
            shops: [],
            selectedShop: {},
            selectedShopLocation: {
                lat: '',
                lng: ''
            },
            distance: '',
            duration: '',
            durationSeconds: undefined,
            items: [],
            specialInstructions: '',
            notification: {
                add: false,
                delete: false,
                error: false,
                form: false,
                additionalInfo: false,
                userLocation: false
            },
            methodOfTrans: '',
            methodOfTransShow: true,
            pickupTime: true,
            expectedPickupTime: '',
            favorite: false,
            paymentInfo: {
                nameOnCard: '',
                cardNumber: undefined,
                expMonth: '',
                expYear: '',
                cvv: undefined
            },
            previousOrders: [],
            favoriteOrders: [],
            menuShow: false,
        }
    },

    // Calls the getLocation function which returns the user's current location
    // and passes it to its callback (_handleGetLocation)
    componentWillMount: function () {
        // api.getLocation(this._handleUserLocation, this._handleGetLocation);
        this._handleCoffeeShopDummyState(dummyShopData);

        this._handleUsernameCheck();
        setTimeout(() => {
            this._handleUserLocationCheck();
        }, 8000);
    },

    _handleUserLocationCheck: function () {
        if (this.state.userLocation.lat === '') {
            this.setState({
                notification: {
                    userLocation: true
                }
            });
        }
    },

    // -------------- USERNAME VALIDATION --------------

    _handleUsernameCheck: function () {
        var usernameCookie = cookie.get('username');
        usernameCookie ? this._handleUsernameState(usernameCookie)
            : '' // if there is a cookie, set it to the state, if not, do nothing
    },

    _handleUsernameState: function (usernameCookie) {
        this.setState({
            username: usernameCookie
        })
    },

    _handleUsername: function (username) {
        username ? cookie.set('username', username)
            : ''
        this._handleUsernameState(username);
    },

    _handleUsernameRemove: function () {
        cookie.remove('username');
        location.reload();
    },

    // --------------USER LOCATION AND GOOGLE MAPS API CALL--------------

    _handleUserLocation: function (position) {
        this.setState({
            userLocation: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
        })
    },

    // Takes the user's current location from api.getLocation and passes it as the
    // first parameter to api.getShops. getShops uses this location to produce a
    // list of coffee shops within a specified radius from the user's location.
    // It also passes _handleCoffeeShopState as a second parameter, which takes the
    // results (array of objects) and sets it to this.state.shops
    _handleGetLocation: function (position) {
        api.getShops(position, this._handleCoffeeShopState)
    },

    // _handleCoffeeShopState: function (results) {
    //     this.setState({
    //         shops: results
    //     }, this._getShopsCoordinates)
    // },

    _handleCoffeeShopDummyState: function (shops) {
        this.setState({
            shops: shops
        }, this._getShopsCoordinates)
    },


    // get lat and lng from this.state.shops by running function that returns values
    // create object from those values
    // push values through api.calculateTravelTime along with this.state.userLocation, methodOfTrans (anything), and callback to set to state.
    // render values on ShopListItem
    // how is this changing the state?
    _getShopsCoordinates: function () {
        var shopsWithCoordinates = this.state.shops.map(function (shop) {
            var newShop = _.assign(
                {},
                shop,
                {
                    shopCoordinates: {
                        lat: shop.geometry.location.lat(),
                        lng: shop.geometry.location.lng()
                    }
                }
            )
            return newShop;
        })

        this.setState({
            shops: shopsWithCoordinates
        }, this._getShopsDistances)
    },

    _getShopsDistances: function () {
        var _handleGetShopsDistance = (response, shop) => {
            var shopsWithDistance = this.state.shops.map(function (s) {
                if (s.place_id === shop.place_id) {
                    return _.assign({}, s, { shopDistance: response.rows[0].elements[0].distance.text })
                } else {
                    return s;
                }
            })
            this.setState({
                shops: shopsWithDistance
            })
        };

        _.forEach(this.state.shops, (shop) => {
            api.calculateTravelTime(
                this.state.userLocation,
                shop.shopCoordinates,
                'driving',
                function (response) {
                    _handleGetShopsDistance(response, shop)
                }
            )
        })
    },

    // API CALL IN RESPONSE TO USER SELECTING SHOP

    // Calls api.getDetails and passes in selected shop's place_id (shop object is about to
    // be set to this.state.selectedShop), allowing google maps api to retrieve the
    // details of the user's selected shop. It passes in _handleSelectedShopDetails as a
    // callback, which gets passed the 'place' in getDetails and overwrites previous setState
    // and sets this.state.selectedShop to place, which contains all details of shop
    _handleSelectedShop: function (shop) {
        api.getDetails(shop.place_id, this._handleSelectedShopDetails);
        this.setState({
            selectedShop: shop
        })
    },

    // This function is the second argument to getDetails, which takes the place object, and
    // sets it on this.state.selectedShop. It then calls _handleSelectedShopCoords and passes
    // the place object as its argument
    _handleSelectedShopDetails: function (place) {
        this.setState({
            selectedShop: place
        })
        this._handleSelectedShopLocation(place);
    },

    // This function receives the place object from _handleSelectedShopDetails, which contains
    // all the shop details, and then accesses the shop's coordinates on the place object, and
    // then sets those coordinates to this.state.selectedShopCoords.lat/lng
    _handleSelectedShopLocation: function (place) {
        this.setState({
            selectedShopLocation: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            },
        })
    },

    // sets user method of transportation to this.state.methodOfTrans and subsequently makes api call
    // to calculate distance and duration given user's selected method of transportation
    _handleMethodOfTrans: function (event) {
        this.setState({
            methodOfTrans: event.target.value
        })
        api.calculateTravelTime(
            this.state.userLocation,
            this.state.selectedShopLocation,
            this.state.methodOfTrans,
            this._handleDistanceAndDuration
        );
    },


    _handleDistanceAndDuration: function (response) {
        this.setState({
            distance: response.rows[0].elements[0].distance.text,
            duration: response.rows[0].elements[0].duration.text,
            durationSeconds: response.rows[0].elements[0].duration.value
        })
    },

    // --------------SERVER API REQUESTS--------------

    _handleOrderSubmit: function () {

        if (this.state.pickupTime === true) {
            var expectedPickupTime = moment().add(this.state.durationSeconds, 's').format('LT');
        } else {
            var expectedPickupTime = '';
        }

        var date = moment().format('l');
        var time = moment().format('LT');

        request.post('/api/orders')
            .set('Content-Type', 'application/json')
            .send({
                username: this.state.username,
                items: this.state.items,
                specialInstructions: this.state.specialInstructions,
                selectedShop: this.state.selectedShop.name,
                selectedShop_id: this.state.selectedShop.place_id,
                favorited: this.state.favorite,
                date: date,
                time: time,
                timeUntilArrival: this.state.duration,
                secondsUntilArrival: this.state.durationSeconds,
                timeSelectedForPickup: this.state.pickupTime,
                expectedPickupTime: expectedPickupTime,
                completed: false
            })
            .end(function (err, res) {
                if (err) {
                    console.log(err);
                }
            })
        this._handleStateClear();
    },

    _handlePostOrder: function () {

    },

    _handleStateClear: function () {
        this.setState({
            items: [],
            specialInstructions: '',
            methodOfTrans: '',
            favorite: false,
            paymentInfo: {
                nameOnCard: '',
                cardNumber: undefined,
                expMonth: '',
                expYear: '',
                cvv: undefined
            },
        })
    },

    _handlePreviousOrders: function () {
        request.get('/api/users/' + String(this.state.username) + '/orders/previous')
            .end((err, res) => {
                this.setState({
                    previousOrders: res.body
                })
            });
    },

    _handleFavoriteOrders: function () {
        request.get('/api/users/' + String(this.state.username) + '/orders/favorites')
            .end((err, res) => {
                this.setState({
                    favoriteOrders: res.body
                })
            });
    },

    // --------------OTHER APP METHODS--------------

    _handlePickupTime: function (newValue) {
        this.setState({
            pickupTime: newValue
        })
        if (newValue === true) {
            this.setState({
                methodOfTransShow: true
            })
        } else if (newValue !== true) {
            this.setState({
                methodOfTransShow: false
            })
        }
    },

    _handleFavorite: function () {
        this.setState({
            favorite: !this.state.favorite
        })
    },

    _handleCCName: function (event) {
        var newPaymentInfo = _.assign(
            {},
            this.state.paymentInfo,
            { nameOnCard: event.target.value }
        )
        this.setState({
            paymentInfo: newPaymentInfo
        })
    },

    _handleCCNumber: function (event) {
        var newPaymentInfo = _.assign(
            {},
            this.state.paymentInfo,
            { cardNumber: event.target.value }
        )
        this.setState({
            paymentInfo: newPaymentInfo
        })
    },

    _handleCCExpMonth: function (event) {
        var newPaymentInfo = _.assign(
            {},
            this.state.paymentInfo,
            { expMonth: event.target.value }
        )
        this.setState({
            paymentInfo: newPaymentInfo
        })
    },

    _handleCCExpYear: function (event) {
        var newPaymentInfo = _.assign(
            {},
            this.state.paymentInfo,
            { expYear: event.target.value }
        )
        this.setState({
            paymentInfo: newPaymentInfo
        })
    },

    _handleCCCVV: function (event) {
        var newPaymentInfo = _.assign(
            {},
            this.state.paymentInfo,
            { cvv: event.target.value }
        )
        this.setState({
            paymentInfo: newPaymentInfo
        })
    },

    _toggleAddNotification: function () {
        this.setState({
            notification: {
                add: true
            }
        });
        var clearNotification = () => {
            this.setState({
                notification: {
                    add: false
                }
            })
        };
        setTimeout(clearNotification, 3000);
    },

    _toggleDeleteNotification: function () {
        this.setState({
            notification: {
                delete: true
            }
        });
        var clearNotification = () => {
            this.setState({
                notification: {
                    delete: false
                }
            })
        };
        setTimeout(clearNotification, 3000);
    },

    _toggleErrorNotification: function () {
        this.setState({
            notification: {
                error: true
            }
        });
        var clearNotification = () => {
            this.setState({
                notification: {
                    error: false
                }
            })
        };
        setTimeout(clearNotification, 3000);
    },

    _toggleFormNotification: function () {
        this.setState({
            notification: {
                form: true
            }
        });
        var clearNotification = () => {
            this.setState({
                notification: {
                    form: false
                }
            })
        };
        setTimeout(clearNotification, 3000);
    },

    _toggleAdditionalInfoNotification: function () {
        this.setState({
            notification: {
                additionalInfo: true
            }
        });
        var clearNotification = () => {
            this.setState({
                notification: {
                    additionalInfo: false
                }
            })
        };
        setTimeout(clearNotification, 3000);
    },

    _handleSpecialInstructions: function (event) {
        this.setState({
            specialInstructions: event.target.value
        })
    },

    _handleAddItemToOrder: function (itemDetails) {
        this.setState({
            items: this.state.items.concat(itemDetails),
        });
    },

    _handleDeleteItemFromOrder: function (index) {
        var items = this.state.items;
        items.splice(index, 1);
        this.setState({
            items: items
        })
    },

    _handleClearItemsFromOrder: function () {
        this.setState({
            items: []
        })
    },

    _handleMenuToggle: function () {
        this.setState({
            menuShow: !this.state.menuShow
        });
    },

    render: function () {
        return (
            <div>

                {!this.state.username ?
                    <UsernameView handleUsername={this._handleUsername} /> :
                    <div>
                        <nav className="top-nav">
                            <div
                                className="menu-bars"
                                onClick={() => { this._handleMenuToggle() }}>
                                <i className={this.state.menuShow ? 'fa fa-times fa-2x' : 'fa fa-bars fa-2x'} aria-hidden="true"></i>
                            </div>
                            <div className="top-nav-logo">
                                <img src="/img/gomocha-logo-sml.png" />
                            </div>
                            <ul className={this.state.menuShow ? 'menu-show' : 'menu-hide'}>
                                <Link to="/" onlyActiveOnIndex={true} className='router-link'>
                                    <li onClick={() => { this._handleMenuToggle() }}>Dashboard</li>
                                </Link>
                                <Link to="/previous-orders" className="prev-orders-link">
                                    <li onClick={() => { this._handleMenuToggle() }}>Previous Orders</li>
                                </Link>
                                <Link to="favorite-orders" className="fav-orders-link">
                                    <li onClick={() => { this._handleMenuToggle() }}>Favorite Orders</li>
                                </Link>
                                <Link to="/" className='router-link' onClick={this._handleUsernameRemove}>
                                    <li className="sign-out" onClick={() => { this._handleMenuToggle() }}>Sign Out</li>
                                </Link>
                            </ul>
                        </nav>
                        <nav className="side-nav">
                            <Link to="/" onlyActiveOnIndex={true} className='router-link'>
                                <div className="side-nav-logo">
                                    <img src="/img/gomocha-logo-sml.png" />
                                </div>
                            </Link>
                            <Link to="/" onlyActiveOnIndex={true} className='router-link'>
                                <i className="fa fa-home fa-2x" aria-hidden="true"></i>
                            </Link>
                            <Link to="/previous-orders" className="prev-orders-link">
                                <i className="fa fa-clock-o fa-2x"></i>
                            </Link>
                            <Link to="favorite-orders" className="fav-orders-link">
                                <i className="fa fa-heart fa-2x"></i>
                            </Link>
                            <div className="side-nav-divider"></div>
                            <Link to="/" className='router-link' onClick={this._handleUsernameRemove}><i className="fa fa-sign-out fa-2x" aria-hidden="true"></i></Link>
                        </nav>

                        {React.cloneElement(this.props.children,
                            {
                                data: dummyData,
                                username: this.state.username,
                                userLocation: this.state.userLocation,
                                selectedShopLocation: this.state.selectedShopLocation,
                                shops: this.state.shops,
                                selectedShop: this.state.selectedShop,
                                items: this.state.items,
                                handleSelectedShop: this._handleSelectedShop,
                                distance: this.state.distance,
                                duration: this.state.duration,
                                handleSpecialInstructions: this._handleSpecialInstructions,
                                specialInstructions: this.state.specialInstructions,
                                notification: this.state.notification,
                                toggleAddNotification: this._toggleAddNotification,
                                toggleDeleteNotification: this._toggleDeleteNotification,
                                toggleErrorNotification: this._toggleErrorNotification,
                                toggleFormNotification: this._toggleFormNotification,
                                toggleAdditionalInfoNotification: this._toggleAdditionalInfoNotification,
                                handleAddItemToOrder: this._handleAddItemToOrder,
                                handleDeleteItemFromOrder: this._handleDeleteItemFromOrder,
                                handleClearItemsFromOrder: this._handleClearItemsFromOrder,
                                handleMethodOfTrans: this._handleMethodOfTrans,
                                methodOfTrans: this.state.methodOfTrans,
                                methodOfTransShow: this.state.methodOfTransShow,
                                handlePickupTime: this._handlePickupTime,
                                pickupTime: this.state.pickupTime,
                                handleFavorite: this._handleFavorite,
                                favorite: this.state.favorite,
                                handleCCName: this._handleCCName,
                                handleCCNumber: this._handleCCNumber,
                                handleCCExpMonth: this._handleCCExpMonth,
                                expMonth: this.state.paymentInfo.expMonth,
                                handleCCExpYear: this._handleCCExpYear,
                                expYear: this.state.paymentInfo.expYear,
                                handleCCCVV: this._handleCCCVV,
                                handleOrderSubmit: this._handleOrderSubmit,
                                handlePreviousOrders: this._handlePreviousOrders,
                                handleFavoriteOrders: this._handleFavoriteOrders,
                                previousOrders: this.state.previousOrders,
                                favoriteOrders: this.state.favoriteOrders,
                                handleMenuToggle: this._handleMenuToggle,
                                menuShow: this.state.menuShow
                            })
                        }
                    </div>
                }
            </div>
        )
    }
});

module.exports = App;
