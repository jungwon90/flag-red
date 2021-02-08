console.log('Hi');
console.log(ReactRouterDOM);
//store ReactRouterDOM elements
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
    const [signedup, setSignedup] = React.useState(false);
 
    React.useEffect(()=>{
        const navBar = document.querySelector('.navbar');
        const stickyTop = document.querySelector('.js--section-features').offsetTop;
        const scrollCallBack = window.addEventListener('scroll', () =>{
            if(window.pageYOffset > stickyTop){
                navBar.classList.add('sticky');
            } else{
                navBar.classList.remove('sticky');
            }
        });

        return ()=>{
            window.removeEventListener('scroll', scrollCallBack);
        }

    }, []);

    return (
        <Router>
            
            <div>
                <nav className="navbar navbar-light bg-light sticky">
                    <ion-icon name="flag" className="flag-icon"></ion-icon>
                    <div className="navbar-ul-list-container">
                        <ul className="navbar-ul-list">
                            <li className="navbar-list main-nav">
                                <Link to="/signup">Sign Up</Link>
                            </li>
                            <li className="navbar-list">
                                <Link to="/login">Log In</Link>
                            </li>
                        </ul>
                    </div>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto main-nav">
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
                    </div>
                </nav>
   
            
                {/* <Switch> looks through its children <Route>s and renders 
                the first one that matches the current URL */}
                <Switch>
                    <Route path="/signup">
                        {signedup ? <Redirect to="/" /> : <Signup setSignedup={setSignedup} />}
                    </Route>
                    <Route path="/login">
                        {isLoggedIn ? <Redirect to="/" /> : <Login setUser={setUser} setIsLoggedIn={setIsLoggedIn}/>} 
                    </Route>
                    <Route path="/about"><About /></Route>
                    <Route path="/contact"><Contact /></Route>
                    <Route path="/profile">
                        {!isLoggedIn ?  <Redirect to="/" /> : <Profile user={user} />}
                    </Route>
                    <Route path="/logout">
                        {!isLoggedIn ? <Redirect to="/"/> : <Logout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}
                    </Route>
                    <Route path="/"><Home isLoggedIn={isLoggedIn}/></Route>
                </Switch>
            </div> 
            
        </Router>
    );
}



function Signup(props){
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

            //if the ID is valid show a pop-up message
            if(isValid){
                Toastify({
                    text: 'This ID is valid',
                    duration: 3000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "left", // `left`, `center` or `right`
                    backgroundColor: "linear-gradient(to right, #39E5B6, #70B2D9)",
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    onClick: function(){} // Callback after click
                }).showToast();
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
                //if successfully logged in, show a pop-up message
                Toastify({
                    text: 'Account created! Please log in!',
                    duration: 3000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "left", // `left`, `center` or `right`
                    backgroundColor: "linear-gradient(to right, #39E5B6, #70B2D9)",
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    onClick: function(){} // Callback after click
                }).showToast();
                props.setSignedup(true);
            }
        });
    }

    return (
        <div className="container signup">
            <div className = "row align-items-center">
                <div className="col-10 mx-auto">
                    <form onSubmit={handleSubmit} id="signup-form">
                        <label className="signup-label">Sign Up</label>
                        <div className="user-id-input signup-inputs">
                            <label className="signup-input-label">ID</label>
                            <input onChange={e => { 
                                e.preventDefault();
                                setIdInput(e.target.value);}} type="text" name="input-id" id="input-id"></input>
                            <button onClick={handleValidId} id="id-validation-btn">Valid?</button>
                        </div>
                        <div className="signup-inputs">
                            <label className="signup-input-label">First Name</label>
                            <input onChange={e => {
                                e.preventDefault();
                                setFirstName(e.target.value)
                            }} type="text" name="first-name"></input>
                        </div>
                        <div className="signup-inputs">
                            <label className="signup-input-label">Last Name</label>
                            <input onChange={e =>{
                                e.preventDefault();
                                setLastName(e.target.value);
                            }}type="text" name="last-name"></input>
                        </div>
                        <div className="signup-inputs">
                            <label className="signup-input-label">Password</label>
                            <input onChange={e =>{
                                e.preventDefault();
                                setPassword(e.target.value);
                            }} type="password" name="password"></input>
                        </div>
                        <div className="signup-inputs">
                            <label className="signup-input-label">Email</label>
                            <input onChange={e =>{
                                e.preventDefault();
                                setEmail(e.target.value);
                            }} type="text" name="email"></input>
                        </div>
                        <div className="signup-inputs">
                            <label className="signup-input-label">Phone Number</label>
                            <input onChange={e =>{
                                e.preventDefault();
                                setPhoneNumber(e.target.value);
                            }} type="text" name="phone-number"></input>
                        </div>
                        <div className="signup-inputs">
                            <label className="signup-input-label">City</label>
                            <input onChange={e =>{
                                e.preventDefault();
                                setCity(e.target.value);
                            }} type="text" name="city"></input>
                        </div>
                        <input type="submit" value="Sign Up" id="signup-btn"></input>
                    </form>
                </div>
            </div>
        </div>
    );
}

