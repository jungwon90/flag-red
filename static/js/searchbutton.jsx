"use strict";

/*
function ShowActiveFireBtn(){
    function handleClick(){
        const activeFire = (
            <div className = "row align-items-center active-fire-btn-container">
                <div className="col-10 mx-auto">
                    <form id="search-form">
                        <label>Active Fires</label>
                        <select id="search-by" name="search-by">
                            <option value="by-city">By City</option>
                            <option value="by-postal-code">By Zipcode</option>
                        </select>
                        <input type="text" name="search-input" id="search-input"></input>
                        <input type="submit" value="search"></input>
                    </form>
                </div>
            </div>
        );
        
        ReactDOM.render(activeFire, document.querySelector('#active-fire-search'));
        
    }
    
    return (
        <div>
            <button className="search-type-button" onClick={handleClick}>Active Fire</button>
        </div>
    );
}

function ShowPastFireBtn(){
    function handleClick(){
        const pastFire = (
            <div className = "row align-items-center past-fire-btn-container">
                <div className="col-10 mx-auto">
                    <form id="search-history-form">
                        <label>Past Fires</label>
                        <select id="history-search-by" name="history-search-by">
                            <option value="by-city">By City</option>
                            <option value="by-postal-code">By Zipcode</option>
                        </select>
                        <input type="date" name="search-date-from"></input>
                        <input type="date" name="search-date-to"></input>
                        <input type="text" name="search-input"></input>
                        <input type="submit" value="search"></input>
                    </form>
                </div>
            </div>
        );

        ReactDOM.render(pastFire, document.querySelector('#past-fire-search'));
    }

    return (
        <div>
            <button className="search-type-button" onClick={handleClick}>Past Fires</button> 
        </div>
    );
}

ReactDOM.render(
<ShowActiveFireBtn />, document.querySelector('#active-fire-btn')
);


ReactDOM.render(
<ShowPastFireBtn />, document.querySelector('#past-fire-btn')
);

*/



function ShowActiveFireSearchBar(){
    return (
        <div className = "row align-items-center active-fire-btn-container">
            <div className="col-10 mx-auto">
                <form id="search-form">
                    <label>Active Fires</label>
                    <select id="search-by" name="search-by">
                        <option value="by-city">By City</option>
                        <option value="by-postal-code">By Zipcode</option>
                    </select>
                    <input type="text" name="search-input" id="search-input"></input>
                    <input type="submit" value="search"></input>
                </form>
            </div>
        </div>
    );
}


function ShowPastFireSearchBar(){
    return (
        <div className = "row align-items-center past-fire-btn-container">
            <div className="col-10 mx-auto">
                <form id="search-history-form">
                    <label>Past Fires</label>
                    <select id="history-search-by" name="history-search-by">
                        <option value="by-city">By City</option>
                        <option value="by-postal-code">By Zipcode</option>
                    </select>
                    <input type="date" name="search-date-from"></input>
                    <input type="date" name="search-date-to"></input>
                    <input type="text" name="search-input"></input>
                    <input type="submit" value="search"></input>
                </form>
            </div>
        </div>
    );
}


function ShowSearchBar(props){
    const activeFireBtnClicked = props.activeFireBtnClicked;

    if(activeFireBtnClicked) {
        return <ShowActiveFireSearchBar />;
    }
    return <ShowPastFireSearchBar />; 
}   


function ActiveFireBtn(props){
    return (
        <button className="search-type-button" onClick={props.onClick}>Active Fire</button>
    );
}


function PastFireBtn(props){
    return(
        <button className="search-type-button" onClick={props.onClick}>Past Fires</button> 
    );
}   



class SearchBtnControl extends React.Component {
    constructor(props) {
        super(props);
        this.handleActiveFireBtnClick = this.handleActiveFireBtnClick.bind(this);
        this.handlePastFireBtnClick = this.handlePastFireBtnClick.bind(this);
        this.state = { activeFireBtnClicked : false};
    }

    handleActiveFireBtnClick(){
        this.setState({activeFireBtnClicked: true});
    }

    handlePastFireBtnClick(){
        this.setState({activeFireBtnClicked: false});
    }

    render() {
        const activeFireBtnClicked = this.state.activeFireBtnClicked
        let button1, button2;
        button1 = <ActiveFireBtn onClick={this.handleActiveFireBtnClick} />;
        button2 = <PastFireBtn onClick={this.handlePastFireBtnClick} />;
        
        return (
            <div>
                {button1} {button2}
                <ShowSearchBar activeFireBtnClicked={activeFireBtnClicked}/> 
            </div>
        );
    }
}

ReactDOM.render(
    <SearchBtnControl />,
    document.querySelector('#search-fire-btn')
);

