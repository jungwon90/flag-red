from flask import Flask, render_template, jsonify, request, redirect

import os
import secrets
import requests
import json

app = Flask(__name__)
#need a secret key if i wanna use flask and session 
app.secret_key = 'SECRETSECRET'

# This configuration option makes the Flask interactive debugger
# more useful (you should remove this line in production though)
app.config['PRESERVE_CONTEXT_ON_EXCEPTION'] = True

#os.environ
API_KEY = os.environ['FIRE_KEY']

@app.route('/')
def homepage():

    return render_template('homepage.html')


@app.route('/search', methods=['GET'])
def find_active_fires():
    """ Search for active fires """

    #Use form data from the user to populate any search parameters
    search_by = request.args.get('search-by')
    search_input = request.args.get('search-input')
    print(search_by, search_input)

    url = f'https://api.ambeedata.com/latest/{search_by}/'
    
    if search_by == 'by-postal-code':
        querystring = {'postalCode': search_input, 'countryCode': "IN"}
    else :
        querystring = {'city': search_input}

    headers = {
        'x-api-key': API_KEY,
        'Content-type': "application/json"
    }
    # Make a request to the fire/Air Search endpoint to search for events
    res = requests.get(url, headers=headers, params=querystring)

    # save the JSON data from the response to the `data`
    # variable so that it can display on the page. This is useful for
    # debugging purposes!
    airquality_data = res.json() # convert json to python dictionary
    print(airquality_data)

    #url_for_fire = 
        
    return redirect('/')

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')