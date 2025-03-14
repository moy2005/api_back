/* Este archivo contiene los controladores relacionados con la autenticación de usuarios en una aplicación basada en Node.js y MongoDB.
Los controladores permiten registrar usuarios, iniciar sesión, cerrar sesión, verificar tokens JWT y obtener información del perfil del usuario autenticado.
Estos controladores interactúan con la base de datos y manejan las cookies para gestionar la autenticación y autorización. */

import crypto from 'crypto'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { createAccessToken } from '../libs/jwt.js'
import { transporter } from '../libs/nodemailer.js'
import jwt from 'jsonwebtoken'
import { TOKEN_SECRET, FRONTEND_URL, GMAIL_USER, GMAIL_PASS } from '../config.js'
import userModel from '../models/user.model.js'

// Controlador para registrar un nuevo usuario
export const register = async (req, res) => {
    const { email, password, realName, lastName, phoneNumber, secretWord, role } = req.body;



    try {
        // Validación de campos requeridos
        if (!email || !password || !realName || !lastName || !phoneNumber || !secretWord) {
            return res.status(400).json(["Todos los campos son requeridos"]);
        }

        // Verificar si el usuario ya existe
        const userFound = await User.findOne({ email });
        if (userFound) {
            return res.status(400).json(["El correo ya está en uso"]);
        }



        // Encriptar contraseña
        const passwordHash = await bcrypt.hash(password, 10);



        // Generar código de verificación
        const verificationCode = crypto.randomBytes(3).toString('hex');
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // Expira en 10 minutos

        // Crear nuevo usuario en memoria (pendiente de verificación)
        const pendingUser = {
            email,
            password: passwordHash,
            realName,
            lastName,
            phoneNumber,
            secretWord,
            role: role || "cliente",
            verificationCode,
            verificationCodeExpires,
            isVerified: false
        };

        // Guardar los datos del usuario en la sesión (pendiente de verificación)
        req.session.pendingUser = pendingUser;

        // Enviar correo de verificación
        try {
            await transporter.sendMail({
                to: email,
                subject: 'Código de verificación',
                text: `Tu código de verificación es: ${verificationCode}. Este código expira en 10 minutos.`,
            });
        } catch (emailError) {
            console.error('Error al enviar email:', emailError);
            // No retornamos error aquí para no bloquear el registro
        }

        // Responder exitosamente
        return res.status(201).json({
            message: 'Usuario registrado. Por favor, verifica tu correo.',
            success: true
        });

    } catch (error) {
        console.error('Error en registro:', error);
        return res.status(500).json({
            message: "Error al registrar usuario",
            error: error.message
        });
    }
};


// Controlador para iniciar sesión de un usuario
export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        // Buscar al usuario en la base de datos por su email
        const userFound = await User.findOne({ email })





        // Verificar si el usuario no existe
        if (!userFound) return res.status(400).json(["Usuario no encontrado"])

        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        const isMatch = await bcrypt.compare(password, userFound.password)


        // Verificar si las contraseñas no coinciden
        if (!isMatch) return res.status(400).json(["Contraseña incorrecta"])

        // Crear un token JWT para autenticar al usuario
        const token = await createAccessToken({ id: userFound._id, role: userFound.role })

        // Guardar el token en una cookie para mantener la sesión
        res.cookie('token', token)

        // Enviar al cliente los datos del usuario logueado (sin la contraseña)
        res.json({
            id: userFound._id,
            realName: userFound.realName,
            lastName: userFound.lastName,
            email: userFound.email,
            phoneNumber: userFound.phoneNumber,
            secretWord: userFound.secretWord,
            role: userFound.role || 'cliente',
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
            token
        })
    } catch (error) {
        console.error('Login error:', error);
        // Manejo de errores: devolver un mensaje de error si algo falla
        res.status(500).json({ message: error.message })
    }
}

// Controlador para cerrar sesión de un usuario
export const logout = (req, res) => {
    // Limpiar la cookie que contiene el token
    res.cookie('token', "", {
        expires: new Date(0) // Establecer la cookie con una fecha de expiración pasada
    })
    return res.sendStatus(200) // Responder con un estado exitoso
}

