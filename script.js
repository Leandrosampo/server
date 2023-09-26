import { readFileSync, writeFileSync } from 'fs';

class ProductManager {
    constructor() {
        this.products = [];
        this.comision = 0.15;
        this.path = 'products.json';

    }

    getNextID = () => {
        const count = this.products.length;
        const nextID = count > 0 ? this.products[count - 1].id + 1 : 1;
        return nextID;
    }

    loadFromFile() {
        try {
            const data = readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

    saveToFile() {
        const data = JSON.stringify(this.products, null, 2);
        writeFileSync(this.path, data, 'utf8');
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log('Todos los campos son obligatorios.');
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.log(`Ya existe un producto con el código ${code}. El producto ${description} no será agregado.`);
            return;
        }

        const productosAgregados = {
            id: this.getNextID(),
            title,
            description,
            price: (parseFloat(price) + (parseFloat(price) * this.comision)).toFixed(2),
            thumbnail,
            code,
            stock
        };

        
        this.products.push(productosAgregados);

        this.saveToFile();
    }

    getProducts = () => this.products;

    getProductById = (id) => {
        const product = this.products.find(product => product.id === id);

        if (!product) {
            console.log('Producto no encontrado por ID');
            return null;
        }

        return product;
    }

    updateProduct(id, updatedData) {
        const productIndex = this.products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            console.log('Producto no encontrado en la actualizacion');
            return false;
        }
        this.products[productIndex] = {
            ...this.products[productIndex],
            ...updatedData,
        };

        this.saveToFile();
        return true;
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            console.log('Producto no encontrado.');
            return false;
        }
        this.products.splice(productIndex, 1);

        this.saveToFile();
        return true;
    }
}

const manager = new ProductManager();

// Agregar productos
manager.addProduct('Aceite', 'Natura', '62', 'www.google.com/aceite-natura', '581', '43');
manager.addProduct('Manteca', 'SanCor', '32', 'www.google.com/manteca-SanCor', '242', '30');
manager.addProduct('Harina', 'Pureza', '20', 'www.google.com/manteca-SanCor', '242', '35');
manager.addProduct('Harina', 'La Negrita', '20', 'www.google.com/manteca-SanCor', '243', '310');
manager.addProduct('Leche', 'serenisima', '38', 'wwww.google.com/leche-serenisima', '1', '3');
manager.addProduct('Leche', 'serenisima', '39', 'wwww.google.com/leche-serenisima', '2', '3');
manager.addProduct('Leche', 'serenisima', '39', 'wwww.google.com/leche-serenisima', '3', '3');

console.log(manager.getProducts());


const updatedProductData = {
    title: 'Nuevo Aceite',
    description: 'Nueva descripcion',
    price: '99',
    thumbnail: 'www.thumbnail.com',
    code: '1234',
    stock: '57',
};

/---------------------/

const updateResult = manager.updateProduct(1, updatedProductData);

if (updateResult) {
    console.log('Producto actualizado correctamente.');
} else {
    console.log('No se pudo actualizar el producto.');
}

/---------------------/

const deleteResult = manager.deleteProduct(0);

if (deleteResult) {
    console.log('Producto eliminado correctamente.');
} else {
    console.log('Producto no se pudo eliminar.');
}

export default ProductManager;