function LoggedinPopup(props){
    return(
        <div>
            <label>{props.alertMessage}</label>
            <button onClick={handleClose}>OK</button>
            
        </div>
    )
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
            
            if(res['message'] === 'Logged in!'){
                props.setIsLoggedIn(true);
                props.setUser(id);
            }

            Toastify({
                text: `${res['message']}`,
                duration: 3000,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "left", // `left`, `center` or `right`
                backgroundColor: "linear-gradient(to right, #39E5B6, #70B2D9)",
                stopOnFocus: true, // Prevents dismissing of toast on hover
                onClick: function(){} // Callback after click
            }).showToast();

        });
    }
    

    return (
        <div className="container login">
            <div className = "row align-items-center">
                <div className="col-10 mx-auto">
                    <form onSubmit={handleSubmit} id="login-form">
                        <label className="login-label">LOG IN</label>
                        <div className="login-inputs">
                            <label className="login-input-label">ID</label>
                            <input onChange={e => {
                                e.preventDefault();
                                setId(e.target.value);
                            }} type="text" name="id"></input>
                        </div>
                        <div className="login-inputs">
                            <label className="login-input-label">PASSWORD</label>
                            <input onChange={e =>{
                                e.preventDefault();
                                setPassword(e.target.value);
                            }} type="password" name="password"></input>
                        </div>
                        <input type="submit" value="Log-In" id="login-btn"></input>
                    </form>
                </div>
            </div>
        {/* {showPopup ? <LoggedinPopup alertMessage={alertMessage}/> : null} */}
        </div>
    );
}


function Home(props){
    const [markerData, setMarkerData] = React.useState();
    const [dataType, setDataType] = React.useState('');
    const [city, setCity] = React.useState('');

    let loginMessage = '';
    if(props.isLoggedIn){
        loginMessage = "You're logged in!";
    }


    return (
        <div>
            <label>{loginMessage}</label>
            <div className="title-container">
                <ion-icon name="flag" className="flag-icon"></ion-icon>
                <label className="flag-red">Flag Red</label>
            </div>
            <div className="search-bar-container">
                <SearchBar setMarkerData={setMarkerData} setDataType={setDataType} setCity={setCity}/>
            </div> 
            <MapContainer markerData={markerData} dataType={dataType}/>
            <div className="air-qual-idx-img-container">
                <label className="map-aqi">AIR QUALITY INDEX</label>
                <img className="air-qual-index-img" src="/static/img/aqi.png" alt="Air Quality Index"></img>
            </div>
            <div className="container js--section-features">
                <UVIWidget markerData={markerData}/>
                <AQIWidget markerData={markerData} />
            </div>
            <AirQualityForecast markerData={markerData} city={city}/>
            <div>
                <WorldAQIWidget /> 
            </div>
        </div>
    );
}

function About(){
    return (
        <div className="about-container">
            <h3 className="about-heading">We want to be your safeguard from air pollution.</h3>
            <p className="about-p">
                Polluted air affects well-being with disruption to our ecosystem and various health risks.
                Flag Red helps identify pollution-dense in your location and monitor air pollution.
                Poor air quality levels can aggravate respiratory ailments, wheezing, lowers immunity,
                fatigue and much more. Air Pollution is also an indicator of global warming and climate change.
            </p>
            <h3 className="about-heading">Protect yourself from wildfires today.</h3>
            <p className="about-p">
                Active fires not only disrupts an ecosystem with severe injuries, loos of life, and damage to
                property. Fires also affects life in various forms with toxic amounts of lingering pollution in the air.
                This is harmful to Human and Earth.
            </p>
            <h3 className="about-heading">Make better decisionss with the real-time soil data</h3>
            <p className="about-p">
                Farmers and horticulturalists rely on soil condition and weather to estimate crop growth through
                guesswork and experience with possible errors. Soil moisture and temperature dictate the type of biome
                present and the land suitability for growing crops.
            </p>
        </div>
    );
}



function Contact(){
    return (
        <div className="contact-container">
            <h3 className="contact-heading">Membership Issue / Technical Support</h3>
            <p>Contact Info : koag132@gmail.com</p>
        </div>
    );
}




function ToggleSwitch(props){
    return(
        <label className="switch">
            <input checked={props.checked} onChange={(e) => {
                e.preventDefault(); 
                props.onChange(e.target.checked)}} type="checkbox"></input>
            <span className="slider round"></span>
        </label>
    );
}

