console.log('Hi');
console.log(ReactRouterDOM);
const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Switch = ReactRouterDOM.Switch;
const Link = ReactRouterDOM.Link;
const Redirect = ReactRouterDOM.Redirect;

let airData;
let fireData;
let soilData;
console.log("nav bar!");


function App() {
    const [user, setUser] = React.useState('');
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);


    return (
        <Router>
            
            <div>
                <nav className="navbar navbar-light bg-light">
                    <i>flag red icon</i>
                    <ul className="navbar-ul-list">
                        <li className="navbar-list">
                            <Link to="/signup">Sign Up</Link>
                        </li>
                        <li className="navbar-list">
                            <Link to="/login">Log In</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/about">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/contact">Contact</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/profile">Profile</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/logout">Log out</Link>
                        </li>
                    </ul>  
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                         
                        </ul>
                    </div>
                </nav>
   
            
                {/* <Switch> looks through its children <Route>s and renders 
                the first one that matches the current URL */}
                <Switch>
                    <Route path="/signup"><Signup /></Route>
                    <Route path="/login">
                        {isLoggedIn ? <Redirect to="/" /> : <Login setUser={setUser} setIsLoggedIn={setIsLoggedIn}/>} 
                    </Route>
                    <Route path="/about"><About /></Route>
                    <Route path="/contact"><Contact /></Route>
                    <Route path="/profile"><Profile user={user} isLoggedIn={isLoggedIn}/></Route>
                    <Route path="/logout">{!isLoggedIn ? <Redirect to="/"/> : <Logout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}
                    </Route>
                    <Route path="/"><Home isLoggedIn={isLoggedIn}/></Route>
                </Switch>
            </div> 
            
        </Router>
    );
}



function Signup(){
    const [idInput, setIdInput] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [city, setCity] = React.useState('');

    console.log(idInput, firstName, lastName, password, email, phoneNumber, city);

    function handleValidId(e){
        e.preventDefault();
        //get request to sever to check all the ids with the given id. check if the idInput is valid
        $.get('/valid.json', (res) =>{
            console.log(res);
            let isValid = true;
            for(const userId of res){
                //if the id is valid, alert(id is valid)
                if(userId === idInput){
                    alert('This ID is not valid');
                    isValid = false;
                    break;
                }
            }

            if(isValid){
                alert('This ID is valid');
            }
        });
    }

    function handleSubmit(e){
        e.preventDefault();

        const formInputs = {
            'input-id': idInput,
            'first-name': firstName,
            'last-name': lastName,
            'password': password,
            'email': email,
            'phone-number': phoneNumber,
            'city': city
        }

        $.post('/signup', formInputs, (res) =>{
            console.log(res);
            if(res['success']){
                alert('Account created! Please log in!');
            }
        });
    }

    return (
        <div className="container">
            <div className = "row align-items-center">
                <div className="col-10 mx-auto">
                    <form onSubmit={handleSubmit} id="signup-form">
                        <label>Sign Up</label>
                        <div className="user-id-input">
                            <label>ID</label>
                            <input onChange={e => { 
                                e.preventDefault();
                                setIdInput(e.target.value);}} type="text" name="input-id"></input>
                            <button onClick={handleValidId} id="id-validation-btn">Valid?</button>
                        </div>
                        <div>
                            <label>First Name</label>
                            <input onChange={e => {
                                e.preventDefault();
                                setFirstName(e.target.value)
                            }} type="text" name="first-name"></input>
                        </div>
                        <div>
                            <label>Last Name</label>
                            <input onChange={e =>{
                                e.preventDefault();
                                setLastName(e.target.value);
                            }}type="text" name="last-name"></input>
                        </div>
                        <div>
                            <label>Password</label>
                            <input onChange={e =>{
                                e.preventDefault();
                                setPassword(e.target.value);
                            }} type="text" name="password"></input>
                        </div>
                        <div>
                            <label>Email</label>
                            <input onChange={e =>{
                                e.preventDefault();
                                setEmail(e.target.value);
                            }} type="text" name="email"></input>
                        </div>
                        <div>
                            <label>Phone Number</label>
                            <input onChange={e =>{
                                e.preventDefault();
                                setPhoneNumber(e.target.value);
                            }} type="text" name="phone-number"></input>
                        </div>
                        <div>
                            <label>City</label>
                            <input onChange={e =>{
                                e.preventDefault();
                                setCity(e.target.value);
                            }} type="text" name="city"></input>
                        </div>
                        <input type="submit" value="Sign Up"></input>
                    </form>
                </div>
            </div>
        </div>
    );
}


