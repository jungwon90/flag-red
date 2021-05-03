import crud

def get_coordinate(user_city):
    coordinate = {}
    file = open('data/cities.txt') # load the file
    for line in file:  # loop over the file to get each line of strings
        line = line.rstrip() # get a string in each line and store it
        words = line.split('/')
        city = words[0]
        #if the user's city is same as city, extract latitude, longitude for API request
        if user_city == city:
            coordinate['latitude'] = words[1]
            coordinate['longitude'] = words[2]
    return coordinate


def generate_weekly_airforecast_in_db(air_forecast_data, user_obj, lat, lng):
    if air_forecast_data['forecast'].get('daily', 0) != 0:
        air_forecast_daily = air_forecast_data['forecast']['daily']
        # create 6 days of air forecast
        for i in range(6):
            air_forecast_att_dic = get_air_forecast_attributes(air_forecast_data, air_forecast_daily, 
                                                            i, user_obj.city, lat, lng)  
            
            print(air_forecast_att_dic['pm10'], air_forecast_att_dic['pm25'], 
                                        air_forecast_att_dic['o3'], air_forecast_att_dic['uvi'], 
                                        air_forecast_att_dic['dominentpol'], air_forecast_att_dic['aqi'], 
                                        air_forecast_att_dic['lat'], air_forecast_att_dic['lng'], 
                                        air_forecast_att_dic['time'], air_forecast_att_dic['city_name'])           
            #Create AirForecast, UserProfileAirForecast obj and store it into DB
            air_obj = crud.create_airforecast(air_forecast_att_dic['pm10'], air_forecast_att_dic['pm25'], 
                                        air_forecast_att_dic['o3'], air_forecast_att_dic['uvi'], 
                                        air_forecast_att_dic['dominentpol'], air_forecast_att_dic['aqi'], 
                                        air_forecast_att_dic['lat'], air_forecast_att_dic['lng'], 
                                        air_forecast_att_dic['time'], air_forecast_att_dic['city_name'])
            crud.create_user_profile_airforecast(user_obj, air_obj)


def get_air_forecast_attributes(air_forecast_data, air_forecast_daily, index, user_city, lat, lng):
    air_forecast_att_dic = {}
    if index > len(air_forecast_daily['pm10']) -1:
        air_forecast_att_dic['pm10'] = air_forecast_daily['pm10'][len(air_forecast_daily['pm10']) -1]['avg']
    else:  
        air_forecast_att_dic['pm10'] = air_forecast_daily['pm10'][index]['avg'] 
    if index > len(air_forecast_daily['pm25']) -1:
        air_forecast_att_dic['pm25'] = air_forecast_daily['pm25'][len(air_forecast_daily['pm25']) -1]['avg']
    else:
        air_forecast_att_dic['pm25'] = air_forecast_daily['pm25'][index]['avg']       
    if index > len(air_forecast_daily['o3']) -1:
        air_forecast_att_dic['o3'] = air_forecast_daily['o3'][len(air_forecast_daily['o3']) -1]['avg']
    else:
        air_forecast_att_dic['o3'] = air_forecast_daily['o3'][index]['avg']
    air_forecast_att_dic['dominentpol'] = air_forecast_data['dominentpol']
    air_forecast_att_dic['aqi'] = air_forecast_data['aqi']
    air_forecast_att_dic['lat'] = lat
    air_forecast_att_dic['lng'] = lng
    air_forecast_att_dic['time'] = air_forecast_data['time']['s']
    air_forecast_att_dic['city_name'] = user_city
    #sometime, uvi has not enough length of forecast days
    if index > len(air_forecast_daily['uvi']) - 1:
        air_forecast_att_dic['uvi'] = air_forecast_daily['uvi'][last_uvi_index]['avg']
    else:
        air_forecast_att_dic['uvi'] = air_forecast_daily['uvi'][index]['avg'] 
    
    return air_forecast_att_dic