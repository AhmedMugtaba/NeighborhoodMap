var map;
var markers = [];

// array of locations

var locations = [
  {
    name: "The Forgotten Pyramids",
    latLng: { lat: 16.9381826, lng: 33.7488091 },
    wiki: "Meroe"
  },

  {
    name: "Tuti Island",
    latLng: { lat: 15.6393583, lng: 32.5217026 },
    wiki: "Tuti Island"
  },

  {
    name: "Longest River in the World",
    latLng: { lat: 15.615997, lng: 32.6859455 },
    wiki: "Nile River"
  },
  {
    name: "Dinder National Park",
    latLng: { lat: 12.8181591, lng: 35.3905046 },
    wiki: "Dinder National Park"
  },
  {
    name: "Red Sea",
    latLng: { lat: 19.6971426, lng: 37.2717191 },
    wiki: "Red Sea"
  }
];

// constructor function to create a location

function Location(data) {
  this.name = data.name;
  this.latLng = data.latLng;
  this.wiki = data.wiki;
}

// function to create a map and add markers

function createMap() {
  var latlng = new google.maps.LatLng(-34.397, 150.644);
  var input = {
    zoom: 25,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map"), input);
  var Infowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].latLng;
    var title = locations[i].name;
    var wiki = locations[i].wiki;
    // Create a marker per point
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      wiki: wiki,
      animation: google.maps.Animation.DROP,
      id: i
    });

    markers.push(marker);

    marker.addListener("click", function() {
      populateInfoWindow(this, Infowindow);
    });
    bounds.extend(markers[i].position);
  }
  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);
}

// function to populate marker widnow with title and wikipedia artical

function populateInfoWindow(marker, infowindow) {
  sourceURL = "https://en.wikipedia.org/wiki/" + marker.wiki;
  urls =
    "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" +
    marker.wiki;

  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.open(map, marker);

    $.ajax({
      type: "GET",
      dataType: "jsonp",
      data: {},
      url: urls
    })
      .done(function(response) {
        infowindow.setContent(
          "<div>" +
            marker.title +
            "</div>" +
            "<a href=" +
            sourceURL +
            ' target="_blank">Wikipedia link</a>'
        );
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        infowindow.setContent("<div>" + "Something went wrong!" + "</div>");
      });

    infowindow.addListener("closeclick", function() {
      infowindow.setMarker = null;
    });
  }
}

google.maps.event.addDomListener(window, "load", createMap);

// a viewModel to store data and bind them the view

var viewModel = function() {
  var self = this;

  // Creating location array out of the locations data and add individul location to it

  self.locations = [];

  locations.forEach(function(location) {
    self.locations.push(new Location(location));
  });

  // emty array to track search on locations
  self.search = ko.observableArray();

  self.locations.forEach(function(location) {
    self.search.push(location);
  });

  // observable to store userInput

  self.userInput = ko.observable("");

  // function to filter and search locations

  self.filterLocations = function() {
    var searchInput = self.userInput().toLowerCase();

    self.search.removeAll();

    self.locations.forEach(function(location) {
      if (location.name.toLowerCase().indexOf(searchInput) !== -1) {
        self.search.push(location);
      }
    });
  };
};

$(document).ready(function() {
  ko.applyBindings(new viewModel());
});
