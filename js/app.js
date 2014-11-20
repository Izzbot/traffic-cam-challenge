// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box


$(document).ready(function() {

    // Set up the map
    var mapElem = document.getElementById('map')
    // Center on Seattle
    var center = {
        lat: 47.6,
        lng: -122.3
    }

    // Show the map
    var map = new google.maps.Map(mapElem, {
        center: center,
        zoom: 12
    })

    // Build an infoWindow
    var infoWindow = new google.maps.InfoWindow();

    // Build an array for the markers

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

                // add a listener for the InfoWindow
                google.maps.event.addListener(marker, 'click', function() {
                       // Pan to the camera
                    map.panTo(marker.getPosition());

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
        var search_term = $(this).val().toLowerCase();

        // Check each of the camera labels
        $('')
    });



});