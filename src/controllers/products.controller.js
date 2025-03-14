import Product from '../models/product.model.js';
import mongoose from 'mongoose';

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({})
            .populate('category') // Poblamos la categoría
            .populate('marca'); // Poblamos la marca
        res.json(products);
    } catch (error) {
        return res.status(500).json({ message: "Hubo un fallo al obtener productos" });
    }
};

export const createProduct = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const { name, description, price, stock, images, category, marca } = req.body;

        // Validar categoría
        const existingCategory = await mongoose.model('Category').findById(category);
        if (!existingCategory) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        // Validar marca
        const existingMarca = await mongoose.model('Marca').findById(marca);
        if (!existingMarca) {
            return res.status(404).json({ message: "Marca no encontrada" });
        }

        const newProduct = new Product({
            name,
            description,
            price,
            stock,
            images, 
            user: req.user.id,
            category: existingCategory._id,
            marca: existingMarca._id, // Relación con la marca
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Hubo un fallo al crear el producto" });
    }
};

export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category')
            .populate('marca');
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(product);
    } catch (error) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(401).json({ message: "Producto no encontrado" });
    }
};

/*
export const updateProduct = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const { category, marca } = req.body;

        // Validar si la nueva categoría existe
        if (category) {
            const existingCategory = await mongoose.model('Category').findById(category);
            if (!existingCategory) {
                return res.status(404).json({ message: "Categoría no encontrada" });
            }
        }

        // Validar si la nueva marca existe
        if (marca) {
            const existingMarca = await mongoose.model('Marca').findById(marca);
            if (!existingMarca) {
                return res.status(404).json({ message: "Marca no encontrada" });
            }
        }

        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('category')
            .populate('marca');
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(product);
    } catch (error) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }
};
*/

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, marca, ...updateData } = req.body;

        // Verificar si el usuario es administrador
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        // Validar si la nueva categoría existe
        if (category) {
            const existingCategory = await mongoose.model('Category').findById(category);
            if (!existingCategory) {
                return res.status(404).json({ message: "Categoría no encontrada" });
            }
        }

        // Validar si la nueva marca existe
        if (marca) {
            const existingMarca = await mongoose.model('Marca').findById(marca);
            if (!existingMarca) {
                return res.status(404).json({ message: "Marca no encontrada" });
            }
        }

        // Actualizar el producto
        const product = await Product.findByIdAndUpdate(id, updateData, { new: true })
            .populate('category')
            .populate('marca');

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(product);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const addReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        // Verificar si el usuario es un cliente
        if (req.user.role !== 'cliente') {
            return res.status(403).json({ message: "Acción no permitida. Solo para clientes." });
        }

        // Crear la nueva reseña
        const newReview = {
            user: req.user.id, // El ID del usuario que hace la reseña
            rating,
            comment,
            createdAt: new Date()
        };

        // Obtener el producto actual
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Agregar la nueva reseña al producto
        product.reviews.push(newReview);

        // Calcular el nuevo rating promedio
        const totalRatings = product.reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRatings / product.reviews.length;

        // Actualizar el rating promedio del producto
        product.rating = averageRating;

        // Guardar el producto actualizado
        await product.save();

        // Opcional: Populate para obtener detalles del usuario
        const updatedProduct = await Product.findById(id).populate('reviews.user');

        res.json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