function ProfileUVIWidget(props){
    const uvi = props.uvi; //pull out today's uvi level
    let uvLevel = '';
    let uvimg = '/static/img/uvnone.png';
    let explainUVI = '';
    
    //find out uv level based on the uvi
    if(uvi <= 2){
        uvLevel = 'LOW';
        uvimg = '/static/img/uvilow.png';
        explainUVI = `Wear sunglasses on bright days. 
                If you burn easily, cover up and use broad spectrum SPF 30+ sunscreen.
                Bright surfaces, sand, water, and snow will increase UV exposure.`;
    } else if(uvi > 2 && uvi <= 5){
        uvLevel = 'MODERATE';
        uvimg = '/static/img/uvimoderate.png';
        explainUVI = `Stay in shade near midday when the SUN is strongest.
                    If outdoors, wear sun-protective clothing, a wide-brimmed hat, and UV-blocking sunglasses
                    Generously apply broad spectrum SPF 30+ sunscreen every 1.5 hours, even on cloudy days.
                    Bright surfaces, sand, water, and snow will increase UV exposure.`;
    } else if(uvi > 5 && uvi <= 7){
        uvLevel = 'HIGH';
        uvimg = '/static/img/uvihigh.png';
        explainUVI = `Reduce time in the sun between 10AM and 4PM. If outdoors, seek shade and wear sun-protective clothing,
                    a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 30+ sunscreen
                    every 1.5 hours, even on cloudy days. Bright surfaces, sand, water, and snow will increase UV exposure.`;
    } else if(uvi > 7 && uvi <= 10){
        uvLevel = 'VERY HIGH';
        uvimg = '/static/img/uviveryhigh.png';
        explainUVI = `Minimize sun exposure between 10AM. and 4PM. If outdoors, seek shade and wear sun-protective clothing, 
                    a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 30+ sunscreen every 1.5 hours, 
                    even on cloudy days. Bright surfaces, such as sand, water, and snow, will increase UV exposure.`;
    } else if(uvi > 10){
        uvLevel = 'EXTREME';
        uvimg = '/static/img/uviextreme.png';
        explainUVI = `Try to avoid sun exposure between 10 a.m. and 4 p.m. If outdoors, seek shade and wear sun-protective clothing, 
                    a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 30+ sunscreen every 1.5 hours, 
                    even on cloudy days. Bright surfaces, such as sand, water, and snow, will increase UV exposure.`;
    }

    return (
        <div className="user-uvi-container">
            <div className="small-widgets">
            <label>UV INDEX</label>
            </div>
            <div>
                <label className="level-label">CURRENT UV LEVEL</label>
                <p className="uvi-level">{uvLevel}</p>
            </div>
            <div>
                <img className="uv-img" src={uvimg} alt="UVI IMG"></img>
            </div>
            <div>
                <label>CURRENT UVI</label>
                <p className="index">{uvi}</p>
            </div>
            <p>{explainUVI}</p>
        </div>
    );
}




function ProfileAQIWidget(props){
    const aqi = props.aqi
    let aqiImg = '';
    let aqiLevel = '';
    let explainAQI = '';

    if(aqi <= 50){
        aqiImg = '/static/img/aqigood.png';
        aqiLevel = 'GOOD';
        explainAQI = 'Air pollution poses little or no risk.';
    } else if(aqi > 50 && aqi <= 100){
        aqiImg = '/static/img/aqimoderate.png';
        aqiLevel = 'MODERATE';
        explainAQI = 'Health concern for people who are unusually sensitive to air pollution';
    } else if(aqi > 100 && aqi <= 150){
        aqiImg = '/static/img/aqiunhealthyfors.png';
        aqiLevel = 'UNHEALTHY FOR SENSITIVE GROUPS';
        explainAQI = 'Sensitve groups, young children and the elderly, may experience health effects';
    } else if(aqi > 150 && aqi <= 200){
        aqiImg = '/static/img/aqiunhealthy.png';
        aqiLevel = 'UNHEALTHY';
        explainAQI = 'Everyone may experience health effects; sensitive groups may experience more serious health effects.';
    } else if(aqi > 200 && aqi <= 300){
        aqiImg = '/static/img/aqiveryunhealthy.png';
        aqiLevel = 'VERY UNHEALTHY';
        explainAQI = 'Health alert: everyone may experience more serious health effects.';
    } else {
        aqiImg = '/static/img/aqihazardous.png';
        aqiLevel = 'HAZARDOUS';
        explainAQI = 'Health warnings of emergency conditions. The entire population is more likely to be affected.';
    }

    return(
        <div className='user-aqi-container'>
            <div className="small-widgets">
                <label>AIR QUALITY INDEX</label>
            </div>
            <div>
                <img className="aqi-img" src={aqiImg} alt="AQI IMG"></img>
                <h3 className="aqi-today">TODAY</h3>
                <p className="aqi-level">{aqiLevel}</p>
            </div>
            <div>
                <p>AQI: <span className="index">{aqi}</span></p>
                <p></p>
            </div>
            <div>
                <p>{explainAQI}</p>
            </div>
        </div>
    );
}

function ProfileEachforecast(props){
    return (
        <div className="air-forecast-daily">
            <div className="date-container">
                <h3 className="air-forecast-date">{props.date}</h3>
            </div>
            <div>
                <div className="air-forecast-label">
                    <label className="air-type">OZONE: {props.o3}</label>
                </div>
                <div className="air-level">
                    <img src={props.o3imgURL} className="air-forecast-img"></img>
                    <p>{props.o3Level}</p>
                </div>
            </div>
            <div>
                <div className="air-forecast-label">
                    <label className="air-type">PM2.5: {props.pm25} </label>
                </div>
                <div className="air-level">
                    <img src={props.pm25imgURL} className="air-forecast-img"></img>
                    <p>{props.pm25Level}</p>
                </div>
            </div>
            <div>
                <div className="air-forecast-label">
                    <label className="air-type">PM10: {props.pm10}</label>
                </div>
                <div className="air-level">
                    <img src={props.pm10imgURL} className="air-forecast-img"></img>
                    <p>{props.pm10Level}</p>
                </div>       
            </div>
            <div>
                <div className="air-forecast-label">
                    <label className="air-type">UVI : {props.uvi}</label>
                </div>
                <div className="air-level">
                    <img src={props.UVIimgURL} className="air-forecast-img"></img>
                    <p>{props.uvLevel}</p>   
                </div>  
            </div>
            <div>
                <div className="air-forecast-label">
                    <label className="air-type">DOMINENT POLLUTION</label>
                </div>
                <div className="air-level">
                    <p>{props.dominentpol}</p>
                </div> 
            </div>
        </div>
    );
}

