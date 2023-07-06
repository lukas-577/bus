import { devulveDatos } from '../puppeteer.js'

export const getDatos = async (req, res) => {
    try {
        const paradero = req.params.paradero
        devulveDatos(paradero).then((resultado) => {

            res.json(resultado);

        })
    } catch (error) {
        return res.status(500).json({
            message: 'Algo salio mal :c'
        })
    }
};