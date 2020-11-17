from flask import Flask, render_template, jsonify, request, redirect, session, flash
from model import db, connect_to_db, User, Twilio, UserProfileAirForecast, AirForecast
from flask_sqlalchemy import SQLAlchemy
import crud

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

    if 'current_user' in session:
        current_user = session['current_user']
    else:
        current_user = session['current_user'] = ''
    

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
  

@app.route('/valid.json')
def handle_valid_user():
    """ Return a JSON response with all user_ids in DB """

    # Get all the users from DB
    all_users = crud.get_users();
    all_user_ids = [];
    
    # loop over all user objects, extract user_id and append it to all_user_ids list
    for user in all_users:
        all_user_ids.append(user.user_id);

    return jsonify(all_user_ids)



@app.route('/signup', methods=['POST'])
def handle_signup():
    """ Create a user and store the user in DB """
    
    # user inputs from the form
    input_id = request.form.get('input-id')
    first_name = request.form.get('first-name')
    last_name = request.form.get('last-name')
    password = request.form.get('password')
    email = request.form.get('email')
    phone_number = request.form.get('phone-number')
    city = request.form.get('city')

    # Create a user and store into DB
    user_obj = crud.create_user(input_id, first_name, last_name, password, email, phone_number, city)
    crud.create_twilio(user_obj)

    # Need to create air quality forecast and store the data in DB for user profile 
    latitude = 0
    longitude = 0
    file = open('data/cities.txt') # load the file
    for line in file:  # loop over the file to get each line of strings
        line = line.rstrip() # get a string in each line and store it
        words = line.split('/')
        city = words[0]
        #if the user's city is same as city, extract latitude, longitude for API request
        if user_obj.city == city:
            latitude = words[1]
            longitude = words[2]

    # API request for air forecast data 
    air_forecast_url = f"https://api.waqi.info/feed/geo:{latitude};{longitude}/?token={API_KEY2}"
    air_forecast_res = requests.get(air_forecast_url)
    air_forecast = air_forecast_res.json()

    #Extract the data to create AirForecast object
    air_forecast_data = air_forecast['data']
    air_forecast_daily = air_forecast_data['forecast']['daily']

    # create 6 days of air forecast
    for i in range(6):    
        pm10 = air_forecast_daily['pm10'][i]['avg'] 
        pm25 = air_forecast_daily['pm25'][i]['avg']
        uvi = air_forecast_daily['uvi'][i]['avg']
        dominentpol = air_forecast_data['dominentpol']
        aqi = air_forecast_data['aqi']
        lat = latitude
        lng = longitude
        time = air_forecast_data['time']['s']
        # time = datetime.strptime(air_forecast_data['time']['s'], '%Y-%m-%d %H:%M:%S')
        city_name = user_obj.city
        print(pm10, pm25, uvi, dominentpol, aqi, lat, lng, time, city_name)
                
        # create AirForecast object(air quality forecast of today ~ todat + 7days)
        # and store it into DB
        air_obj = crud.create_airforecast(pm10, pm25, uvi, dominentpol, aqi, lat, lng, time, city_name)
        # create UserProfileAirForecast and store it into DB
        crud.create_user_profile_airforecast(user_obj, air_obj)

    return jsonify({"success": True})



@app.route('/login', methods=['POST'])
def handle_login():
    """ Log user into app """

    # user inputs from the form
    user_id = request.form.get('id')
    password = request.form.get('password')
    
    #Get user by id
    user = crud.get_user_by_id(user_id)
    
    # session = {
    # 'current_user': user_id}

    # if there's user, that means the user_id exists in DB
    if user:
        if user.password == password:
            # Create session and store user_id
            session['current_user'] = user.user_id

            return jsonify({'message': 'Logged in!'})
        else:
            session['current_user'] = ''
            return jsonify({'message': 'Wrong password!'})    
    else:
        return jsonify({'message': 'Wrong ID!'})



@app.route('/logout', methods=['POST'])
def handle_logout():
    """ Log the user out """

    # Delete the user from session
    del session['current_user']

    return jsonify({'message': 'You are logged out!'})


@app.route('/profile.json')
def handle_profile():
    """ Return a JSON response with user profile data in DB """

    current_user_id = request.args.get('current-user')
    print('Currnt User ID:') 
    print(current_user_id)

    user_profile_data = {}

    # Get 6 UserProfileAirForecast objects by the current user's id that's requested
    user_profile_airforecasts = crud.get_user_profile_airforecasts_by_user_id(current_user_id)
    # Get all air_forecasts
    air_forecasts = crud.get_airforecasts();

    # Pull 6 days of air forecast with the air_forecast_ids
    day = 1
    for user_profile_airforecast in user_profile_airforecasts:
        for air_forecast in air_forecasts:
            if user_profile_airforecast.air_forecast_id == air_forecast.air_forecast_id:
                user_profile_data[f'{day}'] = {'pm10': air_forecast.pm10, 'pm25': air_forecast.pm25, 'uvi': air_forecast.uvi, 
                                        'dominentpol': air_forecast.dominentpol, 'aqi': air_forecast.aqi, 'lat': air_forecast.lat,
                                        'lng': air_forecast.lng, 'time': air_forecast.time, 'city': air_forecast.city}
                day += 1

    print(user_profile_data)
    return jsonify(user_profile_data)



@app.route('/waqikey.json')
def send_waqi_api_key():
    """ Return WAQI API KEY """

    return jsonify({'API_KEY2': API_KEY2})


@app.route('/sms', methods=['POST'])
def send_sms_alert():
    """ Send users a SMS air quality/fire alert """

    # Get all the users from DB
    users = crud.get_users()
        
        for user in users:
            # Extract phone_number and first_name from each User object
            
            # Create alert message for the user

            # send alert_message to users

    pass


if __name__ == "__main__":
    connect_to_db(app)
    app.run(debug=True, host='0.0.0.0')