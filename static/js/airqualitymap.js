let map;

function airqualityMap() {
  map = new google.maps.Map(document.getElementById("airquality-map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}