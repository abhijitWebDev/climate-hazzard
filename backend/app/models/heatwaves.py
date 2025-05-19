from pydantic import BaseModel
from datetime import datetime

class HeatwaveModel(BaseModel):
    start: datetime
    end: datetime
    duration: int
    avg_temp: float
    lat: float
    lon: float
    type: str = "heatwave"
    # Add other fields as needed
