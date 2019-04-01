module.exports = {

    getLocation: function (callback, callback2) {
        if (navigator.geolocation) {
            debugger;
            navigator.geolocation.getCurrentPosition(callback, function (error) {
                console.log(error);
            }, { maximumAge: Infinity, enableHighAccuracy: true, timeout: 10000 });
            navigator.geolocation.getCurrentPosition(callback2, function (error) {
                console.log(error);
            }, { maximumAge: Infinity, enableHighAccuracy: true, timeout: 10000 });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    },

    getShops: function (position, callback) {
        var currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        // Specify location, radius and place types for your Places API search.
        var request = {
            location: currentLocation,
            radius: '4000',
            types: ['cafe']
        };
        // Create the PlaceService and send the request.
        // Handle the callback with an anonymous function.
        var service = new google.maps.places.PlacesService(map);

        service.nearbySearch(request, function (results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                callback(results);
            }
        });
    },

    getDetails: function (placeId, callback) {
        var service = new google.maps.places.PlacesService(map);

        service.getDetails({
            placeId: placeId
        }, function (place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                callback(place);
            }
        });
    },

    calculateTravelTime: function (userLocation, selectedShopLocation, methodOfTrans, callback) {
        var bounds = new google.maps.LatLngBounds;

        var origin1 = userLocation;
        var destinationA = selectedShopLocation;
        var methodOfTrans;

        switch (methodOfTrans) {
            case 'walking':
                methodOfTrans = google.maps.TravelMode.WALKING;
                break;
            case 'biking':
                methodOfTrans = google.maps.TravelMode.BICYCLING;
                break;
            case 'driving':
                methodOfTrans = google.maps.TravelMode.DRIVING;
                break;
            default:
                methodOfTrans = google.maps.TravelMode.DRIVING;
        }
        var geocoder = new google.maps.Geocoder;

        var service = new google.maps.DistanceMatrixService;
        service.getDistanceMatrix({
            origins: [origin1],
            destinations: [destinationA],
            travelMode: methodOfTrans,
            unitSystem: google.maps.UnitSystem.IMPERIAL,
            avoidHighways: false,
            avoidTolls: false
        }, function (response, status) {
            if (status !== google.maps.DistanceMatrixStatus.OK) {
                alert('Error was: ' + status);
            } else {
                var originList = response.originAddresses;
                var destinationList = response.destinationAddresses;
                callback(response);
            }
        });
    }
}
