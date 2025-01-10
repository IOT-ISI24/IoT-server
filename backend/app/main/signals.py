from django.dispatch import receiver, Signal
from django.utils.timezone import now
from backend.app.main.models import Measurement, ESP

mqtt_payload_received = Signal("payload")

@receiver(mqtt_payload_received)
def save_payload_to_db(sender, payload, **kwargs):
    print(payload)
    try:
        data = parse_payload(payload)
        esp = ESP.objects.get(mac=data["esp_mac"])
        Measurement.objects.create(esp=esp,
                                temperature=data["temperature"],
                                pressure=data["pressure"],
                                humidity=data["humidity"],
                                pm25_concentration=data["air_quality"],
                                date=data["date"]) 
        print("Data saved to the database.")
    except Exception as e:
        print(f"Error: {e}")

def parse_payload(payload):
    return {
        "esp_mac": payload["mac"],
        "temperature": payload["temperature"],
        "pressure": payload["pressure"],
        "humidity": payload["humidity"],
        "air_quality": payload["air_quality"],
        "date": now()
    }
