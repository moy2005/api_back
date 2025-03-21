// mqtt.routes.js
import express from "express";
import { connectToBroker, subscribeToTopic, publishMessage, getSensorData } from "../controllers/mqttController.js";

const router = express.Router();

router.post("/connect", (req, res) => {
  connectToBroker();
  res.status(200).json({ message: "Conectado al broker MQTT" });
});

router.post("/subscribe", (req, res) => {
  const { topic } = req.body;
  subscribeToTopic(topic);
  res.status(200).json({ message: `Suscrito a: ${topic}` });
});

router.post("/publish", (req, res) => {
  const { topic, message } = req.body;
  publishMessage(topic, message);
  res.status(200).json({ message: `Mensaje enviado a ${topic}: ${message}` });
});

router.get("/sensor-data/:macAddress", async (req, res) => {
  const { macAddress } = req.params;
  try {
    const data = await getSensorData(macAddress);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; // Exportación por defecto