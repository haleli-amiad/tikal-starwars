const BASE_URL = "https://swapi.dev/api/";

export const swapiService = {
    initSwapi
}

// Root exported function for initializing data calculation 
async function initSwapi() {
    let swapi = JSON.parse(localStorage.getItem('swapi'));
    if (!swapi) {
        const planets = await getData('planets', 'residents')
        const vehicles = await getData('vehicles', 'pilots')
        swapi = await getDataForTable(planets, vehicles)
        swapi.chart = getDataForChart(planets)
        localStorage.setItem('swapi', JSON.stringify(swapi));
    }
    return swapi
}

// Filtering name & population of relevant planets
function getDataForChart(planets) {
    const planetsNames = ['Tatooine', 'Alderaan', 'Naboo', 'Bespin', 'Endor']
    return planets.filter(planet => planetsNames.includes(planet.name)).map(planet => planet = { name: planet.name, population: planet.population })
}

// Finalizing data calculation for the table
function getDataForTable(planets, vehicles) {
    const pilots = createPilotsMap(vehicles)
    const summed = sumPopulation(pilots, planets)
    return summed
}

// Function for creating data map of pilots, vehicles & planets
function createPilotsMap(data) {
    const pilots = [];
    data.map((vehicle) => pilots.push({ pilotsUrls: vehicle.pilots, vehicle: vehicle.name, populationSum: 0, planets: [], pilotNames: [] }))
    return pilots
}

// Adding planet data and summing relevant planets population
function sumPopulation(pilots, planets) {
    pilots.map(pilot => pilot.pilotsUrls.map(pilotUrl => planets.map(planet => {
        if (planet.residents.includes(pilotUrl) && planet.population !== 'unknown') {
            pilot.planets.push({ name: planet.name, population: planet.population })
            pilot.populationSum += +planet.population
        }
        return pilot
    })))
    return getLargestSum(pilots)
}

// Sorting by population size and return only relevant vehicle
function getLargestSum(pilots) {
    pilots.sort((a, b) => b.populationSum - a.populationSum)
    return getPilots(pilots[0])
}

// Querying for pilots names
async function getPilots(data) {
    await Promise.all(data.pilotsUrls.map(async pilot => {
        await fetch(pilot).then(response => response.json()).then(response => { data.pilotNames.push(response.name) })
    }))
    return data
}

// Reusable function for filtering data by array length (true or false)
function filterData(data, filterBy) {
    return data.filter(item => item[filterBy].length)
}

// Reusable function for fetching data from Swapi
async function fetchApi(data, prevData, next = null) {
    let url = next ? next : `${BASE_URL}${data}`
    return await fetch(url).then(response => response.json()).then(response => {
        return response = {
            next: response.next || null,
            data: prevData ? [...prevData, ...response.results] : response.results
        }
    })
}

// Reusable function for fetching data from Swapi & checking if there is a next page
async function getData(dataType, filterBy) {
    try {
        var result = await fetchApi(dataType)
        while (result.next) {
            result = await fetchApi(dataType, result.data, result.next)
        }
    } catch (error) {
        console.log('had issue getting data:', error);
    } finally {
        return filterData(result.data, filterBy)
    }
}