function Login(props){
    const [id, setId] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleSubmit = async e =>{
        e.preventDefault();
        
        const formInputs = {
            'id': id,
            'password': password
        }
        //post request to server
        $.post('/login', formInputs, (res) =>{
            alert(res['message']);
            if(res['message'] === 'Logged in!'){
                props.setIsLoggedIn(true);
                props.setUser(id);
            }
        });
    }

    return (
        <div className="container">
            <div className = "row align-items-center">
                <div className="col-10 mx-auto">
                    <form onSubmit={handleSubmit} id="login-form">
                        <label>LOG IN</label>
                        <div>
                            <label>ID</label>
                            <input onChange={e => {
                                e.preventDefault();
                                setId(e.target.value);
                            }} type="text" name="id"></input>
                        </div>
                        <div>
                            <label>PASSWORD</label>
                            <input onChange={e =>{
                                e.preventDefault();
                                setPassword(e.target.value);
                            }} type="text" name="password"></input>
                        </div>
                        <input type="submit" value="Log-In"></input>
                    </form>
                </div>
            </div>
        </div>
    );
}


function Home(props){
    const [markerData, setMarkerData] = React.useState();
    const [dataType, setDataType] = React.useState('');

    let loginMessage = '';
    if(props.isLoggedIn){
        loginMessage = "You're logged in!";
    }

    return (
        <React.Fragment>
            <label>{loginMessage}</label> 
            <label>Fleg Red</label>
            <SearchBar setMarkerData={setMarkerData} setDataType={setDataType}/>
            <MapContainer markerData={markerData} dataType={dataType}/>
            <div>Air quality Forecast</div>
        </React.Fragment>
    );
}

function About(){
    return (
    
        <div>About</div>
    );
}



function Contact(){
    return (
        <div>
            <h3>Membership Issue / Technical Support</h3>
            <p>Contact info : koag132@gmail.com</p>
        </div>
    );
}


function Profile(props){

    const currentUser = props.user;   
    let tempStr = '';

    if(currentUser !== ''){
        //if there's user, get request to server to get user profile data from DB
       $.get('/profile.json', {'current-user': currentUser}, (res)=>{
            console.log(res);
            const airforecast = res;
            const day1 = airforecast['1'];
            console.log(day1);
            
            const aqi = day1['aqi'];
            console.log(aqi);
         
        });
        
    } 

    return (
        <section>
            <h3>Profile</h3>
            <p>Welcome!{currentUser}</p>
            <p>{tempStr}</p>
            <div id="airqual-around-user">air quality graph</div>
            <div id="air-forecast-around-user">air forecast</div>
            <form>
                <label>fire/air alert request form</label>
            </form>
        </section>
    );
}


function Logout(props){
    //update state of isLoggedIn if isLoggedIn is true
    if(props.isLoggedIn){
        $.post('/logout', (res)=>{
            props.setIsLoggedIn(false);
            alert(res['message']);
        });
    }

    return (
        <div></div>
    );
}


//--------- Search bar ---------//


function SearchBar (props) {
    const [isError, setIsError] = React.useState(false);
    const [searchFor, setSearchFor]= React.useState('air-quality');
    const [searchBy, setSearchBy] = React.useState('by-city');
    const [searchInput, setSearchInput] =React.useState('');
    

    const handleSubmit = async event =>{
        event.preventDefault();
        //get the values from the form
        const formInputs = {
            'cur-search-for': searchFor,
            'cur-search-by': searchBy,
            'cur-search-input': searchInput
        };
        
        alert('onSubmit event handler is working');
        console.log(isError, searchFor, searchBy, searchInput);
        //updating state of props.dataType(set to searchFor)
        props.setDataType(searchFor);

        //get ruquest to /search in the server
        $.get('/search', formInputs, (response)=>{
             //if search-for =='air-quality'
            if ( formInputs['cur-search-for'] == 'air-quality'){
                //store the response data into 'airData' variable
                airData = response
                console.log(airData);

                //updating state of props.markerData
                props.setMarkerData(airData);
                
            //if search-for == 'fire
            } else if(formInputs['cur-search-for'] == 'fire'){
                //store the response data into 'firData' variable
                fireData = response
                console.log(fireData);
                
                //it's undefined on console when there's no active fire
                const fires = fireData['data'];
                console.log(fires)

                //updating state of props.markerData
                props.setMarkerData(fireData);  
                
            //if search-for == 'soil
            } else if(formInputs['cur-search-for'] == 'soil'){
                //store the response data into 'soilData' variable
                soilData = response
                console.log(soilData)

                //updating state of props.markerData
                props.setMarkerData(soilData);
        
            } 

        }).fail(() => {
            setIsError(true);
            alert((`We were unable to retrieve data about ${formInputs['cur-search-for']}`));       
        });

    }
    
    
    return (
        <div className = "row align-items-center active-fire-btn-container">
            <div className="col-10 mx-auto">
                <form onSubmit={handleSubmit} id="search-form">
                    <label>What are you looking for?</label>
                     <select onChange={(e) => { 
                         e.preventDefault();
                         setSearchFor(e.target.value);
                     }} id="cur-search-for" name="cur-search-for">
                        <option value="air-quality">Air Quality</option>
                        <option value="fire">Active Fire</option>
                        <option value="soil">Soil</option>
                    </select>
                    <select onChange={(e) =>{
                        e.preventDefault();
                        setSearchBy(e.target.value);
                    }} id="cur-search-by" name="cur-search-by">
                        <option value="by-city">By City</option>
                        <option value="by-postal-code">By Zipcode</option>
                    </select>
                    <input type="text" onChange={(e)=>{
                        e.preventDefault();
                        setSearchInput(e.target.value);
                    }} name="cur-search-input" id="cur-search-input"></input>
                    <input type="submit" value="search"></input>
                </form>
            </div>
        </div>
    );
    
    
}


