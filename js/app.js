/*jshint loopfunc:true */
var map;
var markers = [];
var marker;
var infowindow;

// array of locations

var locations = [
  {
    name: "The Forgotten Pyramids",
    latLng: { lat: 16.9381826, lng: 33.7488091 },
    wiki: "Nubian pyramids"
  },

  {
    name: "Tuti Island",
    latLng: { lat: 15.6393583, lng: 32.5217026 },
    wiki: "Tuti Island"
  },

  {
    name: "Longest River in the World",
    latLng: { lat: 15.615997, lng: 32.6859455 },
    wiki: "Nile"
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
  this.marker = data.marker;
}

// function to create a map and add markers

function createMap() {
  var latlng = new google.maps.LatLng(15.615997, 32.6859455);
  var sudan = {
    zoom: 20,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
   map = new google.maps.Map(document.getElementById("map"), sudan);


   // making the Map responsive 
   google.maps.event.addDomListener(window, "resize", function() {
   var center = map.getCenter();
   google.maps.event.trigger(map, "resize");
   map.setCenter(center); 
});

   infowindow = new google.maps.InfoWindow();
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
      animation: google.maps.Animation.DROP
    });

    
    markers.push(marker);

    locations[i].marker = marker;

    marker.addListener("click", function() {
      populateInfoWindow(this);
      toggleBounce(this);
    });

    bounds.extend(markers[i].position);
  }

  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);

ko.applyBindings(new ViewModel());

}

// function to handle Map loading Error

function mapError() {
  alert("Oops Somthing Went Wrong !");
}

// function to populate marker widnow with title and wikipedia artical

function populateInfoWindow(marker) {
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
        var extract =
          response.query.pages[Object.keys(response.query.pages)[0]].extract;

        infowindow.setContent(
          "<div>" +
            "<h4>" +
            marker.title +
            "</h4>" +
            extract +
            "<br>" +
            "<a href=" +
            sourceURL +
            ">Wikipedia</a>" +
            "</div>"
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

function toggleList() {
    var x = $(".search-box")[0];
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}


function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null);
    }, 1400);
  }
}

// a viewModel to store data and bind them the view

var ViewModel = function() {
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

  self.setList = function (location){
    google.maps.event.trigger(location.marker, 'click');
    };

  // observable to store userInput

  self.userInput = ko.observable("");

  // function to filter and search locations

  self.filterLocations = function() {
    var searchInput = self.userInput().toLowerCase();

    infowindow.close();

    self.search.removeAll();

    self.locations.forEach(function(location) {
   
      var index = markers.findIndex(function(marker) {
        return marker.title === location.name;
      });

      
      if (location.name.toLowerCase().indexOf(searchInput) !== -1) {
        self.search.push(location);

        markers[index].setVisible(true);
      } else {
        markers[index].setVisible(false);
      }
    });
  };
};


