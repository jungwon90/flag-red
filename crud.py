"""CRUD operations."""
from flask_sqlalchemy import SQLAlchemy 
from datetime import datetime
from model import db, User, Twilio, UserAirQualHistory, AirQualHistory, connect_to_db

######## User #########

def create_user(user_id, fname, lname, password, email, phone_num, zipcode):
    """ Create and return a new user """

    user = User(user_id = user_id, fname = fname, lname = lname, password = password, 
                email = email, phone_num = phone_num, zipcode = zipcode)

    db.session.add(user)
    db.session.commit()

    return user


def get_users():
    """ Return all users """

    return User.query.all()


def get_user_by_phone_num(phone_num):
    """ Return a user by phone number """

    return User.query.filter(User.phone_num == phone_num).first()



######## Twilio ########

def create_twilio(user_id, message):
    """ Create and return a new twilio """

    twilio = Twilio(user_id = user_id, message = message)

    db.session.add(user)
    db.session.commit()

    return user



######## UserAirQualHistory ########

def create_user_air_quality_history(user_id, air_history_id):
    """ Create and return a user air quality history """

    user_airqual_history = UserAirQualHistory(user_id = user_id, air_history_id = air_history_id)

    return user_airqual_history



######## AirQualHistory ########

def create_air_quality_history(no2, pm10, pm2_5, co, so2, ozone, aqi, lat, lng, created_at, postal_code, major_pollutant):
    """ Create and return a new air quality history """

    airqual_history = AirQualHistory(no2 = no2, pm10 = pm10, pm2_5 = pm2_5, so2 = so2,
                                    ozone = ozone, aqi = aqi, lat = lat, lng = lng, 
                                    created_at = created_at, postal_code = postal_code,
                                    major_pollutant = major_pollutant)

    db.session.add(user)
    db.session.commit()

    return airqual_history


def get_airquality_histories():
    """ Return all air quality histories """

    return AirQualHistory.query.all()


def get_airquality_histories_by_zipcode(zipcode):
    """ Return airquality histories by the date """

    return AirQualHistory.query.filter(AirQualHistory.postal_code == zipcode).all()
