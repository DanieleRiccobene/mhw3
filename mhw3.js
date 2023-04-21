function autocompletePartenza(event)
{
    if(event.target.value==="")
    {
        resultP.classList.add("hidden");
    }else{
        getIataPart(event.target.value);
    }

}

function autocompleteDestinazione(event)
{
    if(event.target.value==="")
    {
        resultD.classList.add("hidden");
    }else{
        getIataDest(event.target.value);
    }
}

function onTokenJson(json){
    token = json;
    console.log(json);
}

function onTokenResponse(response){
    return response.json();
}

function onFlightJson(json)
{
    const flights = document.getElementById("flights");
    flights.innerHTML = '';
    console.log(json);
    datas = json.data;
    for(data of datas)
    {
        const flightsObtain = document.createElement('div');
        const flightsObtainDeparture = document.createElement('div');
        const flightsObtainReturn = document.createElement('div');
        const priceDiv = document.createElement('div');
        const price = document.createElement('p');
        const partenzaIata = document.createElement('p');
        const destIata = document.createElement('p');
        const partenzaIataR = document.createElement('p');
        const destIataR = document.createElement('p');
        
        flightsObtain.classList.add("flightResult");
        
        flights.appendChild(flightsObtain);
        
        flightsObtain.appendChild(flightsObtainDeparture);
        flightsObtain.appendChild(flightsObtainReturn);
        flightsObtain.appendChild(priceDiv);
        
        /*console.log(data.itineraries[0].segments[0].departure.iataCode);
        console.log(data.itineraries[1].segments[0].departure.at);
        console.log(data.itineraries[0].segments[0].arrival.iataCode);
        console.log(data.itineraries[1].segments[0].arrival.at);*/
                
        partenzaIata.textContent = 'Departure:' + data.itineraries[0].segments[0].departure.iataCode + ' ' + data.itineraries[0].segments[0].departure.at; 
        destIata.textContent = 'Arrival:' + data.itineraries[0].segments[0].arrival.iataCode + ' ' + data.itineraries[0].segments[0].arrival.at;
        partenzaIataR.textContent = 'Departure:' + data.itineraries[1].segments[0].departure.iataCode + ' ' + data.itineraries[1].segments[0].departure.at; 
        destIataR.textContent = 'Arrival:' + data.itineraries[1].segments[0].arrival.iataCode + ' ' + data.itineraries[1].segments[0].arrival.at;
        price.textContent = "€" + " " + data.price.total;

        icon = document.createElement('span');
        icon.classList.add("material-symbols-outlined");
        icon.textContent = "sync_alt";

        icon2 = document.createElement('span');
        icon2.classList.add("material-symbols-outlined");
        icon2.textContent = "sync_alt";

        flightsObtainDeparture.appendChild(partenzaIata);
        flightsObtainDeparture.appendChild(icon);
        flightsObtainDeparture.appendChild(destIata);
        
        flightsObtainReturn.appendChild(partenzaIataR);
        flightsObtainReturn.appendChild(icon2);
        flightsObtainReturn.appendChild(destIataR);
        priceDiv.appendChild(price);
    }
}

function onResponse(response){
    console.log("voli ottenuti");
    return response.json();
}

function onResponseIata(response){
    return response.json();
}

function selezionaAereoportoDest(event)
{
    d.value = event.target.textContent
    resultD.classList.add("hidden");
}

function selezionaAereoportoPart(event)
{
    p.value = event.target.textContent
    resultP.classList.add("hidden");
}

function onIataJsonPart(json)
{
    //console.log(json.data);
    const container = document.querySelector('#resultPart');
    
    container.classList.remove("hidden");
    let aeroportiConsigliati = "";
    container.innerHTML='';

    for(dati of json.data)
    {
        //console.log(dati.iataCode,dati.detailedName);
        aeroportiConsigliati += `<li>${dati.iataCode}</li>`;
    }
    container.innerHTML = `<ul> ${aeroportiConsigliati} </ul>`;

    const choice = document.getElementsByTagName('li');
    for (c of choice){
        c.addEventListener('click',selezionaAereoportoPart);
    }
}


