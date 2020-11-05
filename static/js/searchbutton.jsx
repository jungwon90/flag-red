function ActiveFireSearchBar() {
    return (
        <div class = "row align-items-center active-fire-btn-container">
            <div class="col-10 mx-auto">
                <form action="/search" method="GET" id="search-form">
                    <label>Active Fires</label>
                    <select id="search-by" name="search-by">
                        <option value="by-city">By City</option>
                        <option value="by-postal-code">By Zipcode</option>
                    </select>
                    <input type="text" name="search-input"></input>
                    <input type="submit" value="search"></input>
                </form>
            </div>
        </div>
    );
}

function PastFireSearchBar(){
    return (
        <div class = "row align-items-center past-fire-btn-container">
            <div class="col-10 mx-auto">
                <form action="/search-history" method="GET" id="search-history-form">
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



$('.search-type-button').on('click', (event)=>{
    const button = $(event.target);
    const buttonId = button.attr('id');

    if(buttonId == "active-fire-button"){
        const pastFireButton = $('.past-fire-btn-container')
        if (pastFireButton){
            $('.past-fire-btn-container').remove();
        }

        ReactDOM.render(<ActiveFireSearchBar />, document.querySelector('#active-fire-search'))
    } else {
        const activeFireButton = $('.active-fire-btn-container')
        if (activeFireButton){
            $('.active-fire-btn-container').remove();
        }

        ReactDOM.render(<PastFireSearchBar />, document.querySelector('#past-fire-search'))
    }
    
});

