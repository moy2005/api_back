/* Este archivo contiene un middleware que valida los datos enviados por el cliente 
 contra un esquema definido utilizando una librería de validación. 
 Si los datos no cumplen con el esquema, se devuelve un error al cliente; 
 de lo contrario, se permite continuar con la solicitud. */


export const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json(
            error.errors.map((error) => error.message) 
        );
    }
};

