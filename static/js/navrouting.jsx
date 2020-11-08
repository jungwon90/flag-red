console.log('Hi');
console.log(ReactRouterDOM);
const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Switch = ReactRouterDOM.Switch;
const Link = ReactRouterDOM.Link;
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
                    </ul>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
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
                                <Link to="logout">Log out</Link>
                            </li>
                        </ul>
                    </div>
                </nav>  
            
                {/* <Switch> looks through its children <Route>s and renders 
                the first one that matches the current URL */}
                <Switch>
                    <Route path="/signup"><Signup /></Route>
                    <Route path="/login"><Login /></Route>
                    <Route path="/"><Home /></Route>
                    <Route path="/about"><About /></Route>
                    <Route path="/contact"><Contact /></Route>
                    <Route path="/profile"><Profile /></Route>
                    <Route path="/logout"><Logout /></Route>
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
                
            <div id="search"></div>
                
            <h3>Map</h3>
            
            
        </React.Fragment>
    );
}

function About(){
    return (
        <div></div>
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
        <div></div>
    );
}


ReactDOM.render(<App />, document.querySelector('#app'))