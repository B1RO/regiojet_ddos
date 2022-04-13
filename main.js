import fetch from 'node-fetch'
import notifier from 'node-notifier'
import path from "path";
import prompt_sync from "prompt-sync";
import fs from "fs";

var prompt = prompt_sync();



let locations = " https://brn-ybus-pubapi.sa.cz/restapi/consts/locations"

let cities = await fetch(locations).then(x=>x.json())
console.dir(cities.flatMap(x=>x.cities).map(x=>x.name + " : " + x.id),  {'maxArrayLength': null})
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
let searchURL = `https://brn-ybus-pubapi.sa.cz/restapi/routes/search/simple?tariffs=REGULAR&toLocationType=CITY&toLocationId=${config.toLocationID}&fromLocationType=CITY&fromLocationId=${config.fromLocationID}&departureDate=${config.date}`
const connectionsOInterest = await fetch(searchURL).then(x=>x.json())
console.log(connectionsOInterest.routes.map(x=>x.departureTime + " : " + x.id))
const routeInterestID = prompt("Zadej id casu odjezdu, ktery ti vyhovuje\n")

let loop = 0;
setInterval(async ()=>{
    await fetch(searchURL).then(x=>x.json()).then(x=>{
        let entryOfInterest = x.routes.filter(y=>y.id===routeInterestID)[0];
        if(entryOfInterest.freeSeatsCount > 0)
        {
// Object
            notifier.notify({
                title: "Uvolnila se jizdenkaa",
                message: 'Sup sup sup sup do praceeee spechej volnaa jizdenkaaa',
                icon: path.join('./favicon.ico'), // Absolute path (doesn't work on balloons)
                sound: true,
            });

        }
    })




}, 1000)
