from flask import Flask, render_template, jsonify, request, redirect, session, flash
from model import db, connect_to_db, User, Twilio, UserProfileAirForecast, AirForecast
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from twilio.rest import Client
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


    return jsonify({"success": True})



@app.route('/login', methods=['POST'])
def handle_login():
    """ Log user into app """

    # user inputs from the form
    user_id = request.form.get('id')
    password = request.form.get('password')
    
    #Get user by id
    user_obj = crud.get_user_by_id(user_id)
    
    # session = {
    # 'current_user': user_id}

    # if there's user, that means the user_id exists in DB
    if user_obj:
        if user_obj.password == password:
            # Create session and store user_id
            session['current_user'] = user_obj.user_id

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
            print(air_forecast_data)
            if air_forecast_data['forecast'].get('daily', 0) != 0:
                air_forecast_daily = air_forecast_data['forecast']['daily']

                pm10_last_index = len(air_forecast_daily['pm10']) -1
                pm25_last_index = len(air_forecast_daily['pm25']) -1
                o3_last_index = len(air_forecast_daily['pm10']) -1
                # create 6 days of air forecast
                for i in range(6):  
                    if i > pm10_last_index:
                        pm10 = air_forecast_daily['uvi'][pm10_last_index]['avg']
                    else:  
                        pm10 = air_forecast_daily['pm10'][i]['avg'] 
                    
                    if i > pm25_last_index:
                        pm25 = air_forecast_daily['uvi'][pm25_last_index]['avg']
                    else:
                        pm25 = air_forecast_daily['pm25'][i]['avg']
                    
                    if i > o3_last_index:
                        o3 = air_forecast_daily['o3'][o3_last_index]['avg']
                    else:
                        o3 = air_forecast_daily['o3'][i]['avg']
                    dominentpol = air_forecast_data['dominentpol']
                    aqi = air_forecast_data['aqi']
                    lat = latitude
                    lng = longitude
                    time = air_forecast_data['time']['s']
                    # time = datetime.strptime(air_forecast_data['time']['s'], '%Y-%m-%d %H:%M:%S')
                    city_name = user_obj.city
                    #sometime, uvi has not enough length of forecast days
                    last_uvi_index = len(air_forecast_daily['uvi']) - 1
                    if i > last_uvi_index:
                        uvi = air_forecast_daily['uvi'][last_uvi_index]['avg']
                    else:
                        uvi = air_forecast_daily['uvi'][i]['avg'] 
                    print(pm10, pm25, o3, uvi, dominentpol, aqi, lat, lng, time, city_name)
                            
                    # create AirForecast object(air quality forecast of today ~ todat + 5days)
                    # and store it into DB
                    air_obj = crud.create_airforecast(pm10, pm25, o3, uvi, dominentpol, aqi, lat, lng, time, city_name)
                    # create UserProfileAirForecast and store it into DB
                    crud.create_user_profile_airforecast(user_obj, air_obj)

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

    user_profile_data = []

    # Get 6 UserProfileAirForecast objects by the current user's id that's requested
    user_profile_airforecasts = crud.get_user_profile_airforecasts_by_user_id(current_user_id)
    # Get all air_forecasts
    air_forecasts = crud.get_airforecasts();

    # Pull 6 days of air forecast with the air_forecast_ids
    day = 1
    for user_profile_airforecast in user_profile_airforecasts:
        for air_forecast in air_forecasts:
            if user_profile_airforecast.air_forecast_id == air_forecast.air_forecast_id:
                user_profile_data.append({'pm10': air_forecast.pm10, 'pm25': air_forecast.pm25, 'o3': air_forecast.o3, 'uvi': air_forecast.uvi, 
                                        'dominentpol': air_forecast.dominentpol, 'aqi': air_forecast.aqi, 'lat': air_forecast.lat,
                                        'lng': air_forecast.lng, 'time': air_forecast.time, 'city': air_forecast.city})
                day += 1

    print(user_profile_data)
    return jsonify(user_profile_data)



@app.route('/waqikey.json')
def send_waqi_api_key():
    """ Return WAQI API KEY """

    return jsonify({'API_KEY2': API_KEY2})


