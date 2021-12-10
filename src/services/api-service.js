const BASE_URL = "https://swapi.dev/api/";

export const apiService = {
    // getVehicles,
    getData
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
            localStorage.setItem(dataType, JSON.stringify(result));
        }
    }
    console.log(result);
    return result
}

// async function getVehicles() {
//     let vehicles = JSON.parse(localStorage.getItem('vehicles'));
//     if (!vehicles) {
//         try {
//             vehicles = await fetchApi('vehicles')
//             while (vehicles.next) {
//                 vehicles = await fetchApi('vehicles', vehicles.data, vehicles.next)
//             }
//         } catch (error) {
//             console.log('had issue getting data:', error);
//         } finally {
//             vehicles = getVehiclesWithPilots(vehicles.data)
//             localStorage.setItem('vehicles', JSON.stringify(vehicles));
//         }
//     }
//     return vehicles
// }

// function getVehiclesWithPilots(vehicles) {
//     return vehicles.filter(vehicle => vehicle.pilots.length)
// }

function filterData(data, filterBy) {
    return data.filter(item => item[filterBy].length)
}