import * as mqttService from '../services/mqttService.js';

// Controlar un actuador (encender/apagar)
export const controlActuator = async (req, res) => {
    const { macAddress, actuatorType, command } = req.body;

    try {
        // Publicar el comando MQTT
        const topic = `mi/topico/${actuatorType}/${macAddress}`;
        await mqttService.publish(topic, command);

        // Respuesta al frontend
        res.status(200).json({
            success: true,
            message: `Comando ${command} enviado a ${actuatorType}`
        });
    } catch (error) {
        console.error("❌ Error al controlar el actuador:", error);
        res.status(500).json({
            success: false,
            message: "Error al controlar el actuador"
        });
    }
};

