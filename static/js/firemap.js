let map;

function fireMap() {
  map = new google.maps.Map(document.getElementById("fire-map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}
