var largeInfowindow;
var map;
var markers = [];


var point = function (title, lat, lng) {
    this.title = title;
    this.lat = lat;
    this.lng = lng;
    };

var points = [
          new point ('Park Ave Penthouse', 40.7713024, -73.9632393),
          new point ('Chelsea Loft', 40.7444883, -73.9949465),
          new point ('Union Square Open Floor Plan', 40.7347062, -73.9895759),
          new point ('East Village Hip Studio', 40.7281777, -73.984377),
          new point ('TriBeCa Artsy Bachelor Pad', 40.7195264, -74.0089934),
          new point ('Chinatown Homey Space', 40.7180628, -73.9961237)
        ];



var viewModel = function() {
        points = ko.observableArray(points)
        query = ko.observable('')
    };

 viewModel.points = ko.dependentObservable(function() {
        var search = this.query().toLowerCase();
        return ko.utils.arrayFilter(points, function(point) {
            return point.name.toLowerCase().indexOf(search) >= 0;
        });
    }, viewModel);


function initMap() {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.7413549, lng: -73.9980244},
          zoom: 13
        });

        var largeInfowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < points.length; i++) {
          console.log(points[i]);
          // Get the position from the point array.
          var position = {
            lat: points[i].lat,
            lng: points[i].lng 
          };
          var title = points[i].title;
          // Create a marker per point, and put into markers array.
          var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
          });

          markers.push(marker);
            marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
          bounds.extend(markers[i].position);
        }
        // Extend the boundaries of the map for each marker
        map.fitBounds(bounds);
      }

function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
          });
        }
      }
     

 $(document).ready(function() {
  ko.applyBindings(new viewModel());
 });
