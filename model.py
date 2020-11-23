from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    """ A user """
    __tablename__ = "users"

    user_id = db.Column(db.String, primary_key=True)
    fname = db.Column(db.String, nullable=False)
    lname = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    phone_num = db.Column(db.String, unique=True, nullable=False)
    city = db.Column(db.String, nullable=False)
    sms_service = db.Column(db.Boolean)

    twilio = db.relationship('Twilio')

    def __repr__(self):
        """ Shows a user object """
        return f'<User user_id={self.user_id} city={self.city}>'


class Twilio(db.Model):
    """ A twillio's SMS info """

    ___tablename__ = "twilios"

    twilio_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(10), db.ForeignKey("users.user_id"))
    date = db.Column(db.String)

    user = db.relationship('User')

    def __repr__(self):
        return f'<Twilio twilio_id={self.twilio_id} user_id={self.user_id}>'


class UserProfileAirForecast(db.Model):
    """ Shows an AirForecast object """

    __tablename__ = "userairforecasts"

    user_air_forecast_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(10), db.ForeignKey("users.user_id"))
    air_forecast_id = db.Column(db.Integer, db.ForeignKey("airforecasts.air_forecast_id"))

    user = db.relationship('User')
    air_forecast = db.relationship('AirForecast', backref="user_airforecast")

    def __repr__(self):
        return f'<UserProfileAirForecast user_air_forecast_id={self.user_air_forecast_id} user_id={self.user_id}>'

class AirForecast(db.Model):
    """ A history of Air quality """
    # Air Quality Index 
    # 0 ~ 50 : good
    # 51 ~ 100 : moderate
    # 101 ~ 150 : unhealthy for sensitive groups
    # 151 ~ 200 : unhealthy
    # 201 ~ 300 : very unhealthy
    # 301 ~ higher : hazardous

    __tablename__ = "airforecasts"

    air_forecast_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    pm10 = db.Column(db.Integer) # Particulate matter < 10um (ug/m3)
    pm25 = db.Column(db.Integer) # Particulate matter < 2.5um (ug/m3)
    o3 = db.Column(db.Integer)
    uvi = db.Column(db.Integer) # Ultraviolet Radiation Index 
    dominentpol = db.Column(db.String) # dominent pollution
    aqi = db.Column(db.Integer, nullable=False) #air quality index
    lat = db.Column(db.Float, nullable=False) #latitude
    lng = db.Column(db.Float, nullable=False) #longitude
    time = db.Column(db.String, nullable = False) # ISO timestamp of event in UTC
    city = db.Column(db.String, nullable = False) 


    def __repr__(self):
        """ Shows an AirForecast object """
        return f'<AirForecast air_forecast_id={self.air_forecast_id} aqi={self.aqi}>'


def connect_to_db(flask_app, db_uri='postgresql:///flagred', echo=True):
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    flask_app.config['SQLALCHEMY_ECHO'] = echo
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('Connected to the db!')


if __name__ == '__main__':
    from server import app

    connect_to_db(app)
    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.