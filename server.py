from flask import Flask, render_template, jsonify, request, redirect, flash
from model import db, connect_to_db, User, Twilio, UserProfileAirForecast, AirForecast
import os
import sys
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
API_KEY = os.environ['AMBEE_KEY']
API_KEY2 = os.environ['WAQI_KEY']


@app.route('/')
def homepage():
    """ Show homepage """

    return render_template('homepage.html')



@app.route('/search')
def search_result():
    """ Search for Air Quality/Active Fire/Pollen """

    latitude = 0
    longitude = 0

    # API request headers applied to all kinds of request
    headers = {
        'x-api-key': API_KEY,
        'Content-type': "application/json"
    }

    # Get user inputs from the form
    search_for = request.args.get('cur-search-for')
    search_by = request.args.get('cur-search-by')
    search_input = request.args.get('cur-search-input') 
    print(search_for, search_by, search_input)
    
    try:
        # Request air quality data from API -> Store in a variable called "air_quality"
        air_url = f'https://api.ambeedata.com/latest/{search_by}'

        if search_by == 'by-postal-code':
            air_querystring = {'postalCode': search_input, 'countryCode': "US"}
        else :
            air_querystring = {'city': search_input}

        air_qual_res = requests.get(air_url, headers=headers, params=air_querystring)
        air_quality = air_qual_res.json() # convert json to python dictionary
        print(air_quality)

        # Extract 1.latitude 2.longitue from the air_quality(current air quality data)
        airqual_dictionary = air_quality['stations'][0] #get the very first(recent) data/result
        latitude = airqual_dictionary['lat']
        longitude = airqual_dictionary['lng']
        print(latitude, longitude)

        # Request air forcast data from API => store in a variable called "air_forcast"
        air_forecast_url = f"https://api.waqi.info/feed/geo:{latitude};{longitude}/?token={API_KEY2}"
        air_forecast_res = requests.get(air_forecast_url)
        air_forecast = air_forecast_res.json()
        print('Air Forecast')
        print(air_forecast)


        # if (search_for == "air-quality"), return jsonify(air_quality)
        if search_for == "air-quality":
            # Append air_forcast to air_quality 
            air_quality['airforecast'] = air_forecast['data']
            return jsonify(air_quality)
            print('return air_quality')

        # else if (search_for == "fire")
        elif search_for == "fire":
            # Get fire data from the API using latitude, longitude that got extracted above and return it
            fire_url = "https://api.ambeedata.com/latest/fire"
            fire_querystring = {"lat": str(latitude), "lng": str(longitude)}

            fire_res = requests.get(fire_url, headers=headers, params=fire_querystring)
            fire_data = fire_res.json() # convert json to python dictionary
            print(fire_data)
            
            if len(fire_data['data']) == 0:
                #if there's no active fire, return a string 'No Active Fire around search location"
                # Append air_forcast to no_fire
                no_fire = {"message": f'No Active Fire around {search_input}'}
                no_fire['airforecast'] = air_forecast['data']
                
                return jsonify(no_fire)
                print('no fire')
            else:
                # Append air_forcast to fire_data
                fire_data['airforecast'] = air_forecast['data']
                
                return jsonify(fire_data)
                print('return fire')
            

        # else if (search_for == "pollen")
        elif search_for == "soil":
            # Get pollen data from the API using latitude, longitude that got extracted above and return it
            soil_url = "https://api.ambeedata.com/soil/latest/by-lat-lng"
            soil_querystring = {"lat": str(latitude), "lng": str(longitude)}

            soil_res = requests.get(soil_url, headers=headers, params=soil_querystring)
            soil_data = soil_res.json() # convert json to python dictionary
            # Append air_forcast to soil_data
            soil_data['airforecast'] = air_forecast['data']

            return jsonify(soil_data)
            print('return soil')

    except:
        e = sys.exc_info()[0]
        print("Error: %s" % e )
  








if __name__ == "__main__":
    connect_to_db(app)
    app.run(debug=True, host='0.0.0.0')