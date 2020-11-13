console.log('Hi');
console.log(ReactRouterDOM);
const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Switch = ReactRouterDOM.Switch;
const Link = ReactRouterDOM.Link;

let airData;
let fireData;
let soilData;
console.log("nav bar!");



function App() {

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
                    <Route path="/login"><Login /></Route>
                    <Route path="/about"><About /></Route>
                    <Route path="/contact"><Contact /></Route>
                    <Route path="/profile"><Profile /></Route>
                    <Route path="/logout"><Logout /></Route>
                    <Route path="/"><Home /></Route>
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
                        <label>First Name</label>
                        <input onChange={e => {
                            e.preventDefault();
                            setFirstName(e.target.value)
                        }} type="text" name="first-name"></input>
                        <label>Last Name</label>
                        <input onChange={e =>{
                            e.preventDefault();
                            setLastName(e.target.value);
                        }}type="text" name="last-name"></input>
                        <label>Password</label>
                        <input onChange={e =>{
                            e.preventDefault();
                            setPassword(e.target.value);
                        }} type="text" name="password"></input>
                        <label>Email</label>
                        <input onChange={e =>{
                            e.preventDefault();
                            setEmail(e.target.value);
                        }} type="text" name="email"></input>
                        <label>Phone Number</label>
                        <input onChange={e =>{
                            e.preventDefault();
                            setPhoneNumber(e.target.value);
                        }} type="text" name="phone-number"></input>
                        <label>City</label>
                        <input onChange={e =>{
                            e.preventDefault();
                            setCity(e.target.value);
                        }} type="text" name="city"></input>
                        <input type="submit" value="Sign Up"></input>
                    </form>
                </div>
            </div>
        </div>
    );
}


function Login(){


    function handleSubmit(e){
        e.preventDefault();
    }

    return (
        <div className="container">
            <div className = "row align-items-center">
                <div className="col-10 mx-auto">
                    <form onSubmit={handleSubmit} action="login" method="POST" id="login-form">
                        <label>LOG IN</label>
                        <div>
                            <label>ID</label>
                            <input type="text" name="id"></input>
                        </div>
                        <div>
                            <label>PASSWORD</label>
                            <input type="text" name="password"></input>
                        </div>
                        <input type="submit" value="Log-In"></input>
                    </form>
                </div>
            </div>
        </div>
    );
}

function Home(){
    const [markerData, setMarkerData] = React.useState();
    const [dataType, setDataType] = React.useState('');

    return (
        <React.Fragment> 
            <label>Fleg Red</label>
            <SearchBar setMarkerData={setMarkerData} setDataType={setDataType} dataType={dataType}/>
            <h3>Map</h3>
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


function Profile(){
    return (
        <div>
            <h3>Profile</h3>
            <p>Welcome!</p>
            <div id="airqual-around-user">air quality graph</div>
            <div id="air-forecast-around-user">air forecast</div>
            <form>
                <label>fire/air alert request form</label>
            </form>
        </div>
    );
}

function Logout(){
    return (
        <div>Logout</div>
    );
}


//-- Search bar --//


function SearchBar (props) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [searchFor, setSearchFor]= React.useState('air-quality');
    const [searchBy, setSearchBy] = React.useState('by-city');
    const [searchInput, setSearchInput] =React.useState('');
    console.log(isSubmitting, isError, searchFor, searchBy, searchInput);


    const handleSubmit = async event =>{
        event.preventDefault();
        //get the values from the form
        const formInputs = {
            'cur-search-for': searchFor,
            'cur-search-by': searchBy,
            'cur-search-input': searchInput
        };
        setIsSubmitting(true); //updating state of isSubmitting
        
        alert('onSubmit event handler is working');
        console.log(isSubmitting, isError, searchFor, searchBy, searchInput);
        //updating state of props.dataType(set to searchFor)
        props.setDataType(searchFor);
        console.log(props.dataType);
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


//----- Map -----//


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

// function NoFire(props){
//     return (
//         <div>
//             <p>{props.message}</p>
//         </div>
//     )
// }
  
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
    const [hasData, setHasData] = React.useState(true);

    const mapDimensions = {
      width: '100%',
      height: '70vh'
    }

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
    
                console.log(latitude, longitude, aqi, co, no2, ozone, pm25, city, aqiInfo)
                //create air-quality markers..
                
    
            } else if(props.dataType == 'fire'){
                console.log(props.dataType)
                //Extract coordinate and data for display from props.markerData
                const fireData = props.markerData;
                const fires = fireData['data'] ;
                console.log(fireData);
                console.log(fire);
    
                for(const eachFire of fires){
                    latitude = eachFire['lat'];
                    longitude = eachFire['lon'];
                    const confidence = eachFire['confidence'];
                    const daynight = eachFire['daynight'];
                    const detectionTime = eachFire['detection_time'];
                    const frp = eachFire['frp'];
                    const distance = eachFire['distance'] * 0.62137; //convert km to miles
                    
                    console.log(latitude, longitude, confidence, daynight, detectionTime, frp, distance);
                }
    
                if(!props.dataType['data']){
                    setHasData(false);
                }
            } else {
                console.log(props.dataType)
                //Extract coordinate and data for display from props.markerData
    
            }
        }
        
        //create markers
        const sfMarker = new window.google.maps.Marker({position: {lat: 37.77397, lng: -122.431297},
            title:'Fire Detection',
            map: map});
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
        {MainMap}
      </div> 
    )
  }

ReactDOM.render(<App />, document.querySelector('#app'))