// Controlador para obtener la información del perfil de un usuario
export const profile = async (req, res) => {
    try {
        // Buscar al usuario por su ID obtenido del token
        const userFound = await User.findById(req.user.id)

        // Verificar si el usuario no existe
        if (!userFound) return res.status(400).json(["Usuario no encontrado"])

        // Enviar los datos del usuario al cliente
        return res.json({
            id: userFound._id,
            realName: userFound.realName,
            lastName: userFound.lastName,
            email: userFound.email,
            phoneNumber: userFound.phoneNumber,
            secretWord: userFound.secretWord,
            role: userFound.role || 'cliente',
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        })
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ message: error.message })
    }
}

export const getUsers = async (req, res) => {
    try {
        console.log("Usuario autenticado:", req.user);
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error("Error al obtener usuarios:", error); // Muestra el error en la consola
        return res.status(500).json({ message: "Hubo un fallo al obtener los usuarios" });
    }
};


export const createUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const { realName, lastName, email, phoneNumber, password, secretWord, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El correo electrónico ya está en uso." });
        }

        const newUser = new User({
            realName,
            lastName,
            email,
            phoneNumber,
            password,
            secretWord,
            role,
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Hubo un fallo al crear el usuario" });
    }
};


export const getUser = async (req, res) => {
    try {
        //if (req.user.role !== 'admin') {
           // return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        //}

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
};


export const updateUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const { realName, lastName, email, phoneNumber, password, secretWord, role } = req.body;

        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
            if (existingUser) {
                return res.status(400).json({ message: "El correo electrónico ya está en uso." });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { realName, lastName, email, phoneNumber, password, secretWord, role },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(updatedUser);
    } catch (error) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
};


export const deleteUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.sendStatus(204);
    } catch (error) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
};


