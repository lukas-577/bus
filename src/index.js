// import {devulveDatos} from './puppeteer.js'
import express from 'express';
import datos from './routes/routes.js'
const app = express();

// devulveDatos().then((resultado)=>{
//     console.log(resultado);
// })


app.use(datos);


app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
});