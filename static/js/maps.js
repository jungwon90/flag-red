let firemap, airQmap;

function initMap() {
 
  firemap = new google.maps.Map(document.getElementById("fire-map"), {
    center: { lat:  37.77397, lng: -122.431297 },
    zoom: 8,
    fullscreenControl: false 
  });

  airQmap = new google.maps.Map(document.getElementById('airquality-map'), {
    center: { lat:  37.77397, lng: -122.431297 },
    zoom: 8,
    fullscreenControl: false 
  })
  
  //list of markers 
  const markers = [];


  //how to make markers on maps
  const sfMarker = new google.maps.Marker({
    position: { lat:  37.77397, lng: -122.431297 },
    title: 'SF Bay',
    map: firemap
  });


  //참고용 코드 마커에 이벤트 핸들링
  sfMarker.addListener('click', ()=>{
    alert('Hi!');
  });

  const sfInfo = new google.maps.InfoWindow({
    content: '<h1>San Francisco!</h1>'
  });

  sfInfo.open(firemap, sfMarker);
}





