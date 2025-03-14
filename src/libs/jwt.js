/* Este archivo contiene una función para crear un JSON Web Token (JWT), 
  que es una herramienta ampliamente utilizada en aplicaciones web para la autenticación y autorización. 
  Los JWT permiten transmitir información de forma segura entre el cliente y el servidor. */

import { TOKEN_SECRET } from '../config.js'  // Importar la clave secreta para firmar el token
import jwt from 'jsonwebtoken'  // Importar el módulo jwt para trabajar con JSON Web Tokens

// Función para crear un token de acceso (JWT)
export function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload, 
            TOKEN_SECRET, 
            {
                expiresIn: "1d",  
            },
            (err, token) => {
               
                if (err) reject(err)
               
                resolve(token)
            }
        )
    })
}
