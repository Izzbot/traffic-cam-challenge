"use strict";

// Start when the DOM is ready
$(document).ready(function() {

    // Set up the starting variables
    var mapElem = document.getElementById('map')
    var center = {
        lat: 47.6,
        lng: -122.3
    }
    var infoWindow = new google.maps.InfoWindow();
    var cameras = [];

    // Show the map
    var map = new google.maps.Map(mapElem, {
        center: center,
        zoom: 12
    });

    // Get the JSON data and parse it
    $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
        .done(function(data) {

            data.forEach(function(camera) {
                // Put a marker on the map for each camera
                var marker = new google.maps.Marker({
                    position: {
                        lat: Number(camera.location.latitude),
                        lng: Number(camera.location.longitude)
                    },
                    map: map
                });

                // Add the label to the marker object
                marker.cameralabel = camera.cameralabel.toLowerCase();

                // add it to the cameras array
                cameras.push(marker);

                // add a listener for the InfoWindow
                google.maps.event.addListener(marker, 'click', function() {
                       // Pan to the camera
                    map.panTo(marker.getPosition());

                    // Bounce the marker when it's hovered over
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function() {
                        marker.setAnimation(null);
                    }, 1500);

                    // Set up the info for the infoWindow
                    var html = '<p>' + camera.cameralabel + ' - <a href="' + camera.videourl + '">video</a><br><img src="'
                        + camera.imageurl.url + '" alt=' + camera.cameralabel + '></img>'
                        + '</p>';
                    infoWindow.setContent(html);
                    infoWindow.open(map, this);
                });
            })
        })
        .fail(function(error) {
            // Doh!
            console.log(error);
        })
        .always(function() {
            // Turn off the spinner
            $('#ajax-loader').fadeOut();
        });

    // Set up the search filter
    $('#search').bind('search keyup', function() {
        $('#ajax-loader').show();
        var search_term = $(this).val().toLowerCase();

        // Check each of the cameras
        for (var i = 0, len = cameras.length; i < len; i++) {
            var camera = cameras[i];

            // Set each camera to hide if it doesn't match
            var matched = cameras[i].cameralabel.indexOf(search_term);
            if (matched >= 0) {
                cameras[i].setMap(map);
            } else {
                cameras[i].setMap(null);
            }
        }

        $('#ajax-loader').fadeOut();
    });

    // Hide the infoWindow when the map is clicked
    google.maps.event.addListener(map, 'click', function() {
       infoWindow.close();
    });

});