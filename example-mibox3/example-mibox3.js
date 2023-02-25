import {
    AndroidRemote,
    RemoteKeyCode,
    RemoteDirection
} from "androidtv-remote";

import Readline from "readline";
import keypress from "keypress";

let line = Readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let host = "192.168.10.32";
let options = {
    pairing_port : 6467,
    remote_port : 6466,
    name : 'androidtv-remote',
}

let androidRemote = new AndroidRemote(host, options)

androidRemote.on('secret', () => {
    line.question("Code : ", async (code) => {
        androidRemote.sendCode(code);
    });
});

androidRemote.on('powered', (powered) => {
    console.debug("Powered : " + powered)
});

androidRemote.on('volume', (volume) => {
    console.debug("Volume : " + volume.level + '/' + volume.maximum + " | Muted : " + volume.muted);
});

androidRemote.on('current_app', (current_app) => {
    console.debug("Current App : " + current_app);
});

androidRemote.on('error', (error) => {
    console.error("Error : " + error);
});

androidRemote.on('unpaired', () => {
    console.error("Unpaired");
});

androidRemote.on('ready', async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    let cert = androidRemote.getCertificate();

    keypress(process.stdin);
    process.stdin.on('keypress', function (ch, key) {
	// console.log('got "keypress"', key);
	if (key && key.ctrl && key.name == 'c') {
	    console.log('got "keypress"', key);
            process.stdin.pause();
	}
	if (key && !key.shift && key.name == 'up') { androidRemote.sendKey(RemoteKeyCode.KEYCODE_DPAD_UP, RemoteDirection.SHORT); }
	if (key && !key.shift && key.name == 'down') { androidRemote.sendKey(RemoteKeyCode.KEYCODE_DPAD_DOWN, RemoteDirection.SHORT); }
	if (key && !key.shift && key.name == 'left') { androidRemote.sendKey(RemoteKeyCode.KEYCODE_DPAD_LEFT, RemoteDirection.SHORT); }
	if (key && !key.shift && key.name == 'right') { androidRemote.sendKey(RemoteKeyCode.KEYCODE_DPAD_RIGHT, RemoteDirection.SHORT); }
	if (key && key.name == 'return') { androidRemote.sendKey(RemoteKeyCode.KEYCODE_DPAD_CENTER, RemoteDirection.SHORT); }
	if (key && key.name == 'backspace') { androidRemote.sendKey(RemoteKeyCode.KEYCODE_BACK, RemoteDirection.SHORT); }
	if (key && key.name == 'space') { androidRemote.sendKey(RemoteKeyCode.KEYCODE_HOME, RemoteDirection.SHORT); }
	if (key && key.shift && key.name == 'up') { androidRemote.sendKey(RemoteKeyCode.KEYCODE_VOLUME_UP, RemoteDirection.SHORT); }
	if (key && key.shift && key.name == 'down') { androidRemote.sendKey(RemoteKeyCode.KEYCODE_VOLUME_DOWN, RemoteDirection.SHORT); }
    });

    process.stdin.setRawMode(true);
    process.stdin.resume();

});

let started = await androidRemote.start();










