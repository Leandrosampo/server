import express from 'express';
import ProductManager from './script.js';

const app = express();
const port = 8080;


const productManager = new ProductManager();

app.get('/products', async (req, res) => {
    try {
        await productManager.loadFromFile();
        const products = productManager.getProducts();
        const limit = parseInt(req.query.limit);
        const limitedProducts = !isNaN(limit) ? products.slice(0, limit) : products;
        res.json(limitedProducts);
    } catch (error) {
        res.send('Error al obtener los productos.' )
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        await productManager.loadFromFile();
        const product = productManager.getProductById(productId);

        if (product) {
            res.json(product);
        } else {
            res.send('Error al obtener los productos.' )

        }
    } catch (error) {
        res.send('Error al obtener los productos.' )
    }
});

app.listen(port, () => {
    console.log(`Servidor Express en ejecución en el puerto ${port}`);
});









