if ("geolocation" in navigator) {
  // Request the user's current location
  navigator.geolocation.getCurrentPosition(
    // Success callback
    function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Store values in sessionStorage
      sessionStorage.setItem("latitude", latitude);
      sessionStorage.setItem("longitude", longitude);

    },
    // Error callback
    function (error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          // Display a pop-up message if the user denies location access
          alert("Please allow location access to use this feature.");
          console.error("User denied the request for Geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          console.error("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          console.error("The request to get user location timed out.");
          break;
        case error.UNKNOWN_ERROR:
          console.error("An unknown error occurred.");
          break;
      }
    }
  );
} else {
  console.error("Geolocation is not supported by your browser.");
}

const fetchData = document.getElementById("fetchData");

fetchData.addEventListener("click", () => {
  window.location.href = "index2.html";
});