############## SMS Service ###############

@app.route('/alertrequest', methods=['POST'])
def send_sms_alert():
    """ Send users a SMS air quality/fire alert """

    # Get current user by id
    cur_user_id = session['current_user']
    user_obj = crud.get_user_by_id(cur_user_id)

    # Set SMS service for that user
    crud.set_sms_service(cur_user_id, True)
      
    # Add the user to twilio table
    today_obj = datetime.now()
    today = f"{today_obj.year}/{today_obj.month}/{today_obj.day}"
    crud.create_twilio(user_obj, today)

    # Extract phone_number and first_name from each User object
    phone_number = os.environ['PHONE_NUMBER']
    twilio_phone = os.environ['TWILIO_PHONE_NUMBER']
    twilio_account_sid = os.environ['TWILIO_ACCOUNT_SID']
    twilio_key = os.environ['TWILIO_KEY']  
    user_fname = user_obj.fname

    # Get 6 UserProfileAirForecast objects by the current user id
    user_airforecasts = crud.get_user_profile_airforecasts_by_user_id(cur_user_id)
    # Get all air_forecasts
    airforecasts = crud.get_airforecasts();
    # Pull 6 days of air forecast with the air_forecast_ids
    user_sms_data = {}
    day = 1
    for user_airforecast in user_airforecasts:
        for airforecast in airforecasts:
            if user_airforecast.air_forecast_id == airforecast.air_forecast_id:
                user_sms_data[f'{day}'] = {'pm10': airforecast.pm10, 'pm25': airforecast.pm25, 'uvi': airforecast.uvi, 
                                        'dominentpol': airforecast.dominentpol, 'aqi': airforecast.aqi, 'city': airforecast.city}
                day += 1
                
    # get air quality based on aqi level
    today_air_forecast = user_sms_data['1']
    if today_air_forecast['aqi'] <= 50:
        air_quality = "good"
    elif today_air_forecast['aqi'] > 50 and today_air_forecast['aqi'] <= 100:
        air_quality = "moderate"
    elif today_air_forecast['aqi'] > 100 and today_air_forecast['aqi'] <= 150:
        air_quality = "unhealthy for sensitive groups"
    elif today_air_forecast['aqi'] > 150 and today_air_forecast['aqi'] <= 200:
        air_quality = "unhealthy"
    elif today_air_forecast['aqi'] > 200 and today_air_forecast['aqi'] <= 300:
        air_quality = "very unhealthy"
    elif today_air_forecast['aqi'] > 300:
        air_quality = "hazardous"

    # get uv quality based on uvi level
    if today_air_forecast['uvi'] <= 2:
        uv_level = "low"
    elif today_air_forecast['uvi'] > 2 and today_air_forecast['uvi'] <= 5:
        uv_level = "moderate"
    elif today_air_forecast['uvi'] > 5 and today_air_forecast['uvi'] <= 7:
        uv_level = "high"
    elif today_air_forecast['uvi'] > 7 and today_air_forecast['uvi'] <= 10:
        uv_level = "very high"
    elif today_air_forecast['uvi'] > 10:
        uv_level = "extreme"
    
    # Create alert message for the user
    message = f"Hello, {user_fname}! Today's air quality around {today_air_forecast['city']} is {air_quality}. Dominent pollution is {today_air_forecast['dominentpol']} and UV level is {uv_level}."

    # send alert_message to users
    client = Client(twilio_account_sid, twilio_key)

    sms = client.messages.create(
        to = phone_number,
        from_ = twilio_phone,
        body = message
    )
            
    return jsonify({'message': 'Alert On'})
  


@app.route('/alertcancel', methods=['POST'])
def cancel_sms_alert():
    """ Cancel SMS alert service """
    
    # Get current user by id
    cur_user_id = session['current_user']
   
    # Set SMS service to FalseFa
    crud.set_sms_service(cur_user_id, False)

    return jsonify({'message': 'Alert Off'})




if __name__ == "__main__":
    connect_to_db(app)

    app.run(debug=True, host='0.0.0.0')