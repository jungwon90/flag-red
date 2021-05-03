from flask import Flask, render_template, jsonify, request, redirect, session, flash
from model import db, connect_to_db, User, Twilio, UserProfileAirForecast, AirForecast
from flask_sqlalchemy import SQLAlchemy
from twilio.rest import Client
import crud
from realtime_airquality import RealTimeAirQuality
from realtime_fire import RealTimeFire
from realtime_soil import RealTimeSoil
from airforecast import AirForecast
from helpers import get_coordinate, generate_weekly_airforecast_in_db, get_air_quality_description,get_uv_level_description, get_date_of_today, get_user_sms_service_data

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
    # Get user inputs from the form
    search_for = request.args.get('cur-search-for')
    search_by = request.args.get('cur-search-by')
    search_input = request.args.get('cur-search-input') 
    try:
        # Create RealTimeAirQuality object and get data
        air_quality_obj = RealTimeAirQuality(search_by, search_input, API_KEY, f'latest/{search_by}')
        air_quality_data = air_quality_obj.get_data()
        result_data = {}
        if search_for == "air-quality":
            result_data = air_quality_data
        elif search_for == "fire":
            # Create RealTimeFire object and get data
            fire_obj = RealTimeFire(search_input, API_KEY, 'latest/fire', air_quality_obj.latitude, air_quality_obj.longitude)
            result_data = fire_obj.get_data()      
        elif search_for == "soil":
            # Create RealTimeSoil object and get data
            soil_obj = RealTimeSoil(API_KEY, 'soil/latest/by-lat-lng', air_quality_obj.latitude, air_quality_obj.longitude)
            result_data = soil_obj.get_data()
           
        # Create AirForecast object and get data
        air_forecast_obj = AirForecast(API_KEY2, air_quality_obj.latitude, air_quality_obj.longitude)
        air_forecast = air_forecast_obj.get_data()
        # Append air_forcast to result_data
        result_data['airforecast'] = air_forecast['data']
        return jsonify(result_data)
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


# session = {
    # 'current_user': user_id}

@app.route('/login', methods=['POST'])
def handle_login():
    """ Log user into app """
    # user inputs from the form
    user_id = request.form.get('id')
    password = request.form.get('password')

    user_obj = crud.get_user_by_id(user_id)
    # if there's user, that means the user_id exists in DB
    if user_obj:
        if user_obj.password == password:
            # Create session and store user_id
            session['current_user'] = user_obj.user_id
            # Extract coordinate
            coordinate = get_coordinate(user_obj.city)
            # Create AirForecast object and get data
            air_forecast_obj = AirForecast(API_KEY2, coordinate['latitude'], coordinate['longitude'])
            air_forecast_data = air_forecast_obj.get_data()['data']
            print(air_forecast_data)
            generate_weekly_airforecast_in_db(air_forecast_data, user_obj, coordinate['latitude'], coordinate['longitude'])
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
    today = get_date_of_today()
    crud.create_twilio(user_obj, today)

    # Extract phone_number and first_name from each User object
    phone_number = os.environ['PHONE_NUMBER']
    twilio_phone = os.environ['TWILIO_PHONE_NUMBER']
    twilio_account_sid = os.environ['TWILIO_ACCOUNT_SID']
    twilio_key = os.environ['TWILIO_KEY']  
    user_fname = user_obj.fname

    user_sms_data = get_user_sms_service_data(cur_user_id)    
    # get sms descriptions
    air_quality = get_air_quality_description(user_sms_data['aqi'])
    uv_level = get_uv_level_description(user_sms_data['uvi'])
    
    # Create alert message for the user
    message = f"Hello, {user_fname}! Today's air quality around {user_sms_data['city']} is {air_quality}. Dominent pollution is {user_sms_data['dominentpol']} and UV level is {uv_level}."

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