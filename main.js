const map = L.map('map').setView([-2.5290, -44.3014], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let userMarker;
let routingControl;

function addPostosToMap(postos, userLocation) {
    const postosDiv = document.getElementById('postos');
    postosDiv.innerHTML = '';

    postos.forEach(posto => {
        const marker = L.marker([posto.latitude, posto.longitude]).addTo(map);
        marker.bindPopup(`${posto.nome}`);

        const postoItem = document.createElement('div');
        postoItem.className = 'posto-item';
        postoItem.textContent = `${posto.nome} (${posto.latitude}, ${posto.longitude})`;

        const routeButton = document.createElement('button');
        routeButton.className = 'button';
        routeButton.textContent = 'Traçar Rota';
        routeButton.onclick = () => {
            createRoute([userLocation.lat, userLocation.lng], [posto.latitude, posto.longitude]);
        };

        const shareButton = document.createElement('button');
        shareButton.className = 'button';
        shareButton.textContent = 'Compartilhar';
        shareButton.onclick = () => {
            shareLocation(posto);
        };

        postoItem.appendChild(routeButton);
        postoItem.appendChild(shareButton);
        postosDiv.appendChild(postoItem);
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocalização não é suportada por este navegador.");
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    if (userMarker) {
        map.removeLayer(userMarker);
    }
    userMarker = L.marker([lat, lon]).addTo(map).bindPopup("Você está aqui!").openPopup();
    map.setView([lat, lon], 15);

    const userLocation = { lat, lng: lon };

    // Chamada ao backend para calcular a rota mais próxima
    fetch('/calcular-rota/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userLocation)
    })
    .then(response => response.json())
    .then(data => {
        const nearestPosto = data.nearestPosto;

        // Exibe os postos no mapa e o posto mais próximo
        addPostosToMap(data.postos, userLocation);
        const nearestPostoDiv = document.getElementById('nearest-posto');
        nearestPostoDiv.textContent = `Posto mais próximo: ${nearestPosto.nome} - Distância: ${nearestPosto.distance.toFixed(2)} km`;
    })
    .catch(error => {
        console.error('Erro ao calcular rota:', error);
    });
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("Usuário negou a solicitação de Geolocalização.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("A localização do usuário não está disponível.");
            break;
        case error.TIMEOUT:
            alert("A solicitação para obter a localização do usuário expirou.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Um erro desconhecido ocorreu.");
            break;
    }
}

function createRoute(start, end) {
    if (routingControl) {
        map.removeControl(routingControl);
    }
    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(start[0], start[1]),
            L.latLng(end[0], end[1])
        ],
        routeWhileDragging: true,
        geocoder: L.Control.Geocoder.nominatim()
    }).addTo(map);
}

function shareLocation(posto) {
    const shareData = {
        title: 'Localização do Posto',
        text: `Posto: ${posto.nome}\nLatitude: ${posto.latitude}\nLongitude: ${posto.longitude}`,
        url: `https://www.google.com/maps/search/?api=1&query=${posto.latitude},${posto.longitude}`
    };
    navigator.share(shareData).catch(err => console.error('Erro ao compartilhar:', err));
}

// Iniciar localização do usuário
getLocation();
