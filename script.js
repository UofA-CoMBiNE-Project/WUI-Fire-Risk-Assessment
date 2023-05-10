const map = L.map('map', {
  zoomControl: false,
  doubleClickZoom: false,
  scrollWheelZoom: false
}).setView([53.5264657, -113.5082790], 17);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 19
}).addTo(map);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);


function highlightFeature(e) {
    const layer = e.target;
    layer.setStyle({
        fillColor: 'orange',
        fillOpacity: 0.7
    });
}

function resetHighlight(e) {
    const layer = e.target;
    layer.setStyle({
        fillColor: '',
        fillOpacity: 0
    });
}

let check = false;

function onEachFeature(feature, layer) {
  const dropdown = document.getElementById("map-dropdown");

    layer.on({

        click: function(e) 
        {
            if (feature.properties.id === 31246611)
            {
              highlightFeature(e);
              document.getElementById("map-dropdown").disabled = false;
              document.getElementById("update-button").disabled = false;
              document.getElementById("download-button").disabled = false;
              check = true;

            }
            else{
              resetHighlight(e);
              document.getElementById("datepicker").disabled = true;
              document.getElementById("map-dropdown").disabled = true;
              document.getElementById("update-button").disabled = true;
              check = false;
            }
            dropdown.addEventListener("change", function() {
              const selectedValue = dropdown.value;
              const date_options = ["rate-of-spread", "intensity-factor1", "intensity-factor2", "intensity-factor3"]
              if (selectedValue === "fire-behavior" && check === true)
              {
                console.log(selectedValue);
                document.getElementById("datepicker").disabled = false;
              }
              else
              {
                document.getElementById("datepicker").disabled = true;
              }
            });
        }
        
    });
}


function showInstructions() {
  const instructionsContainer = document.getElementById("instructions-container");
  instructionsContainer.style.display = (instructionsContainer.style.display === "none") ? "block" : "none";
}



function fetchBuildings() {
    const bounds = map.getBounds();
    const overpassQuery = `[out:json][timeout:25];(way[building](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}););out body;>;out skel qt;`;

    fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "data=" + encodeURIComponent(overpassQuery)
    })
    .then(response => response.json())
    .then(data => {
        const geoJsonData = osmtogeojson(data);
        const mapDropdown = document.getElementById("map-dropdown");
        const mapType = mapDropdown.value;

        if (mapType === "zone-map") {
          // TODO: update map to show zone map
        } else if (mapType === "fuel-map") {
          // TODO: update map to show fuel map
        } else if (mapType === "fpb-map") {
          // TODO: update map to show FPB map
        } else if (mapType === "spread-factor") {
          // TODO: update map to show spread factor
        } else if (mapType === "rate-of-spread") {
          // TODO: update map to show rate of spread
        } else if (mapType === "intensity-factor") {
          // TODO: update map to show intensity factor
        }

        L.geoJSON(geoJsonData, {
            style: {
                fillColor: '',
                fillOpacity: 0,
                color: 'transparent'
            },
            onEachFeature: onEachFeature
        }).addTo(map);
    })
    .catch(error => {
        console.error("Error fetching GeoJSON data:", error);
    });
}

// Load osmtogeojson library
const osmToGeoJSONScript = document.createElement("script");
osmToGeoJSONScript.src = "https://cdn.rawgit.com/tyrasd/osmtogeojson/2.2.0/osmtogeojson.js";
osmToGeoJSONScript.onload = fetchBuildings;
document.body.appendChild(osmToGeoJSONScript);



function showInstructions() {
  const instructionsContainer = document.getElementById("instructions-container");
  instructionsContainer.style.display = (instructionsContainer.style.display === "none") ? "block" : "none";
}

