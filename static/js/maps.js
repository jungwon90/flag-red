"use strict";

let fireData; // an object of fire data and airforecast
let fires = []; // a list of fires

let airData; // an object of air quality data and airforecast
let soilData; // an object of soil data and airforecast

let searchLocation;

let map;

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat:  37.77397, lng: -122.431297 },
    zoom: 9,
    fullscreenControl: false 
  });


  const fireInfo = new google.maps.InfoWindow();
  
  //loop over the fires to generate markers
  for(const fire of fires){
    // Define the content of the infoWindow
    const fireInfoContent = (`
      <div class="window-content">
        <ul class="fire-info">
          <li><b>Fire confidence: </b>${fire['confidence']}</li>
          <li><b>Fire radiative power: </b>${fire['frp']} MW</li>
          <li><b>Day/Night: </b>${fire['daynight']}</li>
          <li><b>Detection time: </b>${fire['detection_time']}</li>
          <li><b>Distance: </b>${fire['distance'] * 0.62137}</li>
        </ul>
      </div>
    `);

    const fireMarker = new google.maps.Marker({
      position:{
        lat: fire['lat'],
        lng: fire['lon']
      },
      title: `Fire Detection`,
      map: map
    });

    fireMarker.addListener('click', ()=>{
      fireInfo.close();
      fireInfo.setContent(fireInfoContent);
      fireInfo.open(map, fireMarker);
    });
  }

  // retrieving the fire location cooordinates 
  window.onload = function(){
    document.querySelector('#search-form').addEventListener('submit', (evt)=>{
      evt.preventDefault();
      alert('event handler is working');
    
      const formInputs = {
        'cur-search-for': $('#cur-search-for').val(),
        'cur-search-by': $('#cur-search-by').val(),
        'cur-search-input': $('#cur-search-input').val()
      };
      
      //get ruquest to /search in the server
      $.get('/search', formInputs, (response)=>{

        //if search-for =='air-quality'
        if ( formInputs['cur-search-for'] == 'air-quality'){
          //store the response data into 'airData' variable
          airData = response
          console.log(airData);

        //if search-for == 'fire
        } else if(formInputs['cur-search-for'] == 'fire'){
          //store the response data into 'firData' variable
          fireData = response
          console.log(fireData);

          fires = fireData['data'];
          console.log(fires)
          
        //if search-for == 'soil
        } else if(formInputs['cur-search-for'] == 'soil'){
          //store the response data into 'soilData' variable
          soilData = response
          console.log(soilData)
        } 
      }).fail(() => {
        alert((`We were unable to retrieve data about ${formInputs['cur-search-for']}`));       
      });
    });
  }
  

  
  const sfMarker = new google.maps.Marker({
    position: { lat:  37.77397, lng: -122.431297 },
    title: 'SF Bay',
    map: firemap
  }); 
 
  
  sfMarker.addListener('click', ()=>{
    alert('Hi!');
  });

  const sfInfo = new google.maps.InfoWindow({
    content: '<h1>San Francisco!</h1>'
  });

  sfInfo.open(firemap, sfMarker); 
}








