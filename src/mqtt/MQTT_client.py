import paho.mqtt.client as mqtt
import json
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.app.settings')
import django
django.setup()
from backend.app.main.models import ESP
from backend.app.main.signals import mqtt_payload_received

BROKER_ADDRESS = "localhost"
BROKER_PORT = 1885

class MQTTClient:
    def __init__(self):
        self.client = mqtt.Client("PC_Client")
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.subscribe("/data")
        self.client.subscribe("/request/frequency")

    def on_connect(self, client, userdata, flags, rc):
        print("Connected with result code " + str(rc))
        client.subscribe("/data")
        client.subscribe("/request/frequency")

    def on_message(self, client, userdata, msg):
        try:
            payload = json.loads(msg.payload.decode())
            topic = msg.topic

            if topic == "/request/frequency":
                self.handle_frequency_request(payload)
            else:
                mqtt_payload_received.send(sender=self.__class__, payload=payload)
        except json.JSONDecodeError:
            print("Invalid JSON format")

    def handle_frequency_request(self, payload):
        mac = payload.get("mac")
        if not mac:
            print("No 'mac' field in payload")
            return

        try:
            esp = ESP.objects.get(mac=mac)
            frequency = esp.frequency

            response_payload = frequency
            topic = f"/frequency/{mac}"
            self.client.publish(topic, json.dumps(response_payload))
            print(f"Responded to {topic} with {response_payload}")
        except ESP.DoesNotExist:
            print(f"ESP with MAC {mac} not found")
        


    def run(self):
        self.client.connect(BROKER_ADDRESS, BROKER_PORT)
        self.client.loop_forever()

if __name__ == "__main__":
    client = MQTTClient()
    client.run()