function onIataJsonDest(json)
{
    //console.log(json.data);
    const container = document.querySelector('#resultDest');

    
    container.classList.remove("hidden");

    let aeroportiConsigliati = "";
    container.innerHTML='';
    
   
    for(dati of json.data)
    {
        //console.log(dati.iataCode,dati.detailedName);
        aeroportiConsigliati += `<li>${dati.iataCode}</li>`;
    }
    container.innerHTML = `<ul> ${aeroportiConsigliati} </ul>`;

    const choice = document.getElementsByTagName('li');

    for (c of choice){
        c.addEventListener('click',selezionaAereoportoDest);
    }
}

function getIataPart(city)
{
    let iata = airport_iata + "&keyword=" + city;
    fetch(iata,
        {
            headers:{
                'Authorization' : token.token_type + ' ' + token.access_token
            } 
        }).then(onResponseIata).then(onIataJsonPart);
}

function getIataDest(city)
{
    let iata = airport_iata + "&keyword=" + city;
    fetch(iata,
        {
            headers:{
                'Authorization' : token.token_type + ' ' + token.access_token
            } 
        }).then(onResponseIata).then(onIataJsonDest);
}

function search(event)
{
    //console.log(form);
    const partenza = document.querySelector('#formTextPartenza').value;
    const destinazione = document.querySelector('#formTextDestinazione').value;
    const dataPartenza = document.querySelector('input[name=dataPartenza]').value;
    const dataRitorno = document.querySelector('input[name=dataRitorno] ').value;
    const numAdulti = document.querySelector('input[name=numeroAdulti').value;
    const tipoVolo = document.querySelector('#formSel').value;
    /*
    const text = encodeURIComponent(partenza);
    const text2 = encodeURIComponent(destinazione);
    console.log(text);
    console.log(text2);
    console.log(dataPartenza);*/

    

    const flightRequest = flight_endpoint + '?originLocationCode=' + partenza + '&destinationLocationCode=' + destinazione + '&departureDate=' + dataPartenza + '&returnDate=' + dataRitorno + '&adults=' + 
    numAdulti + "&travelClass=" + tipoVolo + "&max=10";
    /*AUTORIZZAZIONE OAUTH*/
    fetch(flightRequest,
        {
            headers:{
                'Authorization' : token.token_type + ' ' + token.access_token
            } 
        }).then(onResponse).then(onFlightJson);
}

const flight_endpoint_token = "https://test.api.amadeus.com/v1/security/oauth2/token";
const flight_endpoint = "https://test.api.amadeus.com/v2/shopping/flight-offers";
const airport_iata = "https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY";
const key_client = "QQz3qfAWCdthb3ealgDAfQABtWMybevx";
const key_secret = "9SX5xGTtmc7ji6XG";


const resultP = document.getElementById("resultPart");
const resultD = document.getElementById("resultDest");

/*RICHIESTA TOKEN PER OAUTH*/
let token;
fetch(flight_endpoint_token,
    {
        method: "post",
        body : 'grant_type=client_credentials&client_id=' + key_client + '&client_secret=' + key_secret,
        headers :{
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
    }).then(onTokenResponse).then(onTokenJson);

/*PER DIFFERENZIARE GLI AEROPORTI SE UNA CITTA HA PIU DI UN AEROPORTO*/
    const p = document.getElementById("formTextPartenza");
    p.addEventListener("keyup",autocompletePartenza);
    const d = document.getElementById("formTextDestinazione");
    d.addEventListener("keyup",autocompleteDestinazione);

const form = document.querySelector('form');
const cercaVoli = document.querySelector('div#searchFlight');
cercaVoli.addEventListener('click',search);