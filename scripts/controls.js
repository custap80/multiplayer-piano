// Octave, Pitch, ADSR, Socket Transport
// Mouse mapping, Keyboard mapping, Display control, Mobile mode



// -------------------------------------------------------------------------------------------------
// there is no built-in octave control in Tone.js
// so made own octave function
// -------------------------------------------------------------------------------------------------
function octaveUp(limit=1) {
	if (octNow >= limit) {
		return;
	}
	let keyboardTemp = {};

	for (const prop in keyboardMap) {
		for (var i=0; i<notes.length; i++) {
			for (var j=0; j<noteOct.length; j++) {
				if (keyboardMap[prop] === notes[i]+noteOct[j]) {
					let resultn = notes[i]+(noteOct[j]+1);
					keyboardTemp[prop] = resultn;
				}
			}
		}
	}
	Object.assign(keyboardMap, keyboardTemp);
	octNow++;
	document.getElementById('octaveMsg').innerHTML = octNow;
	console.log("Octave up : "+octNow);
	barlinePiano();
}

function octaveDown(limit=1) {
	if (octNow <= -limit) {
		return;
	}
	let keyboardTemp = {};

	for (const prop in keyboardMap) {
		for (var i=notes.length; i>=0; i--) {
			for (var j=noteOct.length; j>=0; j--) {
				if (keyboardMap[prop] === notes[i]+noteOct[j]) {
					let resultn = notes[i]+(noteOct[j]-1);
					keyboardTemp[prop] = resultn;
				}
			}
		}
	}
	Object.assign(keyboardMap, keyboardTemp);
	octNow--;
	document.getElementById('octaveMsg').innerHTML = octNow;
	console.log("Octave down : "+octNow);
	barlinePiano();
}

// debug purpose
function zeroOct() {
	octNow=0;
	document.getElementById('octaveMsg').innerHTML = octNow;
}


// -------------------------------------------------------------------------------------------------
// note pitch
// -------------------------------------------------------------------------------------------------
function pitchUp() {
	if (pitchNow >= 12) {
		return;
	}
	let keyboardTemp = {};

	for (const prop in keyboardMap) {
		for (var i=0; i<notes.length; i++) {
			for (var j=0; j<noteOct.length; j++) {
				if (keyboardMap[prop] === notes[i]+noteOct[j]) {
					keyboardTemp[prop] = notes[i+1]+noteOct[j];
					if (keyboardMap[prop] == "B"+noteOct[j]) {
						keyboardTemp[prop] = "C"+noteOct[j+1];
					}
				}
			}
		}
	}

	Object.assign(keyboardMap, keyboardTemp);
	pitchNow++;
	document.getElementById('pitchMsg').innerHTML = pitchNow;
	console.log("Pitch up : "+pitchNow);
	barlinePiano();
}

function pitchDown() {
	if (pitchNow <= -12) {
		return;
	}
	let keyboardTemp = {};

	for (const prop in keyboardMap) {
		for (var i=0; i<notes.length; i++) {
			for (var j=0; j<noteOct.length; j++) {
				if (keyboardMap[prop] === notes[i]+noteOct[j]) {
					keyboardTemp[prop] = notes[i-1]+noteOct[j];
					if (keyboardMap[prop] == "C"+noteOct[j]) {
						keyboardTemp[prop] = "B"+noteOct[j-1];
					}
				}
			}
		}
	}

	Object.assign(keyboardMap, keyboardTemp);
	pitchNow--;
	document.getElementById('pitchMsg').innerHTML = pitchNow;
	console.log("Pitch down : "+pitchNow);
	barlinePiano();
}




// -------------------------------------------------------------------------------------------------
// ADSR Controls
// -------------------------------------------------------------------------------------------------
// Socket Transport - With socket
function playSample(instrument, noteName) {
	instrument.triggerAttackRelease(noteName, 2);
	setPianoDisplay(noteName);
}
function attackSmp(instrument, noteName) {
	socket.emit('note on', noteName);
	sendAttack(instrument, noteName);
	// console.log('Note on : '+noteName1);
}
function attackSmp2(instrument, noteName1, noteName2) {
	setPianoDisplay(noteName1);
	setPianoDisplay(noteName2);
	instrument.triggerAttack([noteName1, noteName2]);
}
function releaseSmp(instrument, noteName) {
	socket.emit('note off', noteName);
	sendRelease(instrument, noteName);
	// console.log('Note off : '+noteName2);
}




