const BASE_URL = "https://swapi.dev/api/";

export const apiService = {
    initCalculation
}

async function initCalculation() {
    const planets = await getData('planets', 'residents')
    const vehicles = await getData('vehicles', 'pilots')
    const pilots = getPilotsMapped(vehicles)
    const winner = addPlanetData(pilots, planets)
}

function getPilotsMapped(vehicles) {
    const pilots = [];
    vehicles.map((vehicle) => pilots.push({ pilotUrls: vehicle.pilots, drivingOn: vehicle.name, populationSum: 0, planets: [] }))
    return pilots
}

function addPlanetData(pilots, planets) {
    pilots.map(pilot => pilot.pilotUrls.map(pilotUrl => planets.map(planet => {
        if (planet.residents.includes(pilotUrl) && planet.population !== 'unknown') {
            pilot.planets.push(planet)
            pilot.populationSum += +planet.population
        }
        return pilot
    })))
    return getLargestSum(pilots)
}

function getLargestSum(pilots) {
    pilots.sort((a, b) => b.populationSum - a.populationSum)
    return pilots[0]
}

async function fetchApi(data, prevData, next = null) {
    let url = next ? next : `${BASE_URL}${data}`
    return await fetch(url).then(response => response.json()).then(response => {
        return response = {
            next: response.next || null,
            data: prevData ? [...prevData, ...response.results] : response.results
        }
    })
}

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

function filterData(data, filterBy) {
    return data.filter(item => item[filterBy].length)
}