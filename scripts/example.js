// Example whitespace song

let queued = 0;
let playLoop = 0;
let beat1 = 0;
let ref1 = 0;

function playWhitespace() {
	let ws = document.getElementById('wsbtn');
	let messages = document.getElementById('message');
	ws.setAttribute('onclick','stopWhitespace()');
	ws.innerHTML = "Stop song";
	if (playLoop==0) {
		messages.innerHTML = "Playing whitespace...";
	} else if (playLoop==1) {
		messages.innerHTML = "Repeating whitespace";
	}

	document.getElementById('wsbtnloop').style.display = "none";

	// prevent playWhitespace() played multiple times
	if (queued == 1) { return; }
	queued=1;

	// timing each notes
	let time1 = 200;
	let time2 = 280;
	let eachBeat = 580;

	async function playBeat1(note1, note2, note3, note01, note02, note03, noteLong, longTime) {
		// make arrangement notes, would be better with midi files
		// give async cause delayed setTimeout violation
		let _eachBeat=0;

		function playBeatFun() {

			function beatTime() {
				_eachBeat += eachBeat;
				return _eachBeat;
			}

			playNote2(note1, time1, note01, time2);
			setTimeout(playNote2, beatTime(), note2, time1, note02, time2);
			setTimeout(playNote2, beatTime(), note3, time1, note03, time2);
			setTimeout(playNote2, beatTime(), note1, time1, noteLong, longTime);
			setTimeout(playNote1, beatTime(), note2, time1);
			setTimeout(playNote1, beatTime(), note3, time1);
			


			// loop
			if (beat1 <= 2) {
				// if ref1 is finished, play another ref, and repeat beat
				if (beat1==1 && ref1==0) {
					// why beat=1 not beat=0? because playRef2() already executed below
					beat1=1;
					ref1=1;
					playRef2();
				} else if (beat1 <= 1) {
					beat1++;
					playBeat1(note1, note2, note3, note01, note02, note03, noteLong, longTime);
				// if playLoop=1 so reset all ref and repeat again
				} else if (beat1==2 && ref1==1 && playLoop==1) {
					beat1=0;
					ref1=0;
					playRef1();
				}
			}
		}
		await setTimeout(playBeatFun, (eachBeat*6));
	}
	playRef1();


	function playRef1() {
		playBeat1('Digit9', 'Digit8', 'KeyU', 'KeyS', 'KeyF', 'KeyH', 'KeyL', 1600);
	}
	function playRef2() {
		playBeat1('Digit8', 'KeyE', 'Digit5', 'KeyZ', 'KeyD', 'KeyH', 'Comma', 470);
	}
	



	// sounds
	async function playNote1(keyName, long) {

		// There are neat solution #2. See example below commented code

		attackSmp(synth, keyboardMap[keyName]);
		document.getElementById(keyName).classList.add("keypress");
		await setTimeout(function() {
			releaseSmp(synth, keyboardMap[keyName]);
			releaseAKey(keyName);
			document.getElementById(keyName).classList.remove("keypress");
		}, long);
	}
	async function playNote2(keyName, long, keyName2, long2) {
		attackSmp2(synth, keyboardMap[keyName], keyboardMap[keyName2]);
		document.getElementById(keyName).classList.add("keypress");
		document.getElementById(keyName2).classList.add("keypress");
		await setTimeout(function() {
			releaseSmp(synth, keyboardMap[keyName]);
			document.getElementById(keyName).classList.remove("keypress");
		}, long);
		await setTimeout(function() {
			releaseSmp(synth, keyboardMap[keyName2]);
			document.getElementById(keyName2).classList.remove("keypress");
		}, long2);
	}

	// This is example of neat solution #2, 
	// (Below is vry neat than above, right?
	// the cons : playing 2 notes at the same time would cause "out of sync" on slow devices)
	// 
	// function playNote1(keyName, long) {
	// 	pressAKey(keyName);
	// 	setTimeout(function() {
	// 		releaseAKey(keyName);
	// 	}, long);
	// }
	// function playNote2(keyName, long, keyName2, long2) {
	// 	pressTwoKey(keyName, keyName2);
	// 	setTimeout(function() {
	// 		releaseAKey(keyName);
	// 	}, long);
	// 	setTimeout(function() {
	// 		releaseAKey(keyName2);
	// 	}, long2);
	// }



	if (playLoop==0) {
		setTimeout(function(){
			queued=0;
			stopWhitespace();
		}, 19000);
	}
}


// simulate keypress, 
function pressAKey(keyName) {
	window.dispatchEvent(new KeyboardEvent('keydown', {'code':keyName} ));
}
function pressTwoKey(keyName, keyName2) {
	window.dispatchEvent(new KeyboardEvent('keydown', {'code':keyName} ));
	window.dispatchEvent(new KeyboardEvent('keydown', {'code':keyName2} ));
}
function releaseAKey(keyName) {
	window.dispatchEvent(new KeyboardEvent('keyup', {'code':keyName} ));
}

function stopWhitespace() {
	// reset all
	playLoop=0;
	queued=0;
	beat1=0;
	ref1=0;
	document.getElementById('wsbtnloop').style.display = "inline-block";
	let ws = document.getElementById('wsbtn');
	let messages = document.getElementById('message');
	ws.setAttribute('onclick','playWhitespace()');
	ws.innerHTML = "Play Whitespace!";
	messages.innerHTML = "";


	clearKeypress();

	// kill all voices
	synth.releaseAll();


	// create dummy setTimeout, to get last id
	var ids = window.setTimeout(function() {}, 0);

	// and clear from last 'id', decreases until id = -1;
	while (ids--) {
		window.clearTimeout(ids);
	}
}


function loopWhitespace() {
	playLoop=1;
	document.getElementById('wsbtnloop').style.display = "none";
	playWhitespace();
}


// try to leave page, stop whitespace
window.addEventListener('beforeunload', () => {
	stopWhitespace();
});