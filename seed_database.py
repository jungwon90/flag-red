import os
import secrets
import requests
import json
from datetime import datetime
from random import choice
from faker import Faker
from flask_sqlalchemy import SQLAlchemy
import psycopg2

import crud
from model import db, User, Twilio, UserProfileAirForecast, AirForecast, connect_to_db
from server import app

API_KEY2 = os.environ['WAQI_KEY']


def load_air_forecast():
    """ Load Air Quality Forecast and Store it into DB """
    # Read in the zipcode data and store into 'zipcodes' list
    cities = [];
    airforecast_objs = []; # a list of airforecast objects for return

    file = open('data/cities.txt') # load the file
    for line in file:  # loop over the file to get each line of strings
        line = line.rstrip() # get a string in each line and store it
        words = line.split('/')

        city = words[0]
        latitude = words[1]
        longitude = words[2]
        cities.append({'city': city, 'latitude': latitude, 'longitude': longitude}) # append each city into cities array
        
    print(cities)


    for city in cities:

        # Request air forcast data from API => store in a variable called "air_forcast"
        air_forecast_url = f"https://api.waqi.info/feed/geo:{city['latitude']};{city['longitude']}/?token={API_KEY2}"
        air_forecast_res = requests.get(air_forecast_url)
        air_forecast = air_forecast_res.json()
        print('Air Forecast')

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
            city_name = city['city']
            print(pm10, pm25, uvi, dominentpol, aqi, lat, lng, time, city_name)
                
            # create AirForecast object(air quality forecast of today ~ todat + 7days)
            # and store it into DB
            air_obj = crud.create_airforecast(pm10, pm25, uvi, dominentpol, aqi, lat, lng, time, city_name)
            airforecast_objs.append(air_obj)
            print(f'AirForecast Object: {air_obj}')
    
    return airforecast_objs



def create_users():
    """ Create Users and Store into DB """
    cities = [];
    
    file = open('data/cities.txt') # load the file
    for line in file:  # loop over the file to get each line of strings
        line = line.rstrip() # get a string in each line and store it
        words = line.split('/')

        city = words[0]
        cities.append(city)
    
    user_objs = [];
    user = Faker('en_US')
    for i in range(1, 11):
        #get the values for creating users
        user_id = user.first_name() + str(i)
        fname = user.first_name()
        lname = user.last_name()
        password = user.password(length=8)
        email = user.ascii_free_email()
        phone_num = user.phone_number()
        city = choice(cities);

        print(user_id, fname, lname, password, email, phone_num, city)

        # create User object(each user data) and store each user into DB
        user_obj = crud.create_user(user_id, fname, lname, password, email, phone_num, city)
        print(f'UserObject: {user_obj}')
        # append each user_obj into user_objs list
        user_objs.append(user_obj)

        # create Twilio object(each user's twilio data) and store it into DB
        crud.create_twilio(user_obj)

    return user_objs



def create_user_profile_forecast(user_objs, air_forecast_objs):
    """ Create user profile air forecast """

    for user_obj in user_objs:
        for air_forecast_obj in air_forecast_objs:
            # if user.city == air_forecast_obj, create UserProfileAirForecast
            if user_obj.city == air_forecast_obj.city:
                user_profile_forecast = crud.create_user_profile_airforecast(user_obj, air_forecast_obj)
                print(f'UserProfileForecast object: {user_profile_forecast}')




if __name__ == '__main__':
    os.system('dropdb flagred')
    os.system('createdb flagred')

    connect_to_db(app)
    db.create_all()
    
    # call all the functions to seed data base
    air_forecast_objs = load_air_forecast()
    user_objs = create_users()

    create_user_profile_forecast(user_objs, air_forecast_objs)

