import requests
import json

class RealTimeData:
    """ This class retrieves real time data from AMBEE API """

    def __init__(self, API_KEY, end_point=''):
        self.url = 'https://api.ambeedata.com/' + end_point
        self.headers = {
        'x-api-key': API_KEY,
        'Content-type': "application/json"
        }
        self.querystring = ''
        self.realtime_data = {}
    
    def get_data(self):
        """ Request data from API and return it """

        realtime_data_req = requests.get(self.url, headers=self.headers, params=self.querystring)
        self.realtime_data = realtime_data_req.json()
        
        return self.realtime_data

rtdata = RealTimeData("UTu4z6fSan9T2dI2Ckuj68oDGQTZNlon5SgDvsjX")
rtdata.get_data()