function ProfileAirQualForecast(props){
    let airData = props.airData;
    
    let o3 = '-';
    let pm10 = '-';
    let pm25 = '-';
    let uvi = '-';
    let o3imgURL = '/static/img/none.png';
    let pm25imgURL = '/static/img/none.png';
    let pm10imgURL = '/static/img/none.png';
    let UVIimgURL = '/static/img/uvinone.png';
    let o3Level = '';
    let pm25Level = '';
    let pm10Level = '';
    let uvLevel = '';
    let date;
    let dominentpol = '';

    //Get today's date
    const now = new Date();
    //get day of today
    const day = now.getDate();

    let airforecast = []; // It will be an array of each airforecast HTML block

    if(airData){   
        console.log(airData);  
        for(let i = 0; i < 6; i++){
            let airforecastDaily = airData[i];
            console.log(airforecastDaily);
            o3 = airforecastDaily['o3']; //affect ozone
            pm10 = airforecastDaily['pm10'];
            pm25 = airforecastDaily['pm25'];
            uvi = airforecastDaily['uvi'];
            dominentpol = airforecastDaily['dominentpol'];

            //Extract the level from the index of each value
            //o3
            if(o3 < 65){
                o3Level = 'GOOD';
                o3imgURL = '/static/img/good.png';
            } else if(o3 >= 65 && o3 < 85){
                o3Level = 'MODERATE';
                o3imgURL = '/static/img/moderate.png';
            } else if(o3 >= 85 && o3 < 105){
                o3Level = 'UNHEALTHY FOR SENSITIVE GROUPS';
                o3imgURL = '/static/img/unhealthyfors.png';
            } else if(o3 >= 105 && o3 < 125){
                o3Level = 'UNHEALTHY';
                o3imgURL = '/static/img/unhealthy.png';
            } else if(o3 >= 125){
                o3Level = 'VERY UNHEALTHY';
                o3imgURL = '/static/img/veryunhealthy.png';
            }
            //pm10
            if(pm10 < 55){
                pm10Level = 'GOOD';
                pm10imgURL = '/static/img/good.png';
            } else if(pm10 >= 55 && pm10 < 155){
                pm10Level = 'MODERATE';
                pm10imgURL = '/static/img/moderate.png';
            } else if(pm10 >= 155 && pm10 < 255){
                pm10Level = 'UNHEALTHY FOR SENSITIVE GROUPS';
                pm10imgURL = '/static/img/unhealthyfors.png';
            } else if(pm10 >= 255 && pm10 < 355){
                pm10Level = 'UNHEALTHY';
                pm10imgURL = '/static/img/unhealthy.png';
            } else if(pm10 >= 355 && pm10 < 455){
                pm10Level = 'VERY UNHEALTHY';
                pm10imgURL = '/static/img/veryunhealthy.png';
            } else {
                pm10Level = 'HAZARDOUS';
                pm10imgURL = '/static/img/hazardous.png';
            }
            //pm25
            if(pm25 <= 12){
                pm25Level = 'GOOD';
                pm25imgURL = '/static/img/good.png';
            } else if(pm25 > 12 && pm25 < 35.5){
                pm25Level = 'MODERATE';
                pm25imgURL = '/static/img/moderate.png';
            } else if(pm25 >= 35.5 && pm25 < 55.5){
                pm25Level = 'UNHEALTHY FOR SENSITIVE GROUPS';
                pm25imgURL = '/static/img/unhealthyfors.png';
            } else if(pm25 >= 55.5 && pm25 < 150.5){
                pm25Level = 'UNHEALTHY';
                pm25imgURL = '/static/img/unhealthy.png';
            } else if(pm25 >= 150.5 && pm25 < 251){
                pm25Level = 'VERY UNHEALTHY';
                pm25imgURL = '/static/img/veryunhealthy.png';
            } else {
                pm25Level = 'HAZARDOUS';
                pm25imgURL = '/static/img/hazardous.png';
            }
            //uvi
            if(uvi <= 2){
                uvLevel = 'LOW';
                UVIimgURL = '/static/img/uvilow.png';
            } else if(uvi > 2 && uvi <= 5){
                uvLevel = 'MODERATE';
                UVIimgURL = '/static/img/uvimoderate.png';
            } else if(uvi > 5 && uvi <= 7){
                uvLevel = 'HIGH';
                UVIimgURL = '/static/img/uvihigh.png';
            } else if(uvi > 7 && uvi <= 10){
                uvLevel = 'VERY HIGH';
                UVIimgURL = '/static/img/uviveryhigh.png';
            } else if(uvi > 10){
                uvLevel = 'EXTREME';
                UVIimgURL = '/static/img/uviextreme.png';
            }

            if(i === 0){
                date = 'TODAY';
                        
            } else {
                date = day + i;
            }
                    
            airforecast.push(<ProfileEachforecast key={i} date={date} UVIimgURL={UVIimgURL} uvLevel={uvLevel} uvi={uvi}
                            o3imgURL={o3imgURL} o3={o3} o3Level={o3Level}
                            pm25imgURL={pm25imgURL} pm25={pm25} pm25Level={pm25Level}
                            pm10imgURL={pm10imgURL} pm10={pm10} pm10Level={pm10Level} dominentpol={dominentpol}/>);
            }
    } else{
        for(let i = 0; i < 6; i++){
            if(i === 0){
                date = 'TODAY';
                        
            } else {
                date = day + i;
            }
        
            airforecast.push(<ProfileEachforecast key={i} date={date} UVIimgURL={UVIimgURL} uvLevel={uvLevel} uvi={uvi}
                    o3imgURL={o3imgURL} o3={o3} o3Level={o3Level}
                    pm25imgURL={pm25imgURL} pm25={pm25} pm25Level={pm25Level}
                    pm10imgURL={pm10imgURL} pm10={pm10} pm10Level={pm10Level} dominentpol={dominentpol}/>);
        }
    }
    
    

    return(
        <div className="air-forecast-section">
            <div className="user-air-forecast-container">
                <div className="air-forecast-h">
                    <h3>AIR QUALITY FORECAST AROUND YOUR LOCATION</h3>
                </div>
                <div>
                    {airforecast}
                </div>
            </div>
        </div>
    );
}

