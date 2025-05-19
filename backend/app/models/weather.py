from pydantic import BaseModel
from datetime import datetime

class WeatherModel(BaseModel):
    date: datetime
    temperature: float
    lat: float
    lon: float
    # Add other fields as needed
