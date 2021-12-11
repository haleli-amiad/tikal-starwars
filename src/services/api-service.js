const BASE_URL = "https://swapi.dev/api/";

export const apiService = {
    initSwapi
}

// Root & exported function for initializing calculation 
async function initSwapi() {
    const planets = await getData('planets', 'residents')
    const vehicles = await getData('vehicles', 'pilots')
    const data = await getDataForTable(planets, vehicles)
    data.chart = getDataForChart(planets)
    return data
}

// Filtering name & population of relevant planets
function getDataForChart(planets) {
    const planetsNames = ['Tatooine', 'Alderaan', 'Naboo', 'Bespin', 'Endor']
    return planets.filter(planet => planetsNames.includes(planet.name)).map(planet => planet = { name: planet.name, population: planet.population })
}

// Finalizing data calculation for the table
async function getDataForTable(planets, vehicles) {
    const pilots = createPilotsMap(vehicles)
    const summed = await sumPopulation(pilots, planets)
    return summed
}

// Fetching pilots names
async function getPilots(data) {
    await Promise.all(data.pilotsUrls.map(async pilot => {
        await fetch(pilot).then(response => response.json()).then(response => { data.pilotNames.push(response.name) })
    }))
    return data
}

// Function for creating data map of pilots, vehicles & planets
function createPilotsMap(data) {
    const pilots = [];
    data.map((vehicle) => pilots.push({ pilotsUrls: vehicle.pilots, drivingOn: vehicle.name, populationSum: 0, planets: [], pilotNames: [] }))
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

// Sorting by population in order to find the relevant vehicle
function getLargestSum(pilots) {
    pilots.sort((a, b) => b.populationSum - a.populationSum)
    return getPilots(pilots[0])
}

// Reusable function for filtering data by array length (true or false)
function filterData(data, filterBy) {
    return data.filter(item => item[filterBy].length)
}

// Reusable function for fetching data from swapi
async function fetchApi(data, prevData, next = null) {
    let url = next ? next : `${BASE_URL}${data}`
    return await fetch(url).then(response => response.json()).then(response => {
        return response = {
            next: response.next || null,
            data: prevData ? [...prevData, ...response.results] : response.results
        }
    })
}

// Reusable function for fetching data from swapi & checking if there is another page, storing to localstorage
async function getData(dataType, filterBy) {
    let result = JSON.parse(localStorage.getItem(dataType));
    if (!result) {
        try {
            result = await fetchApi(dataType)
            while (result.next) {
                result = await fetchApi(dataType, result.data, result.next)
            }
        } catch (error) {
            console.log('had issue getting data:', error);
        } finally {
            result.data = filterData(result.data, filterBy)
            localStorage.setItem(dataType, JSON.stringify(result.data));
            return result.data
        }
    }
    return result
}