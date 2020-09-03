$(document).ready(() => {
  //GET THE USER NAME FROM DATABASE
  function getUserName() {
    $.get("/api/user_data").then((data) => {
      $(".member-name").text(data.name);
      $(".member-id").text(`Your ID is ${data.id}`);
      $(".member-id").attr("value", data.id);
      renderAllBookmark(data.id);
    });
  }

  $(".submit-button").on("click", function(event) {
    event.preventDefault();

    var cityInput = $("#city-input")
      .val()
      .trim();
    var stateInput = $("#state-input")
      .val()
      .trim();

    getSearch(cityInput, stateInput);
    getStaticMap(cityInput, stateInput);
    // save users input to backend.
  });

  // getting the lat and lon for the user's searched city.
  function getSearch(city, state) {
    const apiKey = "6kkUl9f91C5XxAWQvi59a4QnmpZMljcM";
    const queryURL = `https://www.mapquestapi.com/geocoding/v1/address?key=${apiKey}&location=${city},${state}`;
    $.ajax({
      url: queryURL,
      method: "GET",
    })
      .then((data) => {
        let lat = data.results[0].locations[0].latLng.lat;
        let lon = data.results[0].locations[0].latLng.lng;
        getRestaurants(lat, lon);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // PRINTS OUT THE STATIC MAP
  // function getStaticMap(city, state) {
  //   $("#map-render").empty();
  //   const apiKey = "6kkUl9f91C5XxAWQvi59a4QnmpZMljcM";
  //   const queryURL = `https://www.mapquestapi.com/staticmap/v5/map?key=${apiKey}&center=${city},${state}&size=400,200@2x`;
  //   var imgEl = document.createElement("img");
  //   imgEl.setAttribute(`src`, `${queryURL}`);
  //   $("#map-render").append(imgEl);
  //   $(".hide").show();
  // }

  function getRestaurants(lat, lon) {
    axios({
      method: "GET",
      url: "https://developers.zomato.com/api/v2.1/search",
      headers: {
        "content-type": "application/octet-stream",
        user_key: "723c59fca106ce1599f751dc65a0c43f",
        useQueryString: true,
      },

      params: {
        lat: `${lat}`,
        lon: `${lon}`,
        sort: "real_distance"
      },
    })
      .then((response) => {
        console.log("list", response.data.restaurants[0]); // restaurant
        // response.data.restaurants.length = 20
        displaySearch(response.data);
        getPinnedMap(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  function getPinnedMap(data) {
    console.log('data', data);
    $("#map-render").empty();
    var emptyStr = "";
    for (i = 0; i < data.restaurants.length; i++) {
      emptyStr += `${data.restaurants[i].restaurant.location.latitude},${data.restaurants[i].restaurant.location.longitude}||`;
    }
    const apiKey = "6kkUl9f91C5XxAWQvi59a4QnmpZMljcM";
    const queryURL = `https://www.mapquestapi.com/staticmap/v5/map?locations=${emptyStr}&size=400,200@2x&key=${apiKey}&defaultMarker=marker-9df2f0-ff073a-sm&`;
    var imgEl = document.createElement("img");
    imgEl.setAttribute(`src`, `${queryURL}`);
    $("#map-render").append(imgEl);
    $(".hide").show();
  }

  function displaySearch(res) {
    // console.log("length", res.restaurants);
    $(".start-row").empty();
    var displaySearchRestaurant = [];
    for (i = 0; i < res.restaurants.length; i++) {
      displaySearchRestaurant.push(createNewDisplay(res.restaurants[i]));
    }
    $(".start-row").append(displaySearchRestaurant);
  }

  function createNewDisplay(data) {
    var newCol = $('<div class="col-md-3">');
    var newCard = $('<div class="card restaurant-card">');
    var newCardBody = $('<div class="card-body">');
    var restName = $("<h4>");
    var restAddress = $("<p>");
    var restCuisine = $("<p>");
    var newCardFooter = $("<div class='card-footer'>")
    var saveButton = $("<button>");

    restName.text(data.restaurant.name);
    restAddress.text(data.restaurant.location.address);
    restCuisine.text(data.restaurant.cuisines);
    saveButton.attr("id", data.restaurant.R.res_id);
    saveButton.attr("class", "btn btn-primary btn-sm");
    saveButton.text("Save This Restaurant");

    $(newCol).append(newCard);
    $(newCard).append(newCardBody);
    $(newCardBody).append(restName);
    $(newCardBody).append(restAddress);
    $(newCardBody).append(restCuisine);
    $(newCardFooter).append(saveButton);
    $(newCard).append(newCardFooter);
    return newCol;
  }

  // Click event on function
  $(".start-row").on("click", "button", function() {
    // console.log($(this).attr("id")); // res id
    var resId = $(this).attr("id");
    axios({
      method: "GET",
      url: "https://developers.zomato.com/api/v2.1/restaurant",
      headers: {
        "content-type": "application/octet-stream",
        user_key: "723c59fca106ce1599f751dc65a0c43f",
        useQueryString: true,
      },
      params: {
        res_id: resId,
      },
    }).then(function(res) {
      $.post("/api/restaurant", {
        shop_name: res.data.name,
        latitude: res.data.location.latitude,
        longitude: res.data.location.longitude,
        address: res.data.location.address,
        hours: res.data.timings,
        cost_for_two: res.data.average_cost_for_two,
        shop_url: res.data.url,
        cuisines: res.data.cuisines,
        highlights: res.data.highlights,
        shop_image: res.data.featured_image,
        id: $(".member-id").attr("value"),
      }).then(console.log("You have succesfully saved the restaurant.\n", res.data))
      .catch((error) => {
        console.error(error);
      });
    });
  });

  getUserName();
});
