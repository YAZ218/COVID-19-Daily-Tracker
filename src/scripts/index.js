import '../styles/index.scss';

console.log('webpack starterkift');


var locationsJSON = require('./locations.json');

// Gen random data
const N = 300;
let gData = [];

// lat: (Math.random() - 0.5) * 180,
// lng: (Math.random() - 0.5) * 360,
// size: Math.random() / 3,
// color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]
const weightColor = d3.scaleLinear()
.domain([0, 60])
.range(['lightblue', 'darkred'])
.clamp(true);

fetch("https://pomber.github.io/covid19/timeseries.json")
.then(response => response.json())
.then(data => {
    for(let key of Object.keys(data)){
        let country_info = locationsJSON.ref_country_codes.filter((item) => {
            if(item.country == key){
                return true;
            }
        }); 

        if(country_info.length == 0){
            console.log(key);
            continue;
        }

        const totals = data[key].pop();

        gData.push({
            lat: country_info[0].latitude,
            lng: country_info[0].longitude,
            size: Math.log(totals.confirmed) / 10,
            color: weightColor(totals.confirmed),
            names: country_info[0].country,
            totals: 'Confirmed: ' + totals.confirmed + '<br/>Deaths: ' + totals.deaths + '<br/>Recovered: ' + totals.recovered
        });
    }


    Globe()
    .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg')
    .labelsData(gData)
    .labelText('names')
    .labelLabel('totals')
    .labelSize('size')
    .labelColor('color')
    .labelDotRadius('size')
    (document.getElementById('globeViz'));
});





