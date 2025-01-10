import paho.mqtt.client as mqtt
import json
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.app.settings')
import django
django.setup()
from backend.app.main.signals import mqtt_payload_received


BROKER_ADDRESS = "localhost"
BROKER_PORT = 1885
MQTT_USER = "user1"
MQTT_PASSWORD = "password"

USER_ID = "1"
DEVICE_MAC = "24:0A:C4:00:00:00"

class MQTTClient:
    def __init__(self):
        self.client = mqtt.Client("PC_Client")
        self.client.username_pw_set(MQTT_USER, MQTT_PASSWORD)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            topic = f"/users/{USER_ID}/devices/{DEVICE_MAC}/data"
            print(f"Connected to MQTT broker, subscribing to topic: {topic}")
            client.subscribe(topic)

    def on_message(self, client, userdata, msg):
        try:
            payload = json.loads(msg.payload.decode())
            mqtt_payload_received.send(sender=self.__class__, payload=payload)
        except json.JSONDecodeError:
            print("Invalid JSON format")

    def run(self):
        self.client.connect(BROKER_ADDRESS, BROKER_PORT)
        self.client.loop_forever()

if __name__ == "__main__":
    client = MQTTClient()
    client.run()