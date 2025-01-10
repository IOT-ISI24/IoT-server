import paho.mqtt.client as mqtt
import json
import time
import random

BROKER_ADDRESS = "localhost"
BROKER_PORT = 1885
MQTT_USER = "user1"
MQTT_PASSWORD = "password"

USER_ID = "1"
DEVICE_MAC = "24:0A:C4:00:00:00"

# Topic to publish data to
topic = f"/users/{USER_ID}/devices/{DEVICE_MAC}/data"

def generate_sensor_data():
    """Generate random sensor data for testing."""
    return {
        "temperature": round(random.uniform(15.0, 30.0), 2),
        "pressure": round(random.uniform(950.0, 1050.0), 2),
        "humidity": round(random.uniform(30.0, 70.0), 2),
        "air_quality":round(random.uniform(10.0, 100.0), 2),
        "mac": DEVICE_MAC
    }

# Create an MQTT client instance
client = mqtt.Client("Data_Sender")
client.username_pw_set(MQTT_USER, MQTT_PASSWORD)

# Connect to the MQTT broker
print("Łączenie z brokerem MQTT...")
client.connect(BROKER_ADDRESS, BROKER_PORT)

print(f"Publikowanie danych na temat: {topic}")

try:
    while True:
        # Generate random sensor data
        sensor_data = generate_sensor_data()

        # Convert the data to JSON format
        payload = json.dumps(sensor_data)

        # Publish the payload to the topic
        client.publish(topic, payload)
        print(f"Wysłano dane: {payload}")

        # Wait for 5 seconds before sending the next set of data
        time.sleep(5)

except KeyboardInterrupt:
    print("Zakończono wysyłanie danych.")
    client.disconnect()
