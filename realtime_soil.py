from realtime_data import RealTimeData

class RealTimeSoil(RealTimeData):
    """ This class retrieves real time soil data from AMBEE API """

    def __init__(self, API_KEY, end_point,latitude=0, longitude=0):
        super().__init__(API_KEY, end_point)
        self.latitude = latitude
        self.longitude = longitude

    def get_data(self):
        """ Request real-time soil data from API and return it """

        self.set_query_string()
        return super().get_data()


    def set_query_string(self):
        """ Set query strings based on data of self.latitude, self.longitude """

        self.querystring = {"lat": str(self.latitude), "lng": str(self.longitude)}
    

rtfiredata = RealTimeSoil("UTu4z6fSan9T2dI2Ckuj68oDGQTZNlon5SgDvsjX", 'soil/latest/by-lat-lng', 37.7749, -122.4194)