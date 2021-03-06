import '../styles/index.scss';

var locationsJSON = require('./locations.json');

let gData = [];

function numFormat(num)
{
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const weightColor = d3.scaleLinear()
    .domain([0, 60])
    .range(['lightblue', 'darkred'])
    .clamp(true);

fetch("https://api.thevirustracker.com/free-api?global=stats")
    .then(response => response.json())
    .then(data => {
        let totalCases = 0;
        let totalRecovered = 0;
        let totalDeaths = 0;
   
        totalCases = data['results'][0].total_cases;
        totalRecovered = data['results'][0].total_recovered;
        totalDeaths = data['results'][0].total_deaths;

        // document.getElementById('total-cases').innerHTML = numFormat(totalCases);
        // document.getElementById('total-recovered').innerHTML = numFormat(totalRecovered);
        // document.getElementById('total-deaths').innerHTML = numFormat(totalDeaths);
    });
    
fetch("https://api.covid19api.com/summary")
    .then(response => response.json())
    .then(data => {
        for (let info of data['Countries']) {
            let country_info = locationsJSON.ref_country_codes.filter((item) => {
                if (item.country == info.Country) {
                    return true;
                }
            });

            if (country_info.length == 0) {
                continue;
            }  
            
            // if(info.TotalRecovered == 0)
            // {
            //     console.log("0");
            //     gData.push({
            //         totals: 'Confirmed: ' + numFormat(info.TotalConfirmed) + '<br/>Deaths: ' + numFormat(info.TotalDeaths)
            //     });
            //     continue;
            // }
            
            gData.push({
                lat: country_info[0].latitude,
                lng: country_info[0].longitude,
                size: Math.log(info.TotalConfirmed) / 13,
                color: weightColor(info.TotalDeaths),
                names: country_info[0].country,
                totals: 'Confirmed: ' + numFormat(info.TotalConfirmed) + '<br/>Deaths: ' + numFormat(info.TotalDeaths) + '<br/>Recovered: ' + numFormat(info.TotalRecovered)
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
        world.controls().autoRotateSpeed = .25;
    });

    const globeMaterial = world.globeMaterial();
    globeMaterial.bumpScale = 10;
    new THREE.TextureLoader().load('//unpkg.com/three-globe/example/img/earth-water.png', texture => {
      globeMaterial.specularMap = texture;
      globeMaterial.specular = new THREE.Color('grey');
      globeMaterial.shininess = 15;
    });