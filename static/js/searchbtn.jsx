

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



function ShowCurSearchBar(){
    return (
        <div className = "row align-items-center active-fire-btn-container">
            <div className="col-10 mx-auto">
                <form action="/search" method="GET" id="search-form">
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


function ShowHistorySearchBar(){
    return (
        <div className = "row align-items-center past-fire-btn-container">
            <div className="col-10 mx-auto">
                <form action="/historysearch" method="GET" id="search-history-form">
                    <select id="search-for" name="history-search-for">
                        <option value="air-quality">Air Quality</option>
                        <option value="soil">Soil</option>
                    </select>
                    <select id="history-search-by" name="history-search-by">
                        <option value="by-city">By City</option>
                        <option value="by-postal-code">By Zipcode</option>
                    </select>
                    <input type="date" name="search-date-from"></input>
                    <input type="date" name="search-date-to"></input>
                    <input type="text" name="history-search-input"></input>
                    <input type="submit" value="search"></input>
                </form>
            </div>
        </div>
    );
}


function ShowSearchBar(props){
    const curBtnClicked = props.curBtnClicked;

    if(curBtnClicked) {
        return <ShowCurSearchBar />;
    }
    return <ShowHistorySearchBar />; 
}   


function CurrentBtn(props){
    return (
        <button className="search-current-button" onClick={props.onClick}>Current</button>
    );
}


function HistoryBtn(props){
    return(
        <button className="search-history-button" onClick={props.onClick}>History</button> 
    );
}   



class SearchBtnControl extends React.Component {
    constructor(props) {
        super(props);
        this.handleCurBtnClick = this.handleCurBtnClick.bind(this);
        this.handleHistoryBtnClick = this.handleHistoryBtnClick.bind(this);
        this.state = { curBtnClicked : false};
    }

    handleCurBtnClick(){
        this.setState({curBtnClicked : true});
    }

    handleHistoryBtnClick(){
        this.setState({curBtnClicked: false});
    }

    render() {
        const curBtnClicked = this.state.curBtnClicked;
        let curAirBtn, airHisBtn;
        curAirBtn = <CurrentBtn onClick={this.handleCurBtnClick} />;
        airHisBtn = <HistoryBtn onClick={this.handleHistoryBtnClick} />;
        
        return (
            <div>
                {curAirBtn} {airHisBtn}
                <ShowSearchBar curBtnClicked={curBtnClicked}/> 
            </div>
        );
    }
}

ReactDOM.render(
    <SearchBtnControl />,
    document.querySelector('#search')
);
