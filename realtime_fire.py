from realtime_data import RealTimeData

class RealTimeFire(RealTimeData):
    """ This class retrieves real time fire data from AMBEE API """

    def __init__(self, search_input, API_KEY, end_point, latitude=0, longitude=0):
        super().__init__(API_KEY, end_point)
        self.latitude = latitude
        self.longitude = longitude
        self.search_input = search_input
    
    def get_data(self):
        """ Request real-time fire data from API and return it """

        self.set_query_string()
        self.realtime_data = super().get_data()
        if len(self.realtime_data['data']) == 0:
            #if there's no active fire, return a string 'No Active Fire around search location"
            self.realtime_data = {"message": f'No Active Fire around {self.search_input}'}
                
        return self.realtime_data
        

    def set_query_string(self):
        """ Set query strings based on data of self.latitude, self.longitude """
        
        self.querystring = {"lat": str(self.latitude), "lng": str(self.longitude)}

rtfiredata = RealTimeFire('San Francisco', "UTu4z6fSan9T2dI2Ckuj68oDGQTZNlon5SgDvsjX", 'latest/fire', 37.7749, -122.4194)