import puppeteer from 'puppeteer';

export const devulveDatos = async (paradero) => {
    const browser = await puppeteer.launch({
        headless: false
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




        const bus = await page.evaluate(() => {

            const selectorMismoBus = '#proximo_solo_paradero';

            const nodeList = document.querySelectorAll(selectorMismoBus);

            let arrayBus = [];
            for (let item of nodeList) {
                arrayBus.push(item.innerText);
            }

            return arrayBus;

        });



        const siguienteBus = await page.evaluate(() => {

            const selectorSigBus = '#siguiente_respuesta'

            const nodeList = document.querySelectorAll(selectorSigBus);

            let arrayBusSig = [];
            for (let item of nodeList) {
                arrayBusSig.push(item.innerText);
            }

            return arrayBusSig;

        });



        console.log(bus);

        console.log("********************************")

        console.log(siguienteBus);

        //ahora trabajo con el array bus 

        const clave = ['bus', 'patente', 'tiempoEstimado', 'distancia']

        // const resultado = [];



        // for (let i = 0; i < bus.length; i += 1) {
        //     const obj = {};
        //     obj[clave[0]] = bus[i][0];
        //     obj[clave[1]] = bus[i][1];
        //     obj[clave[2]] = bus[i][2];
        //     obj[clave[3]] = bus[i][3];
        //     resultado.push(obj);
        // }

        //console.log(resultado)

        // const json =JSON.stringify(resultado);

        // console.log(json)

        return bus;

    } catch (error) {
        console.error(error);
    } finally {
        await browser.close();
    }

};