// -------------------------------------------------------------------------------------------------
// Socket Transport
// -------------------------------------------------------------------------------------------------
socket.on('note on', function(pnote) {
	sendAttack(sampler, pnote);
});
socket.on('note off', function(pnote) {
	sendRelease(sampler, pnote);
});
socket.on('kbd on', function(keyId) {
	showKbdDisplayServ(keyId);
});
socket.on('kbd off', function(keyId) {
	remvKbdDisplayServ(keyId);
});

// Socket Transport - No socket
function sendAttack(instrument, noteName) {
	instrument.triggerAttack(noteName);
	setPianoDisplay(noteName);
}
function sendRelease(instrument, noteName) {
	instrument.triggerRelease(noteName);
	removePianoDisplay(noteName);
}




// -------------------------------------------------------------------------------------------------
// Mouse mapping
// -------------------------------------------------------------------------------------------------
let mouseHold = false;
let _mouseNote;
let invisibleKeys=[];
// get property-name only from object
const keyObj = Object.keys(keyboardMap);
function mouseMap(instrument) {
	document.getElementById('keyBase').addEventListener("mousedown", () => {
		mouseHold = true;
	});
	keyObj.forEach((keyName, keyNote) => {
		try {
			let keyId = document.getElementById(keyName);
			// first time note on
			keyId.addEventListener("mousedown", () => {
				showKbdDisplay(keyName);
				attackSmp(instrument, keyboardMap[keyName]);
				_mouseNote = keyboardMap[keyName];
			});
			
			// when mouse is dragged, do note on and off definitely
			keyId.addEventListener("mouseenter", () => {
				if (mouseHold) {
					showKbdDisplay(keyName);
					attackSmp(instrument, keyboardMap[keyName]);
					_mouseNote = keyboardMap[keyName];
				}
			});

			keyId.addEventListener("mouseleave", () => {
				if (mouseHold) {
					remvKbdDisplay(keyName);
					releaseSmp(instrument, keyboardMap[keyName]);
				}
			});

			// mouse unclicked
			keyId.addEventListener("mouseup", () => {
				remvKbdDisplay(keyName);
				releaseSmp(instrument, keyboardMap[keyName]);
			});
		} catch(e) {
			// Invisible keys
			console.log("key : "+keyboardMap[keyName]+" ["+keyName+"] invisible");
			invisibleKeys.push(keyName);
		}
	});

	// release all samples attached on window instead of id=keyBase
	window.addEventListener('mouseup', () => {
		mouseHold = false;
		// resetDisplays();
		releaseSmp(instrument, _mouseNote);
		// instead of releasing individual note, so kill all notes!
		instrument.releaseAll();
	});
	console.log('Mouse Mapped');
}

function resetDisplays() {
	const allKeysId = document.querySelectorAll('.key');
	allKeysId.forEach(keys => {
		remvKbdDisplay(keyName);
	});
}




// -------------------------------------------------------------------------------------------------
// Keyboard mapping
// -------------------------------------------------------------------------------------------------

var keysPressed = [];
var noKey=0;
let keybFin=false;
function keyboardMapping(instrument) {
	// if (keybFin==true){return;}
	// keybFin=true;

	window.addEventListener("keydown", e => {
		let keyVal = e.code;

		// prevent repeated keys when hold
		if (e.repeat || !(keyboardMap[keyVal])) { return; }
		var i = keysPressed.length;
		while(i--) {
			if(keysPressed[i]==keyVal) {
				return false;	
		    }
		} keysPressed.push(keyVal);

		try {
			attackSmp(instrument, keyboardMap[keyVal]);
			noKey=0;

			if (!invisibleKeys.includes(keyVal)) {
				let keyId = document.getElementById(keyVal);
				showKbdDisplay(keyVal);
			}
		} catch(err) {
			noKey=1;
		}
		// console.log('Online : '+keysPressed);
	});


	window.addEventListener("keyup", e => {
		let keyVal = e.code;

		// Various error prevention
		if (noKey==1 || !(keyboardMap[keyVal])) { return; }
		var j = keysPressed.length;
		while(j--) {
			if(keysPressed[j]==keyVal) {
				keysPressed.splice(j, 1);
			}
		}

		releaseSmp(instrument, keyboardMap[keyVal]);

		if (!invisibleKeys.includes(keyVal)) {
			let keyId = document.getElementById(keyVal);
			remvKbdDisplay(keyVal);
		}
		// console.log('Online : '+keysPressed);
	});
}



