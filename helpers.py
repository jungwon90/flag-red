import crud
from datetime import datetime

def get_coordinate(user_city):
    """ Returns coordinate based on user_city """
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

def get_air_quality_description(air_quality_index):
    air_quality = ''
    if air_quality_index <= 50:
        air_quality = "good"
    elif air_quality_index > 50 and air_quality_index <= 100:
        air_quality = "moderate"
    elif air_quality_index > 100 and air_quality_index <= 150:
        air_quality = "unhealthy for sensitive groups"
    elif air_quality_index > 150 and air_quality_index <= 200:
        air_quality = "unhealthy"
    elif air_quality_index > 200 and air_quality_index <= 300:
        air_quality = "very unhealthy"
    elif air_quality_index > 300:
        air_quality = "hazardous"
    return air_quality

def get_uv_level_description(uv_index):
    uv_level = ''
    if uv_index <= 2:
        uv_level = "low"
    elif tuv_index > 2 and uv_index <= 5:
        uv_level = "moderate"
    elif uv_index > 5 and uv_index <= 7:
        uv_level = "high"
    elif uv_index > 7 and uv_index <= 10:
        uv_level = "very high"
    elif uv_index > 10:
        uv_level = "extreme"
    return uv_level

def get_date_of_today():
    today_obj = datetime.now()
    today = f"{today_obj.year}/{today_obj.month}/{today_obj.day}"
    return today

def get_user_sms_service_data(user_id):
    # Get 6 UserProfileAirForecast objects by the current user id
    user_airforecasts = crud.get_user_profile_airforecasts_by_user_id(user_id)
    # Get all air_forecasts
    airforecasts = crud.get_airforecasts();
    user_sms_data = {}
    for user_airforecast in user_airforecasts:
        for airforecast in airforecasts:
            if user_airforecast.air_forecast_id == airforecast.air_forecast_id:
                user_sms_data = {'pm10': airforecast.pm10, 'pm25': airforecast.pm25, 'uvi': airforecast.uvi, 
                                        'dominentpol': airforecast.dominentpol, 'aqi': airforecast.aqi, 'city': airforecast.city}
                break
    return user_sms_data

def get_user_profile_data(user_id):
    user_profile_data = []
    # Get 6 UserProfileAirForecast objects by the current user's id that's requested
    user_profile_airforecasts = crud.get_user_profile_airforecasts_by_user_id(current_user_id)
    air_forecasts = crud.get_airforecasts();
    # Pull 6 days of air forecast with the air_forecast_ids
    day = 1
    for user_profile_airforecast in user_profile_airforecasts:
        for air_forecast in air_forecasts:
            if user_profile_airforecast.air_forecast_id == air_forecast.air_forecast_id:
                user_profile_data.append({'pm10': air_forecast.pm10, 'pm25': air_forecast.pm25, 'o3': air_forecast.o3, 'uvi': air_forecast.uvi, 
                                        'dominentpol': air_forecast.dominentpol, 'aqi': air_forecast.aqi, 'lat': air_forecast.lat,
                                        'lng': air_forecast.lng, 'time': air_forecast.time, 'city': air_forecast.city})
                day += 1
    return user_profile_data