//------------ Map ------------//


function MapComponent(props) {
    console.log('rendering the map')
    const options = props.options;
    const ref = React.useRef(); // creating Ref object

    React.useEffect(() => {

        const createMap = () => props.setMap(new window.google.maps.Map(ref.current, options));

        if (!window.google) { // Create an html element with a script tag in the DOM
            const script = document.createElement('script');
            script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBcPj2Lex4W5AXEhwsPQ02lAG8Axsn2hQg&libraries=places';
            document.head.append(script);
            script.addEventListener('load', createMap);
            console.log('and now there is a map')
            return () => script.removeEventListener('load', createMap);

        } else { // Initialize the map if a script element with google url IS found
            createMap();
            console.log('and now there is a map');
        }


    }, [options.center.lat]); //Need the value of the lat of options because it does not change
  
    if (props.map) {
      console.log('and the map exists')
    } else { console.log('but there is no map')}
    
  
    return (
        <div id="map-div"
            style={{ height: props.mapDimensions.height, 
            margin: `1em 0`, borderRadius: `0.5em`, 
            width: props.mapDimensions.width }}
            ref={ref} >
        
        </div>
    )
}

  
function MapContainer(props) {
    //map and map options
    const [ map, setMap] = React.useState();
    const [ options, setOptions] = React.useState({
      center: { lat: 37.77397, lng: -122.431297},
      zoom: 10
    });
    //markers and marker options
    const [markerOptions, setMarkerOptions ] = React.useState([{
        position: {lat: 37.77397, lng: -122.431297},
        title:'Fire Detection',
        map: map
    }]);
    const [markers, setMarkers] = React.useState([]);


    const mapDimensions = {
      width: '100%',
      height: '70vh'
    }

    let noDataFound = '';

    //if there's a map 
    if (map){
        console.log('hi');
        console.log(map);
        console.log(props.markerData);
        
        let latitude = 0;
        let longitude = 0;

        if(props.markerData){
            if(props.dataType == 'air-quality'){
                console.log(props.dataType)
                //Extract coordinate and data for display from props.markerData
                const airQualData = props.markerData['stations'][0];
                console.log(airQualData);
    
                latitude = airQualData['lat'];
                longitude = airQualData['lng'];
                const aqi = airQualData['AQI'];
                const co = airQualData['CO'];
                const no2 = airQualData['NO2'];
                const ozone = airQualData['OZONE'];
                const pm25 = airQualData['PM25'];
                const city = airQualData['division'];
                const aqiInfo = airQualData['aqiInfo'];
                console.log(latitude, longitude, aqi, co, no2, ozone, pm25, city, aqiInfo);

                const airInfo = new google.maps.InfoWindow();

                const airInfoContent = (`
                    <div class="window-content">
                        <ul class="air-info">
                        <li><b>City: </b>${city}</li>
                        <li><b>Air Quality Index: </b>${aqi}</li>
                        <li><b>Ultrafine Dust Level: </b>${pm25}</li>
                        <li><b>Carbon Monoxide: </b>${co}</li>
                        <li><b>Nitrogen Dioxide: </b>${no2}</li>
                        <li><b>Ozone: </b>${ozone}</li>
                        <li><b>AQI Info: </b>${aqiInfo}</li>
                        </ul>
                    </div>
                `);

                const airMarker = new window.google.maps.Marker({
                    position: {lat: latitude, lng: longitude},
                    title:'Air Quality Info',
                    map: map});
                    
                airMarker.addListener('click', ()=>{
                    airInfo.close();
                    airInfo.setContent(airInfoContent);
                    airInfo.open(map, airMarker);
                });

                // Get API key from the server
                let API_KEY2;
                $.get('/waqikey.json', (res) => {
                    API_KEY2 = res['API_KEY2'];
                });
                
                //create air quality index markers near by the location
                let airQualMapOverlay = new google.maps.ImageMapType({
                    getTileUrl: function(coord, zoom){
                        return `https://tiles.aqicn.org/tiles/usepa-aqi/${zoom}/${coord.x}/${coord.y}.png?token=${API_KEY2}`;
                    },
                    name: "Air Quality"
                });
                
                map.overlayMapTypes.insertAt(0, airQualMapOverlay);
    
            } else if(props.dataType == 'fire'){
                console.log(props.dataType)
                //Extract coordinate and data for display from props.markerData
                const fireData = props.markerData;
                const fires = fireData['data'] ;
                console.log(fireData);
                console.log(fires);
    
                for(const eachFire of fires){
                    latitude = eachFire['lat'];
                    longitude = eachFire['lon'];
                    let confidence = eachFire['confidence'];
                    let daynight = eachFire['daynight'];
                    let detectionTime = eachFire['detection_time'];
                    let frp = eachFire['frp'];
                    let distance = eachFire['distance'] * 0.62137; //convert km to miles
                    
                    console.log(latitude, longitude, confidence, daynight, detectionTime, frp, distance);
                    
                    //create markers and info windows
                    const fireInfo = new google.maps.InfoWindow();

                    const fireInfoContent = (`
                        <div class="window-content">
                            <ul class="fire-info">
                            <li><b>Fire confidence: </b>${confidence}</li>
                            <li><b>Fire radiative power: </b>${frp} MW</li>
                            <li><b>Day/Night: </b>${daynight}</li>
                            <li><b>Detection time: </b>${detectionTime}</li>
                            <li><b>Distance: </b>${distance}</li>
                            </ul>
                        </div>
                        `);

                    const fireMarker = new window.google.maps.Marker({
                        position: {lat: latitude, lng: longitude},
                        title:'Fire Detection',
                        map: map});
                    
                    fireMarker.addListener('click', ()=>{
                        fireInfo.close();
                        fireInfo.setContent(fireInfoContent);
                        fireInfo.open(map, fireMarker);
                    });
                }

                if(fireData.length === 0){
                    noDataFound = "No Fire Data Found";
                }

            } else {
                console.log(props.dataType)
                const city = props.markerData['airforecast']['city'];
                const coordinate = city['geo']; //an array of lat, lng
                const soilData = props.markerData['data'];

                //Extract coordinate and data for display from props.markerData
                latitude = coordinate[0];
                longitude = coordinate[1];

                for(const soil of soilData){
                    let soilMoisture = soil['soil_moisture'];
                    let soilTemperature = soil['soil_temperature'];

                    //create markers and info windows
                    const soilInfo = new google.maps.InfoWindow();

                    const soilInfoContent = (`
                        <div class="window-content">
                            <ul class="soil-info">
                            <li><b>Soil Moisture: </b>${soilMoisture}</li>
                            <li><b>Soil Temperature: </b>${soilTemperature} MW</li>
                            </ul>
                        </div>
                        `);
                    
                    const soilMarker = new window.google.maps.Marker({
                        position: {lat: latitude, lng: longitude},
                        title:'Soil Condition',
                        map: map});
                    
                    soilMarker.addListener('click', ()=>{
                        soilInfo.close();
                        soilInfo.setContent(soilInfoContent);
                        soilInfo.open(map, soilMarker);
                    });
                }
            }
        }
        
    }
    
    //useCallback -> optimize the rendering behavior of React components.
    const MainMap = React.useCallback( 
      <MapComponent
        map={map} 
        setMap={setMap} 
        options={options}
        setOptions={setOptions}
        mapDimensions={mapDimensions}
      />, [options])
    

  
    return (
      <div id="map-container" className="container">
        {/* <LocationSetter setSearchBox={setSearchBox} searchBox={searchBox} setOptions={setOptions} options={options}/> */}
        {noDataFound}
        {MainMap}
      </div> 
    )
  }

ReactDOM.render(<App />, document.querySelector('#app'))