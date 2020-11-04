"""CRUD operations."""
from flask_sqlalchemy import SQLAlchemy 
from datetime import datetime
from model import db, User, AirQualHistory, connect_to_db

######## User #########

def create_user(name, phone_num, zipcode):
    """ Create and return a new user """

    user = User(name = name, phone_num = phone_num, zipcode = zipcode)

    db.session.add(user)
    db.session.commit()

    return user


def get_users():
    """ Return all users """

    return User.query.all()


def get_user_by_phone_num(phone_num):
    """ Return a user by phone number """

    return User.query.filter(User.phone_num == phone_num).first()




######## AirQualHistory ########

def create_air_quality_history(no2, pm10, pm2_5, co, so2, ozone, aqi, lat, lng, created_at, postal_code, major_pollutant):
    """ Create and return a new air quality history """

    air_qual_history = AirQualHistory(no2 = no2, pm10 = pm10, pm2_5 = pm2_5, so2 = so2,
                                    ozone = ozone, aqi = aqi, lat = lat, lng = lng, 
                                    created_at = created_at, postal_code = postal_code,
                                    major_pollutant = major_pollutant)

    db.session.add(user)
    db.session.commit()

    return air_qual_history


def get_airquality_histories():
    """ Return all air quality histories """

    return AirQualHistory.query.all()


def get_airquality_histories_by_date(date):
    """ Return airquality histories by the date """

    return AirQualHistory.query.filter(AirQualHistory.created_at == date).all()
