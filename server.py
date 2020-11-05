from flask import Flask, render_template, jsonify, request, redirect, flash

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

# coordinates for markers on MAP
coordinates = {}

@app.route('/')
def homepage():

    return render_template('homepage.html')


@app.route('/search', methods=['GET'])
def find_cur_airqual_and_fire():
    """ Search for active fires """

    #Use form data from the user to populate any search parameters
    search_by = request.args.get('search-by')
    search_input = request.args.get('search-input')

    print(search_by, search_input)

    air_url = f'https://api.ambeedata.com/latest/{search_by}/'
    
    if search_by == 'by-postal-code':
        querystring = {'postalCode': search_input, 'countryCode': "US"}
    else :
        querystring = {'city': search_input}

    headers = {
        'x-api-key': API_KEY,
        'Content-type': "application/json"
    }
    # Make a request to the fire/Air Search endpoint to search for events
    air_res = requests.get(air_url, headers=headers, params=querystring)

    # convert json to python dictionary
    airquality_data = air_res.json() 
    
    # get the very first(recent) data/result
    airqual_dictionary = airquality_data['stations'][0]
    
    print(airqual_dictionary['lat'], airqual_dictionary['lng'])

    # get the coordinate of the city/zipcode for requesting fire data
    latitude = airqual_dictionary['lat']
    longitude = airqual_dictionary['lng']

    fire_url = "https://api.ambeedata.com/latest/fire"

    fire_querystring = {"lat": str(latitude), "lng": str(longitude)}
    #fire_querystring = {"lat": "36.778259", "lng": "-119.417931"}

    fire_res = requests.get(fire_url, headers=headers, params=fire_querystring)
  
    fire_data = fire_res.json()
    print(fire_data)

    if len(fire_data['data']) == 0:
        flash(f'No active fire around {search_input}')


        
    return redirect('/')

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')