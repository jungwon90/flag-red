from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    """ A user """
    __tablename__ = "users"

    user_id = db.Column(db.String(10), primary_key=True)
    fname = db.Column(db.String(20), nullable=False)
    lname = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(30), unique=True, nullable=False)
    phone_num = db.Column(db.String(20), unique=True, nullable=False)
    zipcode = db.Column(db.String(10), nullable=False)

    twilios = db.relationship('Twilio')

    def __repr__(self):
        """ Shows a user object """
        return f'<User user_id={self.user_id} zipcode={self.zipcode}>'


class Twilio(db.Model):
    """ A twillio's SMS info """

    ___tablename__ = "twilios"

    twilio_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(10), db.ForeignKey("users.user_id"))
    message = db.Column(db.Text)

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
    air_forecasts = db.relationship('AirForcast', backref="user_airforecast")

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
    no2 = db.Column(db.Float) # Nitrogen dioxide conc(ppb)
    pm10 = db.Column(db.Float) # Particulate matter < 10um (ug/m3)
    pm2_5 = db.Column(db.Float) # Particulate matter < 2.5um (ug/m3)
    co = db.Column(db.Float) # Carbon monoxide conc (ppm)
    so2 = db.Column(db.Float) # Sulphur dioxide conc (ppb)
    ozone = db.Column(db.Float) # OZONE conc (ppb)
    aqi = db.Column(db.Integer, nullable=False) #air quality index
    lat = db.Column(db.String(10), nullable=False) #latitude
    lng = db.Column(db.String(10), nullable=False) #longitude
    created_at = db.Column(db.DateTime, nullable = False) # ISO timestamp of event in UTC
    postal_code = db.Column(db.String(10), nullable = False) 
    major_pollutant = db.Column(db.String)


    def __repr__(self):
        """ Shows an AirForecast object """
        return f'<AirQualHistory air_history_id={self.air_forecast_id} aqi={self.aqi}>'


def connect_to_db(flask_app, db_uri='postgresql:///red-flag', echo=True):
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