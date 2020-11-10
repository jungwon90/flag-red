import os
import json
from datetime import datetime
from faker import Faker

import crud
import model
import server

os.system('dropdb flag-red')
os.system('createdb flag-red')

model.connect_to_db(server.app)
model.db.create_all()

# store airqualiry history from 2015~ today into database
