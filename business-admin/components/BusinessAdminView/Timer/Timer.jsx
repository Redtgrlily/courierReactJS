import React from 'react'
import sass from './timer.scss'
import moment from 'moment'

var Timer = React.createClass({

    propTypes: {
        secondsUntilArrival: React.PropTypes.number,
        timeSelectedForPickup: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.bool
        ]),
        expectedPickupTime: React.PropTypes.string,
    },

    getInitialState: function() {
        return {
            secondsUntilArrival: undefined,
            formattedSeconds: ''
        }
    },

    componentDidMount: function() {
        // declare variables ---------------------------
        var timeSelectedForPickup = this.props.timeSelectedForPickup;
        var expectedPickupTime = this.props.expectedPickupTime;

            //  if user is leaving now ---------------------------
            if (expectedPickupTime) {
                // format times into arrays ---------------------------
                var now = moment().format('LT'); // get current time
                var nowSlice = now.slice(0, now.length - 3) // remove AM/PM
                var nowArr = nowSlice.split(':'); // split into array
                if (nowArr[1].charAt(0) === '0') { // if min = 0X, remove 0
                    nowArr[1] = nowArr[1].slice(1, 2);
                }

                var pickUpTimeSlice = expectedPickupTime.slice(0, now.length - 3); // remove AM/PM
                var pickupTimeArr = pickUpTimeSlice.split(':'); // split into array
                if (pickupTimeArr[1].charAt(0) === '0') { // if min = 0X, remove 0
                    pickupTimeArr[1] = pickupTimeArr[1].slice(1, 2);
                }

                // calculate time difference converted to seconds ---------------
                if (nowArr[0] === pickupTimeArr[0]) { // if same hour, get difference of minutes and convert to seconds
                    var secsDiff = (pickupTimeArr[1] - nowArr[1]) * 60;
                } else { // if diff hour, get difference of minutes and hours and convert to seconds
                    var secsDiff = (60 - nowArr[1] + pickupTimeArr[1] + 60 * (pickupTimeArr[0] - nowArr[0] - 1));
                }
                this.setState({
                    secondsUntilArrival: secsDiff
                })
                console.log('secs diff', secsDiff);

            // if user selected a pickup time ---------------------------
            } else if (!expectedPickupTime) {
                // format times into arrays ---------------------------
                var now = moment().format('LT'); // get current time
                var nowSlice = now.slice(0, now.length - 3) // remove AM/PM
                var nowArr = nowSlice.split(':'); // split into array
                if (nowArr[1].charAt(0) === '0') { // if min = 0X, remove 0
                    nowArr[1] = nowArr[1].slice(1, 2);
                }

                var pickUpTimeSlice = timeSelectedForPickup.slice(0, now.length - 3); // remove AM/PM
                var pickupTimeArr = pickUpTimeSlice.split(':'); // split into array
                if (pickupTimeArr[1].charAt(0) === '0') { // if min = 0X, remove 0
                    pickupTimeArr[1] = pickupTimeArr[1].slice(1, 2);
                }
                // calculate time difference converted to seconds ---------------
                if (nowArr[0] === pickupTimeArr[0]) { // if same hour, get difference of minutes and convert to seconds
                    var secsDiff = (pickupTimeArr[1] - nowArr[1]) * 60;
                } else { // if diff hour, get difference of minutes and hours and convert to seconds
                    var secsDiff = (60 - nowArr[1] + pickupTimeArr[1] + 60 * (pickupTimeArr[0] - nowArr[0] - 1));
                }
                this.setState({
                    secondsUntilArrival: secsDiff
                })

            }

        this.counterInterval = setInterval(this._handleCountDown, 1000);
    },

    componentWillUnmount: function() {
        clearInterval(this.counterInterval);
    },

    _handleCountDown: function() {
        if (this.state.formattedSeconds === '0:00') {
            clearInterval(this.counterInterval);
        }
         else if (this.state.secondsUntilArrival <= 0) {
            clearInterval(this.counterInterval);
            this.setState({
                formattedSeconds: '0:00'
            })
        }
        else {
            var newTime = this.state.secondsUntilArrival - 1;
            var formattedSeconds = '';

            if (newTime < 60) {
                if (newTime > 9) {
                    formattedSeconds = '0:' + newTime.toString();
                } else {
                    formattedSeconds = '0:0' + newTime.toString();
                }

            } else if (newTime >= 60) {
                var hour = Math.floor(newTime / 60);
                var minutes = newTime % 60;
                if (minutes < 10) {
                    formattedSeconds = hour + ':0' + minutes;
                } else {
                    formattedSeconds = hour + ':' + minutes;
                }
            }

            this._handleSetState(newTime, formattedSeconds);
        }
    },

    _handleSetState: function(newTime, formattedSeconds) {
        if (formattedSeconds !== '0:00') {
            this.setState({
                secondsUntilArrival: newTime,
                formattedSeconds: formattedSeconds
            })

        } else if (formattedSeconds === '0:00') {
            this.setState({
                formattedSeconds: '0:00'
            })
        }
    },

    render: function() {
        return (
            <div className="timer-container">
                {this.state.formattedSeconds}
            </div>
        )
    }
})

module.exports = Timer;
