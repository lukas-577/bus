import puppeteer from 'puppeteer';

export const devulveDatos = async (paradero) => {
    const browser = await puppeteer.launch({
        handless: 'new',
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
        ],
        executablePath:
            process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
    })


    try {
        const page = await browser.newPage();

        await page.setRequestInterception(true);
        page.on('request', request => {
            if (request.resourceType() === 'image' || request.resourceType() === 'media')
                request.abort();
            else
                request.continue();
        });

        const url = "http://web.smsbus.cl/web/buscarAction.do"
        const seccion = url + "?d=cargarServicios"

        await page.goto(seccion);

        const inputSelector = 'body>#contenedor_busqueda>#contenedor_formulario > form >#form_busqueda>#ingrese_codigo>#sprytextfield2 > label>#ingresar_paradero.campo_busqueda_rapida';


        await page.waitForSelector(inputSelector, { timeout: 4000 }).then(() => {
            console.log('si esta el selector');
        }).catch(e => {
            console.log('no encontro el selector' + e);
        });

        await page.type(inputSelector, paradero);


        const botonSelector = "#botones_busqueda > a:nth-child(3)"

        await Promise.all([
            page.click(botonSelector),

            // Esperar a que se cargue la nueva página después de la navegación
            page.waitForNavigation()
        ]);


        const selector = "#contenido_respuesta_2>#menu_solo_paradero"

        await page.waitForSelector(selector, { timeout: 4000 }).then(() => {
            console.log('si esta el selector de la 2da pag');
        }).catch(e => {
            console.log('no encontro el selector' + e);
        });


        //esto lo dejo porsiacaso xD 

        // const bus = await page.evaluate(() => {

        //     const selectorMismoBus = '#proximo_solo_paradero';

        //     const nodeList = document.querySelectorAll(selectorMismoBus);

        //     let arrayBus = [];
        //     for (let item of nodeList) {
        //         arrayBus.push(item.innerText);
        //     }

        //     return arrayBus;

        // });



        // const siguienteBus = await page.evaluate(() => {

        //     const selectorSigBus = '#siguiente_respuesta'

        //     const nodeList = document.querySelectorAll(selectorSigBus);

        //     let arrayBusSig = [];
        //     for (let item of nodeList) {
        //         arrayBusSig.push(item.innerText);
        //     }

        //     return arrayBusSig;

        // });

        const resultadoDeLasDosConsultas = await page.evaluate(() => {
            const selectorMismoBus = '#proximo_solo_paradero';
            const selectorSigBus = '#siguiente_respuesta';

            const nodeListMismoBus = document.querySelectorAll(selectorMismoBus);
            const nodeListSigBus = document.querySelectorAll(selectorSigBus);

            const arrayBus = [];


            const maxLength = Math.max(nodeListMismoBus.length, nodeListSigBus.length);

            for (let i = 0; i < maxLength; i++) {
                if (i < nodeListMismoBus.length) {
                    arrayBus.push(nodeListMismoBus[i].innerText);
                }

                if (i < nodeListSigBus.length) {
                    arrayBus.push(nodeListSigBus[i].innerText);
                }
            }
            return arrayBus;
        });


        //console.log(resultadoDeLasDosConsultas);

        //console.log("********************************")

        //console.log(siguienteBus);

        // paso los datos a una matriz
        const matriz = resultadoDeLasDosConsultas.map((bus) => {
            return bus.split('\n');
        });


        //console.log(matriz);


        // //ahora trabajo con la matriz

        const clave = ['bus', 'patente', 'tiempoEstimado', 'distancia']

        const resultado = [];



        for (let i = 0; i < matriz.length; i += 1) {
            const obj = {};
            obj[clave[0]] = matriz[i][0];
            obj[clave[1]] = matriz[i][1];
            obj[clave[2]] = matriz[i][2];
            obj[clave[3]] = matriz[i][3];
            resultado.push(obj);
        }

        console.log(resultado)

        // const json =JSON.stringify(resultado);

        // console.log(json)

        return resultado;

    } catch (error) {
        console.error(error);
    } finally {
        await browser.close();
    }

};





