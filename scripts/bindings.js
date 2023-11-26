// Disables all keyboard buttons. Cant use keyboard for navigating
window.addEventListener('keydown', function(e) {
	e.preventDefault();
});

// Disable lookAhead
Tone.context.lookAhead = 0;

var keyboardMap;
const notes = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]; // 0-11
const noteOct = [1,2,3,4,5,6,7,8,9]; // 0-8
let pitchNow = 0;
let octNow = 0;
let pianoMode = 0;

// Notes:
// - [Tab] key is middle C4
// - I'm adding [PageUp] key as secondary C6 optionally


// Combined mode, default
function bindingOctCom() {
	octNow=0;

	// Top row
	keyboardMap = {
		"Tab":"C4",
		"Digit1":"C#4",
		"KeyQ":"D4",
		"Digit2":"D#4",
		"KeyW":"E4",
		"KeyE":"F4",
		"Digit4":"F#4",
		"KeyR":"G4",
		"Digit5":"G#4",
		"KeyT":"A4",
		"Digit6":"A#4",
		"KeyY":"B4",
		"KeyU":"C5",
		"Digit8":"C#5",
		"KeyI":"D5",
		"Digit9":"D#5",
		"KeyO":"E5",
		"KeyP":"F5",
		"Minus":"F#5",
		"BracketLeft":"G5",
		"Equal":"G#5",
		"BracketRight":"A5",
		"Backspace":"A#5",
		"Backslash":"B5",
		"PageUp":"C6",
	};

	// Bottom row
	let keyboardMap2 = {
		"CapsLock":"D#3",
		"ShiftLeft":"E3",
		"KeyZ":"F3",
		"KeyS":"F#3",
		"KeyX":"G3",
		"KeyD":"G#3",
		"KeyC":"A3",
		"KeyF":"A#3",
		"KeyV":"B3",
		"KeyB":"C4",
		"KeyH":"C#4",
		"KeyN":"D4",
		"KeyJ":"D#4",
		"KeyM":"E4",
		"Comma":"F4",
		"KeyL":"F#4",
		"Period":"G4",
		"Semicolon":"G#4",
		"Slash":"A4",
		"Quote":"A#4",
		"ShiftRight":"B4",
	};

	Object.assign(keyboardMap, keyboardMap2);
}


// Separated mode
function bindingOctSep() {
	octNow=0;
	keyboardMap = {
		"Tab":"C4",
		"Digit1":"C#4",
		"KeyQ":"D4",
		"Digit2":"D#4",
		"KeyW":"E4",
		"KeyE":"F4",
		"Digit4":"F#4",
		"KeyR":"G4",
		"Digit5":"G#4",
		"KeyT":"A4",
		"Digit6":"A#4",
		"KeyY":"B4",
		"KeyU":"C5",
		"Digit8":"C#5",
		"KeyI":"D5",
		"Digit9":"D#5",
		"KeyO":"E5",
		"KeyP":"F5",
		"Minus":"F#5",
		"BracketLeft":"G5",
		"Equal":"G#5",
		"BracketRight":"A5",
		"Backspace":"A#5",
		"Backslash":"B5",
		"PageUp":"C6",
	};

	let keyboardMap2 = {
		"CapsLock":"D#2",
		"ShiftLeft":"E2",
		"KeyZ":"F2",
		"KeyS":"F#2",
		"KeyX":"G2",
		"KeyD":"G#2",
		"KeyC":"A2",
		"KeyF":"A#2",
		"KeyV":"B2",
		"KeyB":"C3",
		"KeyH":"C#3",
		"KeyN":"D3",
		"KeyJ":"D#3",
		"KeyM":"E3",
		"Comma":"F3",
		"KeyL":"F#3",
		"Period":"G3",
		"Semicolon":"G#3",
		"Slash":"A3",
		"Quote":"A#3",
		"ShiftRight":"B3",
	};

	Object.assign(keyboardMap, keyboardMap2);
}


function changePianoMode() {
	if (pianoMode == 0) {
		bindingOctSep();
		octNow=0;
		pianoMode=1;
		pitchNow = 0;
		document.getElementById('pianoModes').innerHTML = "Separated";
	} else if (pianoMode == 1) {
		bindingOctCom();
		octNow=0;
		pianoMode=0;
		pitchNow = 0;
		document.getElementById('pianoModes').innerHTML = "Combined";
	}
	document.getElementById('octaveMsg').innerHTML = octNow;
	document.getElementById('pitchMsg').innerHTML = pitchNow;
	barlinePiano();
}