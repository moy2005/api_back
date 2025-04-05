import mqtt from 'mqtt';

// Configuración del cliente MQTT
const client = mqtt.connect("ws://m6209e92.ala.dedicated.aws.emqxcloud.com:8083/mqtt", {
    username: "moy19",
    password: "moy19"
});

client.on('connect', () => {
    console.log("✅ Conectado al broker MQTT");
});

client.on('error', (err) => {
    console.error("❌ Error en la conexión MQTT:", err);
});

// Función para publicar mensajes MQTT
const publish = (topic, message) => {
    return new Promise((resolve, reject) => {
        client.publish(topic, message, { qos: 1 }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

// Función para suscribirse a un tema MQTT
const subscribe = (topic, callback) => {
    client.subscribe(topic, (err) => {
        if (err) {
            console.error(`❌ Error al suscribirse a ${topic}:`, err);
        } else {
            console.log(`✅ Suscrito a ${topic}`);
            client.on('message', (receivedTopic, message) => {
                if (receivedTopic === topic) {
                    callback(message.toString());
                }
            });
        }
    });
};

export { publish, subscribe };