function Profile(props){
    const [alertOn, setAlertOn] = React.useState(false);
    const [airData, setAirData] = React.useState();
    const [uvi, setUVI] = React.useState(0);
    const [aqi, setAQI] = React.useState(0);
    console.log(alertRequest);
    const currentUser = props.user;

    
    //if there's user, get request to server to get user profile data from DB
    React.useEffect(() => {
        $.get('/profile.json', {'current-user': currentUser}, (res)=>{
            
            console.log(res);
            setAirData(res);

            let newUvi = res[1]['uvi'];
            let newAqi = res[1]['aqi'];
            //set uvi, aqi
            setUVI(newUvi);
            setAQI(newAqi);
        
        });
    },[aqi, uvi]);

    //toggle switch event handler
    const alertRequest = (checked) =>{
        setAlertOn(checked);
        
        if(checked){
            $.post('/alertrequest', (res)=>{
                console.log(res);
            });
        } else {
            $.post('/alertcancel', (res) =>{
                console.log(res);
            });
        }
    };

    return (
        <div className="profile-container">
            <div className="user-info-section">
                <div className="user-info-container">
                    <h3 className="profile-heading">Profile</h3>
                    <p className="profile-welcoming">WELCOME! {currentUser}</p>
                    <label className="air-qual-alert-label">Air Quality Alert</label>
                    <ToggleSwitch checked={alertOn} onChange={alertRequest}/>
                </div>
            </div>
            <div className="middle-section">
                <ProfileUVIWidget uvi={uvi}/>
                <ProfileAQIWidget aqi={aqi} />
            </div>
            <div className="user-airforecast-section">
                <ProfileAirQualForecast airData={airData}/>
            </div>
        </div>
    );
}


