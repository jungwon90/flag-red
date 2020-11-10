console.log('Hi');
console.log(ReactRouterDOM);
const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Switch = ReactRouterDOM.Switch;
const Link = ReactRouterDOM.Link;

let airData;
let firData;
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
    return (
        <div className="container">
            <div className = "row align-items-center">
                <div className="col-10 mx-auto">
                    <form action="/signup" method="POST" id="signup-form">
                        <label>Sign Up</label>
                        <div className="user-id-input">
                            <label>ID</label>
                            <input type="text"></input>
                            <button id="id-validation-btn">Valid?</button>
                        </div>
                        <label>First Name</label>
                        <input type="text"></input>
                        <label>Last Name</label>
                        <input type="text"></input>
                        <label>Password</label>
                        <input type="text"></input>
                        <label>Email</label>
                        <input type="text"></input>
                        <label>Phone Number</label>
                        <input type="text"></input>
                        <label>Zip Code</label>
                        <input type="text"></input>
                        <input type="submit" value="Sign Up"></input>
                    </form>
                </div>
            </div>
        </div>
    );
}


function Login(){
    return (
        <div className="container">
            <div className = "row align-items-center">
                <div className="col-10 mx-auto">
                    <form action="login" method="POST" id="login-form">
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
   
    return (
        <React.Fragment> 
            <label>Fleg Red</label>
            <SearchBar />
            <h3>Map</h3>
            <MapContainer />
            <div>Air quality Forecast</div>
        </React.Fragment>
    );
}

function About(){
    console.log('about')
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
            <div id="airqual-his-around-user">air history graph</div>
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


function SearchBar () {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [values, setValues] = React.useState({
        'cur-search-for': '',
        'cur-search-by': '',
        'cur-search-input': ''
    })
    console.log(isSubmitting, isError, values);

    const handleSubmit = async event =>{
        //get the values from the form
        const formInputs = {
            'cur-search-for': document.querySelector('#cur-search-for').value,
            'cur-search-by': document.querySelector('#cur-search-by').value,
            'cur-search-input': document.querySelector('#cur-search-input').value
        };
        setValues(formInputs); //updating state of values with form inputs
        setIsSubmitting(true); //updating state of isSubmitting

        event.preventDefault();
        alert('onSubmit event handler is working');
        console.log(isSubmitting, isError, values);
    
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
            setIsError(true);
            alert((`We were unable to retrieve data about ${formInputs['cur-search-for']}`));       
        });

    }
    
    
    return (
        <div className = "row align-items-center active-fire-btn-container">
            <div className="col-10 mx-auto">
                <form onSubmit={handleSubmit} id="search-form">
                    <label>What are you looking for?</label>
                     <select id="cur-search-for" name="cur-search-for">
                        <option value="air-quality">Air Quality</option>
                        <option value="fire">Active Fire</option>
                        <option value="soil">Soil</option>
                    </select>
                    <select id="cur-search-by" name="cur-search-by">
                        <option value="by-city">By City</option>
                        <option value="by-postal-code">By Zipcode</option>
                    </select>
                    <input type="text" name="cur-search-input" id="cur-search-input"></input>
                    <input type="submit" value="search"></input>
                </form>
            </div>
        </div>
    );
    
    
}


//----- Map -----//
function ShowMarkers(props){
    



    return(
        <div></div>
    );
}

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
        ref={ref}
      ></div>
    )
}


function MapContainer(props) {
    const [ map, setMap] = React.useState();
    const [ options, setOptions] = React.useState({
      center: { lat: 37.77397, lng: -122.431297},
      zoom: 8
    });
  
    const mapDimensions = {
      width: '100%',
      height: '60vh'
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
  
    React.useEffect(() => {
      if (map !== undefined) map.addListener('bounds_changed', 
        () => {
        /* props.setLocationBounds(map.getBounds()) */
  
        })
    }, [map])
  
    return (
      <div id="map-container" className="container">
        {/* <LocationSetter setSearchBox={setSearchBox} searchBox={searchBox} setOptions={setOptions} options={options}/> */}
        {MainMap}
        {/* <ShowMarkers map={map} onClick={onMarkerClick}/>  */}
      </div> 
    )
  }

ReactDOM.render(<App />, document.querySelector('#app'))