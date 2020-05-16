import '../styles/index.scss';

var locationsJSON = require('./locations.json');

const N = 300;
let gData = [];

const weightColor = d3.scaleLinear()
    .domain([0, 60])
    .range(['lightblue', 'darkred'])
    .clamp(true);

fetch("https://pomber.github.io/covid19/timeseries.json")
    .then(response => response.json())
    .then(data => {
        let totalCases = 0;
        let totalRecovered = 0;
        for (let key of Object.keys(data)) {
            let country_info = locationsJSON.ref_country_codes.filter((item) => {
                if (item.country == key) {
                    return true;
                }
            });
            if (country_info.length == 0) {
                continue;
            }

            const totals = data[key].pop();

            for(let i = 0; i < data[key].length; i++)
            {
                totalCases += data[key].pop().confirmed;
            }

            for(let i = 0; i < data[key].length; i++)
            {
                totalRecovered += data[key].pop().recovered;
            }


            document.getElementById('total-cases').innerHTML = totalCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
            document.getElementById('total-recovered').innerHTML = totalRecovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            gData.push({
                lat: country_info[0].latitude,
                lng: country_info[0].longitude,
                size: Math.log(totals.confirmed) / 10,
                color: weightColor(totals.confirmed),
                names: country_info[0].country,
                totals: 'Confirmed: ' + totals.confirmed + '<br/>Deaths: ' + totals.deaths + '<br/>Recovered: ' + totals.recovered
            });
        }

        const world =
            Globe()
                .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg')
                .labelsData(gData)
                .labelText('names')
                .labelLabel('totals')
                .labelSize('size')
                .labelColor('color')
                .labelDotRadius('size')
                .labelAltitude(0.01)
                (document.getElementById('globeViz'));
                
        world.controls().autoRotate = true;
        world.controls().autoRotateSpeed = 1;

    });