function downloadImage() {
  // Get the currently selected image
  var image = document.getElementById("map-image");

  // Create a new anchor element to trigger the download
  var link = document.createElement("a");
  link.download = "map.png";
  link.href = image.src;

  // Trigger the download by clicking the anchor element
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


// Get the popup and close button elements
var popup = document.getElementById("popup");
var close = document.getElementById("close");

// Show the popup when the page loads
window.onload = function() {
  popup.style.display = "block";
}

// Hide the popup when the close button is clicked
close.onclick = function() {
  popup.style.display = "none";
}


const imageMap = {

  "fuel-map-topography": function(date) {
    const fmtDropdown = document.getElementById("fmt");
    const fmtValue = fmtDropdown.value;

    if (check) {
      switch (fmtValue) {
        case "satellite-map":
          return "1) SatelliteMap.jpg";
        case "grass-zone1":
          return "5.1) GrassZone1.jpg";
        case "grass-zone2":
          return "5.4) GrassZone2.jpg";
        case "grass-zone3":
          return "5.7) GrassZone3.jpg";
        case "deciduous-zone1":
          return "5.2) DeciduousZone1.jpg";
        case "deciduous-zone2":
          return "5.5) DeciduousZone2.jpg";
        case "deciduous-zone3":
          return "5.8) DeciduousZone3.jpg";
        case "conifer-zone1":
          return "5.3) ConiferZone1.jpg";
        case "conifer-zone2":
          return "5.6) ConiferZone2.jpg";
        case "conifer-zone3":
          return "5.9) ConiferZone3.jpg";
        case "fuel-map-overlay":
          return "4) FuelMapOverlay.jpg";
        case "fpb-map":
          return "5.10) FPBmap.jpg";
        case "spread-factor":
          return "5.11) SpreadFactor.jpg";
        default:
          return null;
      }
    }
  },

  "fire-behavior": function(date) {
    const fbDropdown = document.getElementById("fb");
    const fbValue = fbDropdown.value;

    if (check) {
      switch (fbValue) {
        case "rate-of-spread":
          if (date === "2022-08-16") {
            return "5.12) RateSpread-Aug16.jpg";
          } else if (date === "2022-11-01") {
            return "5.13) RateSpread-Nov1.jpg";
          } else {
            return null;
          }
        case "intensity-factor1":
          if (date === "2022-08-16") {
            return "5.14) IntensityFactor1-Aug16.jpg";
          } else if (date === "2022-11-01") {
            return "5.17) IntensityFactor1-Nov1.jpg";
          } else {
            return null;
          }
        case "intensity-factor2":
          if (date === "2022-08-16") {
            return "5.15) IntensityFactor2-Aug16.jpg";
          } else if (date === "2022-11-01") {
            return "5.18) IntensityFactor2-Nov1.jpg";
          } else {
            return null;
          }
        case "intensity-factor3":
          if (date === "2022-08-16") {
            return "5.16) IntensityFactor3-Aug16.jpg";
          } else if (date === "2022-11-01") {
            return "5.19) IntensityFactor3-Nov1.jpg";
          } else {
            return null;
          }
        default:
          return null;
      }
    }
  }
};

const updateButton = document.getElementById("update-button");
let imageContainer = null;

updateButton.addEventListener("click", function() {
  const mapDropdown = document.getElementById("map-dropdown");
  const mapType = mapDropdown.value;
  
  const fmtDropdown = document.getElementById("fmt");
  const fmtValue = fmtDropdown.value;
  
  const fbDropdown = document.getElementById("fb");
  const fbValue = fbDropdown.value;
  
  const dateInput = document.getElementById("datepicker");
  const date = dateInput.value;
  
  let imageName;
  if (mapType === "fuel-map-topography") {
    const getImageFilename = imageMap[mapType];
    imageName = getImageFilename(date, fmtValue);
  } else if (mapType === "fire-behavior") {
    const getImageFilename = imageMap[mapType];
    imageName = getImageFilename(date, fbValue);
  }
  
  if (imageName) {
    const imageUrl = imageName + "?" + Date.parse(date);
    if (!imageContainer) {
      imageContainer = document.createElement("div");
      imageContainer.id = "map-image-container";
      const image = document.createElement("img");
      image.src = imageUrl;
      image.id = "map-image";
      imageContainer.appendChild(image);
      document.getElementById("controls").appendChild(imageContainer);
    } else {
      const image = imageContainer.querySelector("img");
      image.src = imageUrl;
    }
  } else if (imageContainer) {
    imageContainer.remove();
    imageContainer = null;
  }
  fetchBuildings();
});





map.on("moveend", function() {
    fetchBuildings();
});