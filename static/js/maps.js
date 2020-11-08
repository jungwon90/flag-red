"use strict";

let fire_data = [{
  lat: -8.995439999999999,
  lon: 13.46979,
  confidence: "nominal",
  frp: 5.8,
  daynight: "D",
  detection_time: "2020-10-12T11:54:00.000Z",
  distance: 14.535512759983392
}];

let fire_markers = {};

let map;

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat:  37.77397, lng: -122.431297 },
    zoom: 8,
    fullscreenControl: false 
  });


  //loop over the fire_data to generate markers
  //markers(fire_data);

  /*
  const sfMarker = new google.maps.Marker({
    position: { lat:  37.77397, lng: -122.431297 },
    title: 'SF Bay',
    map: firemap
  }); 
 */


  


  /*
  sfMarker.addListener('click', ()=>{
    alert('Hi!');
  });

  const sfInfo = new google.maps.InfoWindow({
    content: '<h1>San Francisco!</h1>'
  });

  sfInfo.open(firemap, sfMarker); */
}

/*
//Generate markers 
const create_markers = (fires) => {
  //get coordinates from fire_data
  for(let i = 0; i < fire_data.length; i++){
    latitude = fire_data[i][lat];
    longitude = fire_data[i][lon];
    console.log(latitude, longitude);
  }

}

*/

/*
// retrieving the fire location cooordinates 
$('#search-form').on('submit', (evt)=>{
  evt.preventDefault();
  alert('event handler is working');

  const formInputs = {
    'search-by': $('#search-by').val(),
    'search-input': $('#search-input').val()
  };

  $.get('/search', formInputs, (response)=>{
    
    console.log(response);
    for (const fire of response){
      fire_data.push(fire);
    } 
  });

});
*/



