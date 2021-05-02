from realtimedata import RealTimeData

class RealTimeAirQuality(RealTimeData):
    def __init__(self, search_by, search_input, API_KEY, end_point):
        super().__init__(API_KEY, end_point)
        self.search_by = search_by
        self.search_input = search_input
        self.latitude = 0
        self.longitude = 0

    def get_data(self):
        """ Request real-time air quality data from API and return it """

        self.set_query_string()
        self.realtime_data = super().get_data()
        self.set_coordinate()
        return self.realtime_data

    def set_query_string(self):
        """ Set query strings based on data of self.search_input, self.search_by """

        if self.search_by == 'by-postal-code':
            self.querystring = {'postalCode': self.search_input, 'countryCode': "US"}
        else :
            self.querystring = {'city': self.search_input}

    def set_coordinate(self):
        """ Extract coordinate from self.realtime_data and set self.latitude, self.longitude """
        airqual_dictionary = self.realtime_data['stations'][0] #get the very first(recent) data/result
        self.latitude = airqual_dictionary['lat']
        self.longitude = airqual_dictionary['lng']
      
    

rtairdata = RealTimeAirQuality('city', 'SanFrancisco', "UTu4z6fSan9T2dI2Ckuj68oDGQTZNlon5SgDvsjX", 'latest/by-city')

