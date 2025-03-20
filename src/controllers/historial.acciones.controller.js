import HistorialAcciones from '../models/historialAcciones.js';

// Guardar acción en el historial
export const saveAccion = async (req, res) => {
    try {
        const { macAddress, accion, estadoAnterior, estadoNuevo } = req.body;
        
        // Validar que la acción sea una de las permitidas
        if (!['ventilador', 'ventana', 'riego'].includes(accion)) {
            return res.status(400).json({ message: "Tipo de acción no válido" });
        }
        
        // Crear nueva entrada en el historial
        const nuevaAccion = new HistorialAcciones({
            macAddress,
            accion,
            estadoAnterior,
            estadoNuevo
        });
        
        await nuevaAccion.save();
        
        res.status(201).json({ 
            message: "Acción registrada correctamente",
            accion: nuevaAccion
        });
    } catch (error) {
        console.error('Error al registrar acción:', error);
        res.status(500).json({ message: "Error al registrar la acción", error: error.message });
    }
};




export const getHistorialByMacWithFilter = async (req, res) => {
    try {
        const { macAddress } = req.params;
        const { accion } = req.query; // Filtro opcional por tipo de acción

        // Construir el filtro de búsqueda
        const filtro = { macAddress };
        if (accion && ['ventilador', 'ventana', 'riego'].includes(accion)) {
            filtro.accion = accion;
        } else if (accion) {
            return res.status(400).json({ message: "Tipo de acción no válido" });
        }

        // Buscar acciones del dispositivo con el filtro aplicado
        const acciones = await HistorialAcciones.find(filtro)
            .sort({ createdAt: -1 }) // Ordenar por fecha, más reciente primero
            .limit(100); // Limitar a 100 registros

        if (acciones.length === 0) {
            return res.status(404).json({ message: "No se encontraron acciones para este dispositivo" });
        }

        res.json(acciones);
    } catch (error) {
        console.error('Error al obtener historial de acciones:', error);
        res.status(500).json({ message: "Error al obtener el historial de acciones", error: error.message });
    }
};

// Obtener historial de acciones por MAC
export const getHistorialByMac = async (req, res) => {
    try {
        const { macAddress } = req.params;
        
        // Buscar acciones del dispositivo
        const acciones = await HistorialAcciones.find({ macAddress })
            .sort({ createdAt: -1 }) // Ordenar por fecha, más reciente primero
            .limit(100); // Limitar a 100 registros
        
        if (acciones.length === 0) {
            return res.status(404).json({ message: "No se encontraron acciones para este dispositivo" });
        }
        
        res.json(acciones);
    } catch (error) {
        console.error('Error al obtener historial de acciones:', error);
        res.status(500).json({ message: "Error al obtener el historial de acciones", error: error.message });
    }
};

// Obtener historial de acciones por tipo de acción
export const getHistorialByTipo = async (req, res) => {
    try {
        const { macAddress, accion } = req.params;
        
        // Validar que la acción sea una de las permitidas
        if (!['ventilador', 'ventana', 'riego'].includes(accion)) {
            return res.status(400).json({ message: "Tipo de acción no válido" });
        }
        
        // Buscar acciones del dispositivo por tipo
        const acciones = await HistorialAcciones.find({ macAddress, accion })
            .sort({ createdAt: -1 }) // Ordenar por fecha, más reciente primero
            .limit(50); // Limitar a 50 registros
        
        if (acciones.length === 0) {
            return res.status(404).json({ message: `No se encontraron acciones de tipo '${accion}' para este dispositivo` });
        }
        
        res.json(acciones);
    } catch (error) {
        console.error('Error al obtener historial de acciones por tipo:', error);
        res.status(500).json({ message: "Error al obtener el historial de acciones por tipo", error: error.message });
    }
};

// Obtener resumen de acciones por día
export const getResumenAcciones = async (req, res) => {
    try {
        const { macAddress } = req.params;
        
        // Obtener resumen de acciones por día
        const resumen = await HistorialAcciones.aggregate([
            { $match: { macAddress } },
            {
                $group: {
                    _id: {
                        fecha: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        accion: "$accion"
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.fecha": -1 } }
        ]);
        
        if (resumen.length === 0) {
            return res.status(404).json({ message: "No se encontraron acciones para generar resumen" });
        }
        
        // Reorganizar datos para mejor presentación
        const resumenPorFecha = {};
        resumen.forEach(item => {
            const fecha = item._id.fecha;
            const accion = item._id.accion;
            const count = item.count;
            
            if (!resumenPorFecha[fecha]) {
                resumenPorFecha[fecha] = {};
            }
            
            resumenPorFecha[fecha][accion] = count;
        });
        
        res.json(resumenPorFecha);
    } catch (error) {
        console.error('Error al obtener resumen de acciones:', error);
        res.status(500).json({ message: "Error al obtener el resumen de acciones", error: error.message });
    }
};

