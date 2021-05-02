import requests
import json

class AirForecast:
    def __init__(self, API_KEY, latitude, longitude):
        self.API_KEY = API_KEY
        self.latitude = latitude
        self.longitude = longitude
        self.data = {}
    
    def get_data(self):
        """ Request air quality forecast data from API and return it """

        url = f"https://api.waqi.info/feed/geo:{self.latitude};{self.longitude}/?token={self.API_KEY}"
        air_forecast_req = requests.get(url)
        self.data = air_forecast_req.json()

        return self.data
        

data = AirForecast("39ffe132bb8c29508473c9dde86ba6fe193f5195", 37.7749, -122.4194)