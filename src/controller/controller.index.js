import { devulveDatos } from '../puppeteer.js'

export const getDatos = async (req, res) => {
    try {
        const paradero = req.params.paradero
        devulveDatos(paradero).then((resultado) => {
            if (resultado.length === 0) {
                res.status(404).json({
                    message: 'Mal ingresado el paradero O fuera de horario de operacion para este paradero'
                })
            }
            else {
                res.json(resultado);
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Algo salio mal :c'
        })
    }
};