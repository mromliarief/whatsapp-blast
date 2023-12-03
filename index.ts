import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import axios from 'axios'

async function connectToWhatsApp () {
    const {state, saveCreds} = await useMultiFileAuthState('auth');
    const sock = makeWASocket({
        // can provide additional config here
        printQRInTerminal: true,
        auth: state
    })
    sock.ev.on('creds.update',saveCreds);
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if(shouldReconnect) {
                connectToWhatsApp()
            }
        } else if(connection === 'open') {
            console.log('opened connection')
        }
    })
    sock.ev.on('messages.upsert',async m => {
        const msg = m.messages[0];

        if(!msg.key.fromMe && m.type === 'notify'){

        }
        // console.log(JSON.stringify(m, undefined, 2))

        // console.log('replying to', m.messages[0].key.remoteJid)
        // await sock.sendMessage(m.messages[0].key.remoteJid!, { text: 'Hello there!' })
    })

    return sock;
}

async function blast(){

    const sockWa = await connectToWhatsApp();

    axios.get('https://script.google.com/macros/s/AKfycbyMEX-aHdpCOAiNSH4xybyLwYz4pmsYNlfCZkRMUAlrAXtB7w-STpOSyDDyMg0nrcjSnQ/exec')
        .then(async(response)=>{

        const data = response.data.data
        let x = 0;
        console.log("=== START ===");

        let interval = setInterval(async()=> {
            
            if(x< data.length){
                // console.log(data[x]);

                // mengirim hanya text
                // const str = `Halo Bapak/Ibu ${data[x].nama} Mitra Gojek Surabaya Raya.\nAnda mendapatkan undangan untuk pembelian jaket dengan harga diskon 99 ribu.\nSilakan datang langsung ke Kantor Gojek Surabaya, Jl. Ngagel No. 75 Surabaya.`

                // mengirim ke nomer whatsapp sendiri
                // await sockWa.sendMessage("628179291927@s.whatsapp.net", { text: str })

                // mengirim ke nomer whatsapp lain
                // await sockWa.sendMessage(data[x].whatsapp+"@s.whatsapp.net", { text: str })

                // console.log('MSG : '+str)

                // mengirim text dan image

                // mengirim ke nomer whatsapp sendiri
                // await sockWa.sendMessage("628179291927@s.whatsapp.net", { caption:'Halo warga Pacitan. Ada info menarik nih dari Gojek',image:{url:'images/Pendaftaran Gocar Pacitan.jpg'} })
                
                // mengirim ke nomer whatsapp lain
                // await sockWa.sendMessage(data[x].whatsapp+"@s.whatsapp.net", { caption:'Halo warga Pacitan. Ada info menarik nih dari Gojek',image:{url:'https://drive.google.com/drive/u/0/my-drive?q=type:image%20parent:0AJnUbyW6HKsPUk9PVA'} })

            }else{
                clearInterval(interval);
                console.log('=== STOP ===');
            }
            x++;

          },8000)

        
    })
}


// run in main file
// connectToWhatsApp()
blast()