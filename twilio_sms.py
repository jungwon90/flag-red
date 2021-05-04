from twilio.rest import Client
 
class Twilio:
    """ This class sends sms service using Twilio API """

    def __init__(self, phone_number, twilio_phone, 
                twilio_account_sid, twilio_key, user_fname):
        self.phone_number = phone_number
        self.twilio_phone = twilio_phone
        self.twilio_account_sid = twilio_account_sid
        self.twilio_key = twilio_key
        self.user_fname = user_fname
        self.message = ''
    
    def set_message(self, user_city, air_quality, dominentpol, uv_level):
        """ It sets message content """
        self.message = f"Hello, {self.user_fname}! Today's air quality around {user_city} is {air_quality}. Dominent pollution is {dominentpol} and UV level is {uv_level}."
    
    def send_message(self):
        """ It sends sms message to the phone number """
        try:
            client = twilio.rest.Client(self.twilio_account_sid, self.twilio_key)
            sms = client.messages.create(
                to = self.phone_number,
                from_ = self.twilio_phone,
                body = self.message
            )
        except twilio.TwilioRestException as e:
            print(e)