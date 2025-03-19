import EstadoDispositivo from '../models/estadoDispositivo.model.js';
import Dispositivo from '../models/dispositivo.model.js';

// Guardar estado del dispositivo enviado desde ESP32
// Guardar o actualizar estado del dispositivo enviado desde ESP32
export const saveEstadoDispositivo = async (req, res) => {
    try {
        const { 
            macAddress, 
            temperatura, 
            humedad, 
            humedadSuelo, 
            luz,
            ventanaAbierta, 
            ventiladorActivo, 
            ventiladorVelocidad, 
            riegoActivo 
        } = req.body;

        // Verificar si el dispositivo existe en la base de datos
        const dispositivoExistente = await Dispositivo.findOne({ macAddress });
        
        if (!dispositivoExistente) {
            console.log(`Dispositivo con MAC ${macAddress} no registrado pero se guardará su estado`);
        }

        // Buscar y actualizar el estado del dispositivo si ya existe
        const estadoActualizado = await EstadoDispositivo.findOneAndUpdate(
            { macAddress }, // Criterio de búsqueda
            {
                temperatura,
                humedad,
                humedadSuelo,
                luz,
                ventanaAbierta,
                ventiladorActivo,
                ventiladorVelocidad,
                riegoActivo,
                updatedAt: new Date() // Actualizar la fecha de modificación
            },
            { 
                upsert: true, // Crear un nuevo documento si no existe
                new: true // Devuelve el documento actualizado
            }
        );

        res.status(201).json({ 
            message: "Estado del dispositivo guardado/actualizado con éxito",
            estado: estadoActualizado
        });
    } catch (error) {
        console.error('Error al guardar/actualizar estado del dispositivo:', error);
        res.status(500).json({ message: "Error al guardar/actualizar el estado del dispositivo", error: error.message });
    }
};


// Obtener historial de estados de un dispositivo por MAC
export const getEstadosByMac = async (req, res) => {
    try {
        const { macAddress } = req.params;
        
        // Buscar estados del dispositivo
        const estados = await EstadoDispositivo.find({ macAddress })
            .sort({ createdAt: -1 }) // Ordenar por fecha, más reciente primero
            .limit(100); // Limitar a 100 registros
        
        if (estados.length === 0) {
            return res.status(404).json({ message: "No se encontraron datos para este dispositivo" });
        }
        
        res.json(estados);
    } catch (error) {
        console.error('Error al obtener estados del dispositivo:', error);
        res.status(500).json({ message: "Error al obtener los estados del dispositivo", error: error.message });
    }
};

// Obtener último estado de un dispositivo por MAC
export const getUltimoEstadoByMac = async (req, res) => {
    try {
        const { macAddress } = req.params;
        
        // Buscar el último estado del dispositivo
        const ultimoEstado = await EstadoDispositivo.findOne({ macAddress })
            .sort({ createdAt: -1 }); // Ordenar por fecha, más reciente primero
        
        if (!ultimoEstado) {
            return res.status(404).json({ message: "No se encontraron datos para este dispositivo" });
        }
        
        res.json(ultimoEstado);
    } catch (error) {
        console.error('Error al obtener último estado del dispositivo:', error);
        res.status(500).json({ message: "Error al obtener el último estado del dispositivo", error: error.message });
    }
};

// Obtener estadísticas de un dispositivo por MAC (promedios diarios)
export const getEstadisticasByMac = async (req, res) => {
    try {
        const { macAddress } = req.params;
        
        // Obtener promedio de temperatura, humedad y humedad del suelo por día
        const estadisticas = await EstadoDispositivo.aggregate([
            { $match: { macAddress } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" }
                    },
                    fecha: { $first: "$createdAt" },
                    avgTemperatura: { $avg: "$temperatura" },
                    avgHumedad: { $avg: "$humedad" },
                    avgHumedadSuelo: { $avg: "$humedadSuelo" },
                    avgLuz: { $avg: "$luz" },
                    registros: { $sum: 1 }
                }
            },
            { $sort: { fecha: -1 } },
            { $limit: 30 } // Últimos 30 días
        ]);
        
        if (estadisticas.length === 0) {
            return res.status(404).json({ message: "No se encontraron suficientes datos para generar estadísticas" });
        }
        
        res.json(estadisticas);
    } catch (error) {
        console.error('Error al obtener estadísticas del dispositivo:', error);
        res.status(500).json({ message: "Error al obtener estadísticas del dispositivo", error: error.message });
    }
};

