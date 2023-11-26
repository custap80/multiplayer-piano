// slider controls
let lineAt;
try {


lineAt=1;
let volSlider = document.getElementById("volumeOut");
let volOut = document.getElementById("volumeOutDis");
volOut.innerHTML = volSlider.value;
sampler.volume.value = volSlider.value;

volSlider.oninput = function() {
	let sliderRes = volSlider.value;
	volOut.innerHTML = sliderRes;
	sampler.volume.value = sliderRes;
}


lineAt=2;
let revWetSlider = document.getElementById("reverbWet");
let revWet = document.getElementById("reverbWetDis");
revWet.innerHTML = revWetSlider.value*10;
reverb.set({ wet: revWetSlider.value/10, });

revWetSlider.oninput = function() {
	let sliderRes = revWetSlider.value/10;
	revWet.innerHTML = sliderRes*100;
	reverb.set({ wet: sliderRes, });
}

lineAt=3;
let revTimeSlider = document.getElementById("reverbTime");
let revTime = document.getElementById("reverbTimeDis");
revTime.innerHTML = revTimeSlider.value;
reverb.set({ decay: revTimeSlider.value, });

revTimeSlider.oninput = function() {
	let sliderRes = revTimeSlider.value;
	revTime.innerHTML = sliderRes;
	reverb.set({ decay: sliderRes, });
}


} catch (e) {
	console.log("FX not loaded on channel "+lineAt);
}