// Retrieve values from sessionStorage
const latitude = sessionStorage.getItem('latitude');
const longitude = sessionStorage.getItem('longitude');

// Use the values as needed
console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

// displaying latitude and longitude
const lat = document.getElementById('lat')
const long = document.getElementById('long')

lat.innerHTML = `Lat: ${latitude}`
long.innerHTML = `Long: ${longitude}`


// Map
const map = document.getElementById('map')
const mapDiv = document.createElement('div')
mapDiv.className = 'mapDiv'

mapDiv.innerHTML = `
    <iframe src="https://maps.google.com/maps?q=${latitude}, ${longitude}&output=embed" width="1250" height="600" frameborder="0" style="border:0"></iframe>
`
map.appendChild(mapDiv)



// Making api call

const API_KEY ='49cc8c821cd2aff9af04c9f98c36eb74';

getWeatherData();

function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        async function getCityName(latitude, longitude) {
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
              method: 'GET',
              headers: {
                'User-Agent': 'YourApp', // Provide a user agent to comply with Nominatim usage policy
              },
            });

            if (!response.ok) {
              throw new Error(`Failed to fetch data from Nominatim API: ${response.statusText}`);
            }

            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.county;

            if (city) {
              return city;
            } else {
              throw new Error('City not found in the response');
            }
          } catch (error) {
            console.error('Error:', error.message);
            return null;
          }
        }

        getCityName(latitude, longitude)
          .then((city) => {
            if (city) {
              console.log(`City name: ${city}`);
              updateUI(data, city);
            } else {
              console.log('Unable to retrieve city name.');
            }
          });
      });
  });
}

function updateUI(data, city) {
  const location = document.getElementById('location');
  const windSpeed = document.getElementById('windSpeed');
  const humidity = document.getElementById('humidity');
  const timeZone = document.getElementById('timeZone');
  const pressure = document.getElementById('pressure');
  const windDirection = document.getElementById('windDirection');
  const UV = document.getElementById('UV');
  const feelsLike = document.getElementById('feelsLike');

  location.innerHTML = `Location: ${city}`;
  windSpeed.innerHTML = `Wind Speed: ${data.current.wind_speed}kmph`;
  humidity.innerHTML = `Humidity : ${data.current.humidity}`;
  timeZone.innerHTML = `Time Zone : ${data.timezone}`;
  pressure.innerHTML = `Pressure: ${(data.current.pressure) / 100} atm`;
  UV.innerHTML = `UV Index : ${data.current.uvi}`;
  feelsLike.innerHTML = `Feels like: ${data.current.feels_like}°`;

  windDirection.innerHTML = `Wind Direction : ${getWindDirection(data.current.wind_deg)}`;
}

function getWindDirection(degrees) {
  degrees = (degrees % 360 + 360) % 360;

  const directions = ['North', 'North-Northeast', 'Northeast', 'East-Northeast', 'East', 'East-Southeast', 'Southeast', 'South-Southeast', 'South', 'South-Southwest', 'Southwest', 'West-Southwest', 'West', 'West-Northwest', 'Northwest', 'North-Northwest'];

  const degreeRanges = [11.25, 33.75, 56.25, 78.75, 101.25, 123.75, 146.25, 168.75, 191.25, 213.75, 236.25, 258.75, 281.25, 303.75, 326.25, 348.75];

  for (let i = 0; i < degreeRanges.length; i++) {
    if (degrees < degreeRanges[i]) {
      return directions[i];
    }
  }

  // If degrees exceed 348.75, it belongs to the 'N' range
  return 'N';
}

