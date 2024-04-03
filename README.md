# multiplayer-piano
Simple web piano server with multiplayer capability

> This project actually same from instr. The difference is only the multiplayer feature


You can add sound effects like this reverb example :
> ```
> // reverb fx
> const reverb = new Tone.Reverb({
>   preDelay: 0.07,
>   decay: 3,
>   wet: 0.4,
>});
> // Use Tone.Destination inside instrument chain, no need to use toDestination()
> sampler.chain(reverb, Tone.Destination);
> ```
> Read more on [Tonejs docs](https://tonejs.github.io/docs)

### Requirement
- NodeJS

### Setup commands
- `npm install`
- `node index.js`
