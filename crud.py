"""CRUD operations."""
from flask_sqlalchemy import SQLAlchemy 
from datetime import datetime
from model import db, User, Twilio, UserProfileAirForecast, AirForecast, connect_to_db


######## User #########

def create_user(user_id, fname, lname, password, email, phone_num, city):
    """ Create and return a new user """

    user = User(user_id = user_id, fname = fname, lname = lname, password = password, 
                email = email, phone_num = phone_num, city = city)

    db.session.add(user)
    db.session.commit()

    return user


def get_users():
    """ Return all users """

    return User.query.all()


def get_user_by_id(user_id):
    """ Return a user by phone number """

    return User.query.filter(User.user_id == user_id).first()



######## Twilio ########

def create_twilio(user_obj):
    """ Create and return a new twilio """

    twilio = Twilio(user = user_obj)

    db.session.add(twilio)
    db.session.commit()

    return twilio


def get_twilio_users():
    """ Return all users having Twilio SMS service """

    return Twilio.query.all()



######## UserProfileAirForecast ########

def create_user_profile_airforecast(user, airforecast):
    """ Create and return a user profile air forecast """

    user_profile_airforecast = UserProfileAirForecast(user=user, air_forecast=airforecast)

    db.session.add(user_profile_airforecast)
    db.session.commit()

    return user_profile_airforecast



######## AirForecast ########


def create_airforecast(pm10, pm25, uvi, dominentpol, aqi, lat, lng, time, city):
    """ Create and return a new air forecast """

    air_forecast = AirForecast(pm10=pm10, pm25=pm25, uvi=uvi, dominentpol=dominentpol,
                            aqi=aqi, lat=lat, lng=lng, time=time, city=city)

    db.session.add(air_forecast)
    db.session.commit()

    return air_forecast


def get_airforecasts():
    """ Return all air forecasts """

    return AirForecast.query.all()


def get_airforecast_by_city(city):
    """ Return air forecast by zipcode """

    return AirForecast.query.filter(AirForecast.postal_code == zipcode).all()
