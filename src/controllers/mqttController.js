import MQTT from 'mqtt';

const brokerUrl = "ws://raba7554.ala.dedicated.aws.emqxcloud.com:8083/mqtt";
const mqttOptions = {
  username: "moy19",
  password: "moy19",
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
};

let client = null;

export const connectToBroker = () => {
  if (!client) {
    client = MQTT.connect(brokerUrl, mqttOptions);

    client.on('connect', () => {
      console.log("Conectado al broker MQTT");
    });

    client.on('error', (err) => {
      console.error("Error en conexión MQTT:", err);
    });
  }
};

export const subscribeToTopic = (topic) => {
  if (client) {
    client.subscribe(topic, (err) => {
      if (!err) {
        console.log(`Suscrito a: ${topic}`);
      } else {
        console.error("Error al suscribirse:", err);
      }
    });
  }
};

export const publishMessage = (topic, message) => {
  if (client) {
    client.publish(topic, message, { qos: 1, retain: false }, (err) => {
      if (err) {
        console.error(`Error al publicar en ${topic}:`, err);
      } else {
        console.log(`Mensaje enviado a ${topic}: ${message}`);
      }
    });
  }
};

export const getSensorData = (macAddress) => {
  return new Promise((resolve, reject) => {
    if (client) {
      const sensorTopic = `mi/topico/sensor/${macAddress}`;
      subscribeToTopic(sensorTopic);

      client.on('message', (topic, message) => {
        if (topic === sensorTopic) {
          try {
            const payload = JSON.parse(message.toString());
            resolve(payload);
          } catch (error) {
            reject(error);
          }
        }
      });
    } else {
      reject(new Error("Cliente MQTT no conectado"));
    }
  });
};