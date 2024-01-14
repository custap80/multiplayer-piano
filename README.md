# multiplayer-piano
Simple web piano server with multiplayer capability

> No sound FX by default, you can add FX manually like this example :
> ```
> // reverb fx
> const reverb = new Tone.Reverb({
>   decay: 3,
>   wet: 0.4,
>});
> // Use Tone.Destination from FX chain, so remove any toDestination() from sampler instrument
> sampler.chain(reverb, Tone.Destination);
> ```
> 

### Requirement
- NodeJS

### Setup commands
- `npm install`
- `node index.js`