// -------------------------------------------------------------------------------------------------
// Display control
// -------------------------------------------------------------------------------------------------
let hidek = false;
let hidep = false;
function keyboardSwitch() {
	let element = document.getElementById('hideKeyboard');
	if (hidek) {
		element.innerHTML = "Hide Keyboard";
		document.getElementById('keyBase').classList.remove("d-none");
		hidek = false;
	} else {
		element.innerHTML = "Show Keyboard";
		document.getElementById('keyBase').classList.add("d-none");
		hidek = true;
	}
}

function pianoSwitch() {
	let element = document.getElementById('hidePiano');
	if (hidep) {
		element.innerHTML = "Hide Piano";
		document.getElementById('content').classList.remove("d-none");
		hidep = false;
	} else {
		element.innerHTML = "Show Piano";
		document.getElementById('content').classList.add("d-none");
		hidep = true;
	}
}

function showKbdDisplay(keyId) {
	socket.emit('kbd on', keyId);
	showKbdDisplayServ(keyId);
}
function remvKbdDisplay(keyId) {
	socket.emit('kbd off', keyId);
	remvKbdDisplayServ(keyId);
}
function showKbdDisplayServ(keyId) {
	document.getElementById(keyId).classList.add("transite-0");
	document.getElementById(keyId).classList.add("keypress");
}
function remvKbdDisplayServ(keyId) {
	document.getElementById(keyId).classList.remove("keypress");
	document.getElementById(keyId).classList.remove("transite-0");
}





// -------------------------------------------------------------------------------------------------
// Mobile mode
// -------------------------------------------------------------------------------------------------

let _fullScr = 0;
function fullScr() {
	let pianoContainer = document.querySelector('tone-piano').shadowRoot.querySelector('#container').querySelector('tone-keyboard').shadowRoot.querySelector('#container');
	let _tonePiano = document.querySelector('tone-piano');
	let contentSC = document.getElementById('content-scroll');
	let contentAG = document.getElementById('content');
	contentAG.classList.remove('d-none');
	let pianoWidth = contentAG.offsetWidth;

	if (_fullScr == 0) {
		contentSC.style.width = screen.width+"px";
		contentAG.classList.add("full-scr");
		_tonePiano.style.width = pianoWidth+"px";
		pianoContainer.style.height = (document.documentElement.clientHeight-34-50)+"px";
		pianoContainer.style.maxHeight = "10rem";

		const divDrag = document.createElement("div");
		const textd = document.createTextNode("<- Drag ->");
		divDrag.appendChild(textd);
		divDrag.setAttribute('id', 'divScroll');
		divDrag.style.width = pianoWidth+"px";
		divDrag.style.height = "45px";
		divDrag.style.textAlign = "center";
		divDrag.style.verticalAlign = "bottom";
		divDrag.style.display = "flex";
		divDrag.style.justifyContent = "space-between";
		divDrag.style.alignItems = "center";
		divDrag.style.fontFamily = "monospace";
		contentAG.insertBefore(divDrag, document.querySelector('tone-piano'));

		const span = document.createElement('div');
		divDrag.appendChild(span);

		const closeMobile = document.createElement('button');
		const textClose = document.createTextNode('Close mobile mode');
		closeMobile.setAttribute('onclick', 'fullScr()');
		closeMobile.appendChild(textClose);
		divDrag.insertBefore(closeMobile, divDrag.firstChild);

		document.body.classList.add('fixed');

		_fullScr = 1;
	} else {
		contentSC.style.width = "auto";
		_tonePiano.style.width = "auto";
		contentAG.classList.remove("full-scr");
		pianoContainer.removeAttribute('style');
		document.getElementById('divScroll').remove();
		document.body.classList.remove('fixed');

		_fullScr = 0;
	}
}