function Logout(props){
    //update state of isLoggedIn if isLoggedIn is true
    if(props.isLoggedIn){
        $.post('/logout', (res)=>{
            props.setIsLoggedIn(false);
            //if logged out, show a pop-up message
            Toastify({
                text: `${res['message']}`,
                duration: 3000,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "left", // `left`, `center` or `right`
                backgroundColor: "linear-gradient(to right, #39E5B6, #70B2D9)",
                stopOnFocus: true, // Prevents dismissing of toast on hover
                onClick: function(){} // Callback after click
            }).showToast();
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
        //update city value
        props.setCity(searchInput);
        
        //alert('onSubmit event handler is working');
        console.log(isError, searchFor, searchBy, searchInput);
        //updating state of props.dataType(set to searchFor)
        props.setDataType(searchFor);

    
        //get ruquest to /search in the server
        $.get('/search', formInputs, (response)=>{
             //if search-for =='air-quality'
            if ( formInputs['cur-search-for'] === 'air-quality'){
                //store the response data into 'airData' variable
                airData = response
                console.log(airData);

                //updating state of props.markerData
                props.setMarkerData(airData);
                
            //if search-for == 'fire
            } else if(formInputs['cur-search-for'] === 'fire'){
                //store the response data into 'firData' variable
                fireData = response
                console.log(fireData);
                
                //it's undefined on console when there's no active fire
                const fires = fireData['data'];
                console.log(fires)

                //updating state of props.markerData
                props.setMarkerData(fireData);  
                
            //if search-for == 'soil
            } else if(formInputs['cur-search-for'] === 'soil'){
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
                    <label className="search-bar-label">What are you looking for?</label>
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
                    <input type="submit" value="search" id="search-btn"></input>
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
        
        const flagMarker = {
            url: '/static/img/flag-icon.png',
            scaledSize: new window.google.maps.Size(50, 50),
            origin: new window.google.maps.Point(0,0),
            anchor: new window.google.maps.Point(40,40)
        };

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

                //Set option to change the map location along with the marker location
                
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
                        </ul>
                    </div>
                `);

               

                const airMarker = new window.google.maps.Marker({
                    position: {lat: latitude, lng: longitude},
                    title:'Air Quality Info',
                    map: map,
                    icon: flagMarker});
                    
                airMarker.addListener('click', ()=>{
                    airInfo.close();
                    airInfo.setContent(airInfoContent);
                    airInfo.open(map, airMarker);
                });
                //relocate the map center
                map.setCenter({lat:latitude, lng:longitude});

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
                        map: map,
                        icon: flagMarker});
                    
                    fireMarker.addListener('click', ()=>{
                        fireInfo.close();
                        fireInfo.setContent(fireInfoContent);
                        fireInfo.open(map, fireMarker);
                    });
                    //relocate the map center
                    map.setCenter({lat:latitude, lng:longitude});
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
                            <li><b>Soil Temperature: </b>${soilTemperature}</li>
                            </ul>
                        </div>
                        `);
                    
                    const soilMarker = new window.google.maps.Marker({
                        position: {lat: latitude, lng: longitude},
                        title:'Soil Condition',
                        map: map,
                        icon: flagMarker});
                    
                    soilMarker.addListener('click', ()=>{
                        soilInfo.close();
                        soilInfo.setContent(soilInfoContent);
                        soilInfo.open(map, soilMarker);
                    });
                    //relocate the map center
                    map.setCenter({lat:latitude, lng:longitude});
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


//--------- Homepage current UVI widget ---------//

function UVIWidget(props){
    const uviData = props.markerData;
    console.log(uviData);

    let uvi = '--'; // defualt value when the user hasn't searched anything yet
    let uvLevel = '--'; // defualt value when the user hasn't searched anything yet
    let explainUVI = '';
    let uvimg = '/static/img/uvinone.png';

    if(uviData){
        try{
            const forecastInfo = uviData['airforecast']['forecast'];
            if(forecastInfo['daily']){
                const uviInfo = forecastInfo['daily']['uvi']; //an array of uvi forecast
                uvi = uviInfo[0]['avg']; //pull out today's uvi level
                //find out uv level based on the uvi
                if(uvi <= 2){
                    uvLevel = 'LOW';
                    uvimg = '/static/img/uvilow.png';
                    explainUVI = `Wear sunglasses on bright days. 
                            If you burn easily, cover up and use broad spectrum SPF 30+ sunscreen.
                            Bright surfaces, sand, water, and snow will increase UV exposure.`;
                } else if(uvi > 2 && uvi <= 5){
                    uvLevel = 'MODERATE';
                    uvimg = '/static/img/uvimoderate.png';
                    explainUVI = `Stay in shade near midday when the SUN is strongest.
                                If outdoors, wear sun-protective clothing, a wide-brimmed hat, and UV-blocking sunglasses
                                Generously apply broad spectrum SPF 30+ sunscreen every 1.5 hours, even on cloudy days.
                                Bright surfaces, sand, water, and snow will increase UV exposure.`;
                } else if(uvi > 5 && uvi <= 7){
                    uvLevel = 'HIGH';
                    uvimg = '/static/img/uvihigh.png';
                    explainUVI = `Reduce time in the sun between 10AM and 4PM. If outdoors, seek shade and wear sun-protective clothing,
                                a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 30+ sunscreen
                                every 1.5 hours, even on cloudy days. Bright surfaces, sand, water, and snow will increase UV exposure.`;
                } else if(uvi > 7 && uvi <= 10){
                    uvLevel = 'VERY HIGH';
                    uvimg = '/static/img/uviveryhigh.png';
                    explainUVI = `Minimize sun exposure between 10AM. and 4PM. If outdoors, seek shade and wear sun-protective clothing, 
                                a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 30+ sunscreen every 1.5 hours, 
                                even on cloudy days. Bright surfaces, such as sand, water, and snow, will increase UV exposure.`;
                } else if(uvi > 10){
                    uvLevel = 'EXTREME';
                    uvimg = '/static/img/uviextreme.png';
                    explainUVI = `Try to avoid sun exposure between 10 a.m. and 4 p.m. If outdoors, seek shade and wear sun-protective clothing, 
                                a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 30+ sunscreen every 1.5 hours, 
                                even on cloudy days. Bright surfaces, such as sand, water, and snow, will increase UV exposure.`;
                }
            }

        } catch (e){
            console.log(e);
        }
        
    }


    return(
        <div className="uvi-container col">
            <div className="small-widgets">
            <label>UV INDEX</label>
            </div>
            <div>
                <label className="level-label">CURRENT UV LEVEL</label>
                <p className="uvi-level">{uvLevel}</p>
            </div>
            <div>
                <img className="uv-img" src={uvimg} alt="UVI IMG"></img>
            </div>
            <div>
                <label>CURRENT UVI</label>
                <p className="index">{uvi}</p>
            </div>
            <p>{explainUVI}</p>
        </div>
    );
}


function AQIWidget(props){
    const aqiData = props.markerData;
    console.log(aqiData);

    let aqiImg = '/static/img/aqinone.png';
    let aqiLevel = '';
    let aqi = '--';
    let explainAQI = '--';

    if(aqiData){
        try{
            aqi = aqiData['airforecast']['aqi'];

            if(aqi <= 50){
                aqiImg = '/static/img/aqigood.png';
                aqiLevel = 'GOOD';
                explainAQI = 'Air pollution poses little or no risk.';
            } else if(aqi > 50 && aqi <= 100){
                aqiImg = '/static/img/aqimoderate.png';
                aqiLevel = 'MODERATE';
                explainAQI = 'Health concern for people who are unusually sensitive to air pollution';
            } else if(aqi > 100 && aqi <= 150){
                aqiImg = '/static/img/aqiunhealthyfors.png';
                aqiLevel = 'UNHEALTHY FOR SENSITIVE GROUPS';
                explainAQI = 'Sensitve groups, young children and the elderly, may experience health effects';
            } else if(aqi > 150 && aqi <= 200){
                aqiImg = '/static/img/aqiunhealthy.png';
                aqiLevel = 'UNHEALTHY';
                explainAQI = 'Everyone may experience health effects; sensitive groups may experience more serious health effects.';
            } else if(aqi > 200 && aqi <= 300){
                aqiImg = '/static/img/aqiveryunhealthy.png';
                aqiLevel = 'VERY UNHEALTHY';
                explainAQI = 'Health alert: everyone may experience more serious health effects.';
            } else {
                aqiImg = '/static/img/aqihazardous.png';
                aqiLevel = 'HAZARDOUS';
                explainAQI = 'Health warnings of emergency conditions. The entire population is more likely to be affected.';
            } 
        } catch(e){
            console.log(e);
        }
        
    }

    return(
        <div className='aqi-container col'>
            <div className="small-widgets">
                <label>AIR QUALITY INDEX</label>
            </div>
            <div>
                <img className="aqi-img" src={aqiImg} alt="AQI IMG"></img>
                <h3 className="aqi-today">TODAY</h3>
                <p className="aqi-level">{aqiLevel}</p>
            </div>
            <div>
                <p>AQI: <span className="index">{aqi}</span></p>
            </div>
            <div>
                <p>{explainAQI}</p>
            </div>
        </div>
    );
}


function Eachforecast(props){
    return (
        <div className="air-forecast-daily">
            <div className="date-container">
                <h3 className="air-forecast-date">{props.date}</h3>
            </div>
            <div>
                <div className="air-forecast-label">
                    <label className="air-type">OZONE: {props.o3}</label>
                </div>
                <div className="air-level">
                    <img src={props.o3imgURL} className="air-forecast-img"></img>
                    <p>{props.o3Level}</p>
                </div>
            </div>
            <div>
                <div className="air-forecast-label">
                    <label className="air-type">PM2.5: {props.pm25} </label>
                </div>
                <div className="air-level">
                    <img src={props.pm25imgURL} className="air-forecast-img"></img>
                    <p>{props.pm25Level}</p>
                </div>
            </div>
            <div>
                <div className="air-forecast-label">
                    <label className="air-type">PM10: {props.pm10}</label>
                </div>
                <div className="air-level">
                    <img src={props.pm10imgURL} className="air-forecast-img"></img>
                    <p>{props.pm10Level}</p>
                </div>       
            </div>
            <div>
                <div className="air-forecast-label">
                    <label className="air-type">UVI : {props.uvi}</label>
                </div>
                <div className="air-level">
                    <img src={props.UVIimgURL} className="air-forecast-img"></img>
                    <p>{props.uvLevel}</p>   
                </div>  
            </div>
        </div>
    );
}


function AirQualityForecast(props){
    const airData = props.markerData;
    
    let o3 = '-';
    let pm10 = '-';
    let pm25 = '-';
    let uvi = '-';
    let city = '';
    let o3imgURL = '/static/img/none.png';
    let pm25imgURL = '/static/img/none.png';
    let pm10imgURL = '/static/img/none.png';
    let UVIimgURL = '/static/img/uvinone.png';
    let o3Level = '';
    let pm25Level = '';
    let pm10Level = '';
    let uvLevel = '';
    let date;

    //Get today's date
    const now = new Date();
    //get day of today
    const day = now.getDate();

    let airforecast = []; // It will be an array of objects

    if(airData){
        try{
            let airforecastDaily;
            const airForecastData = airData['airforecast'];

            //Extract only the city name
            city = "IN " + props.city.toUpperCase();

            // Extract daily air forecasts
            if(airForecastData['forecast']['daily']){
                airforecastDaily = airForecastData['forecast']['daily'];
                let lastUviIndex = airforecastDaily['uvi'].length - 1;
                let lastO3Index = airforecastDaily['o3'].length - 1;
                let lastpm10Index = airforecastDaily['pm10'].length - 1;
                let lastpm25Index = airforecastDaily['pm25'].length - 1;
                
                for(let i = 0; i < 6; i++){
                    //extract the value of pm25 
                    if(i > lastpm25Index){
                        pm25 = airforecastDaily['pm25'][lastpm25Index]['avg'];
                    }else {
                        pm25 = airforecastDaily['pm25'][i]['avg'];
                    }
                    //extract the value of pm10
                    if(i > lastpm10Index){
                        pm10 = airforecastDaily['pm10'][lastpm10Index]['avg'];
                    }else {
                        pm10 = airforecastDaily['pm10'][i]['avg'];
                    }
                    //extract the value of o3
                    if(i > lastO3Index){
                        o3 = airforecastDaily['o3'][lastO3Index]['avg'];
                    }else {
                        o3 = airforecastDaily['o3'][i]['avg']; //affect ozone
                    }
                    //extract the value of uvi
                    if(i > lastUviIndex){
                        uvi = airforecastDaily['uvi'][lastUviIndex]['avg'];
                    } else {
                        uvi = airforecastDaily['uvi'][i]['avg'];
                    }

                    //Extract the level from the index of each value
                    //o3
                    if(o3 < 65){
                        o3Level = 'GOOD';
                        o3imgURL = '/static/img/good.png';
                    } else if(o3 >= 65 && o3 < 85){
                        o3Level = 'MODERATE';
                        o3imgURL = '/static/img/moderate.png';
                    } else if(o3 >= 85 && o3 < 105){
                        o3Level = 'UNHEALTHY FOR SENSITIVE GROUPS';
                        o3imgURL = '/static/img/unhealthyfors.png';
                    } else if(o3 >= 105 && o3 < 125){
                        o3Level = 'UNHEALTHY';
                        o3imgURL = '/static/img/unhealthy.png';
                    } else if(o3 >= 125){
                        o3Level = 'VERY UNHEALTHY';
                        o3imgURL = '/static/img/veryunhealthy.png';
                    }
                    //pm10
                    if(pm10 < 55){
                        pm10Level = 'GOOD';
                        pm10imgURL = '/static/img/good.png';
                    } else if(pm10 >= 55 && pm10 < 155){
                        pm10Level = 'MODERATE';
                        pm10imgURL = '/static/img/moderate.png';
                    } else if(pm10 >= 155 && pm10 < 255){
                        pm10Level = 'UNHEALTHY FOR SENSITIVE GROUPS';
                        pm10imgURL = '/static/img/unhealthyfors.png';
                    } else if(pm10 >= 255 && pm10 < 355){
                        pm10Level = 'UNHEALTHY';
                        pm10imgURL = '/static/img/unhealthy.png';
                    } else if(pm10 >= 355 && pm10 < 455){
                        pm10Level = 'VERY UNHEALTHY';
                        pm10imgURL = '/static/img/veryunhealthy.png';
                    } else {
                        pm10Level = 'HAZARDOUS';
                        pm10imgURL = '/static/img/hazardous.png';
                    }
                    //pm25
                    if(pm25 <= 12){
                        pm25Level = 'GOOD';
                        pm25imgURL = '/static/img/good.png';
                    } else if(pm25 > 12 && pm25 < 35.5){
                        pm25Level = 'MODERATE';
                        pm25imgURL = '/static/img/moderate.png';
                    } else if(pm25 >= 35.5 && pm25 < 55.5){
                        pm25Level = 'UNHEALTHY FOR SENSITIVE GROUPS';
                        pm25imgURL = '/static/img/unhealthyfors.png';
                    } else if(pm25 >= 55.5 && pm25 < 150.5){
                        pm25Level = 'UNHEALTHY';
                        pm25imgURL = '/static/img/unhealthy.png';
                    } else if(pm25 >= 150.5 && pm25 < 251){
                        pm25Level = 'VERY UNHEALTHY';
                        pm25imgURL = '/static/img/veryunhealthy.png';
                    } else {
                        pm25Level = 'HAZARDOUS';
                        pm25imgURL = '/static/img/hazardous.png';
                    }
                    //uvi
                    if(uvi <= 2){
                        uvLevel = 'LOW';
                        UVIimgURL = '/static/img/uvilow.png';
                    } else if(uvi > 2 && uvi <= 5){
                        uvLevel = 'MODERATE';
                        UVIimgURL = '/static/img/uvimoderate.png';
                    } else if(uvi > 5 && uvi <= 7){
                        uvLevel = 'HIGH';
                        UVIimgURL = '/static/img/uvihigh.png';
                    } else if(uvi > 7 && uvi <= 10){
                        uvLevel = 'VERY HIGH';
                        UVIimgURL = '/static/img/uviveryhigh.png';
                    } else if(uvi > 10){
                        uvLevel = 'EXTREME';
                        UVIimgURL = '/static/img/uviextreme.png';
                    }

                    if(i === 0){
                        date = 'TODAY';
                        
                    } else {
                        date = day + i;
                    }
                    
                    airforecast.push(<Eachforecast key={i} date={date} UVIimgURL={UVIimgURL} uvLevel={uvLevel} uvi={uvi}
                                    o3imgURL={o3imgURL} o3={o3} o3Level={o3Level}
                                    pm25imgURL={pm25imgURL} pm25={pm25} pm25Level={pm25Level}
                                    pm10imgURL={pm10imgURL} pm10={pm10} pm10Level={pm10Level}/>);
                }
            } else{
                for(let i = 0; i < 6; i++){
                    if(i === 0){
                        date = 'TODAY';
                        
                    } else {
                        date = day + i;
                    }
        
                    airforecast.push(<Eachforecast key={i} date={date} UVIimgURL={UVIimgURL} uvLevel={uvLevel} uvi={uvi}
                        o3imgURL={o3imgURL} o3={o3} o3Level={o3Level}
                        pm25imgURL={pm25imgURL} pm25={pm25} pm25Level={pm25Level}
                        pm10imgURL={pm10imgURL} pm10={pm10} pm10Level={pm10Level}/>);
                }
            }
            
        }catch(e){
            console.log(e);
        }
        
    } else {

        for(let i = 0; i < 6; i++){
            if(i === 0){
                date = 'TODAY';
                
            } else {
                date = day + i;
            }

            airforecast.push(<Eachforecast key={i} date={date} UVIimgURL={UVIimgURL} uvLevel={uvLevel} uvi={uvi}
                o3imgURL={o3imgURL} o3={o3} o3Level={o3Level}
                pm25imgURL={pm25imgURL} pm25={pm25} pm25Level={pm25Level}
                pm10imgURL={pm10imgURL} pm10={pm10} pm10Level={pm10Level}/>);
        }
    }

    return(
        <div className="air-forecast-section">
            <div className="air-forecast-container">
                <div className="air-forecast-h">
                    <h3>AIR QUALITY FORECAST {city}</h3>
                </div>
                <div>
                    {airforecast}
                </div>
            </div>
        </div>
    );
}

function WorldAQIWidget(){

    function displayCity(aqi){
        $('#global-aqi-container').append(aqi.details);
    }
    
    React.useEffect(() =>{
        let cities = ['london', 'seoul', 'beijing', 'paris'];
        let aqiWidgetconfig = [];
        cities.forEach( (city) => {aqiWidgetconfig.push({city: city, callback: displayCity}); });
        _aqiFeed(aqiWidgetconfig);
    }, []);

    return(
        <div className="global-aqi">
            <div  id="mutiple-city-aqi">
                <div className="global-aqi-heading">
                    <h3>REAL TIME AQI AROUND THE GLOBE</h3>
                </div>
                <div id="global-aqi-container">
                </div>
            </div> 
        </div> 
    );
}
ReactDOM.render(<App />, document.querySelector('#app'))