// Controlador para verificar la validez del token de sesión
export const verifyToken = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).json({ message: "Usuario no autorizado" });

        return res.json({
            id: user._id,
            realName: user.realName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            secretWord: user.secretWord,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//Verfica si el token es valido no regresa ningun dato al fronend
export const verifyTokenReset = async (req, res) => {

    const { token } = req.params;


    try {
        const decoded = jwt.verify(token, TOKEN_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        res.status(200).json({ message: 'Token válido' });

    } catch (err) {
        res.status(400).json({ message: 'Token inválido o expirado' });
    }
}

export const forgot_password = async (req, res) => {


    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'El correo es requerido' });

    const user = await User.findOne({ email });

    console.log(user)

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const token = jwt.sign({ id: user._id }, TOKEN_SECRET, { expiresIn: '1h' });

    const resetUrl = `${FRONTEND_URL}/reset-password/${token}`;

    const mailOptions = {
        to: email,
        subject: 'Recuperación de contraseña',
        html: `<p>Haz clic <a href="${resetUrl}">aquí</a> para restablecer tu contraseña. Este enlace es válido por 1 hora.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Correo de recuperación enviado' });

    } catch (error) {
        res.status(500).json({ message: 'Error al enviar el correo de recuperación' });
    }
};



export const reset_password = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) return res.status(400).json({ message: 'La nueva contraseña es requerida' });

    if (newPassword.length < 6) return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });

    try {
        const decoded = jwt.verify(token, TOKEN_SECRET);

        console.log(decoded)

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const userUpdated = await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

        const mailOptions = {
            to: userUpdated.email,
            subject: 'Contraseña actualizada',
            html: `<p>Tu contraseña ha sido actualizada con éxito. <a href="${FRONTEND_URL}/login">Iniciar sesion</a></p>`,
        };

        await transporter.sendMail(mailOptions); //Enviar correco de confirmacion

        res.status(200).json({ message: 'Contraseña actualizada con éxito' });

    } catch (err) {
        res.status(400).json({ message: 'Token inválido o expirado' });
    }
};

export const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
        if (User.isVerified) return res.status(400).json({ message: 'Cuenta ya verificada.' });

        // Validar el código y su expiración
        if (user.verificationCode !== code) return res.status(400).json({ message: 'Código incorrecto.' });
        if (user.verificationCodeExpires < Date.now()) return res.status(400).json({ message: 'Código expirado.' });

        // Marcar como verificado y eliminar el código
        user.isVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpires = null;

        await user.save();

        res.json({ message: 'Cuenta verificada con éxito.' });
    } catch (err) {
        res.status(500).json({ message: 'Error al verificar usuario.', error: err.message });
    }
};


export const send_link = async (req, res) => {

    const { email } = req.body;

    //if (!email) return res.status(400).json({ message: 'El correo es requerido' });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Generar el token de recuperación
    const token = jwt.sign({ id: user._id }, TOKEN_SECRET, { expiresIn: '1h' });

    // Construir la URL de recuperación de contraseña
    const resetUrl = `${FRONTEND_URL}/reset-password/${token}`;

    // Configurar las opciones del correo
    const mailOptions = {
        to: email,
        subject: 'Recuperación de contraseña',
        html: `<p>Haz clic <a href="${resetUrl}">aquí</a> para restablecer tu contraseña. Este enlace es válido por 1 hora.</p>`,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Correo de recuperación enviado' });
};


export const verifyKeyword = async (req, res) => {
    const { email, secretWord } = req.body;

    // Validación inicial
    if (!email) return res.status(400).json({ message: 'El correo es requerido' });
    if (!secretWord) return res.status(400).json({ message: 'La palabra clave es requerida' });

    try {
        // Buscar al usuario en la base de datos
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'El usuario no existe' });

        // Verificar la palabra clave
        if (user.secretWord !== secretWord) {

            return res.status(401).json({ message: 'Palabra clave incorrecta' });
        }

        // Generar el token de recuperación
        const token = jwt.sign({ id: user._id }, TOKEN_SECRET, { expiresIn: '1h' });

        // Construir la URL de recuperación de contraseña
        const resetUrl = `${FRONTEND_URL}/reset-password/${token}`;

        return res.status(200).json({ message: '!!Excelente', URL: resetUrl });

    } catch (error) {
        console.error('Error en verifyKeyword:', error);
        return res.status(500).json({ message: 'Error al procesar la solicitud' });
    }




};


export const sendVerificationCode = async (req, res) => {
    const { email, realName, lastName, phoneNumber, password, secretWord } = req.body;

    try {
        const userFound = await User.findOne({ email });
        if (userFound) return res.status(400).json({ message: "El correo ya está en uso." });

        const verificationCode = crypto.randomBytes(3).toString('hex');
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

        // Guardar datos en la sesión
        req.session.pendingUser = {
            email,
            realName,
            lastName,
            phoneNumber,
            password,
            secretWord,
            verificationCode,
            verificationCodeExpires
        };

        // 🔥 Guardar la sesión manualmente
        req.session.save((err) => {
            if (err) {
                console.error("❌ Error guardando sesión:", err);
                return res.status(500).json({ message: "Error al guardar la sesión." });
            }

            console.log("✅ Sesión guardada:", req.session);

            // Enviar código por correo
            transporter.sendMail({
                to: email,
                subject: "Código de verificación",
                text: `Tu código de verificación es: ${verificationCode}. Expira en 10 minutos.`,
            });

            return res.status(200).json({ message: "Código de verificación enviado" });
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



export const verifyEmailCode = async (req, res) => {
    if (!req.session || !req.session.pendingUser) {
        return res.status(400).json({
            message: "No hay sesión activa o el código expiró.",
            code: "SESSION_EXPIRED"
        });
    }

    const { email, code } = req.body;
    const pendingUser = req.session.pendingUser;

    if (email !== pendingUser.email) {
        return res.status(400).json({ message: "El email no coincide con la sesión actual" });
    }

    if (code !== pendingUser.verificationCode) {
        return res.status(400).json({ message: "Código de verificación incorrecto" });
    }

    if (new Date() > new Date(pendingUser.verificationCodeExpires)) {
        return res.status(400).json({ message: "El código ha expirado", code: "CODE_EXPIRED" });
    }

    try {
        const newUser = new User({
            email,
            password: pendingUser.password,  // Use the original hashed password
            realName: pendingUser.realName,
            lastName: pendingUser.lastName,
            phoneNumber: pendingUser.phoneNumber,
            secretWord: pendingUser.secretWord,
            role: "cliente",
            isVerified: true
        });

        await newUser.save();
        req.session.destroy();

        return res.status(201).json({ success: true, message: "Usuario registrado correctamente" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

