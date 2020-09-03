$(document).ready(() => {
  function getUserName() {
    $.get("/api/user_data").then((data) => {
      $(".member-name").text(data.name);
      $(".member-id").text(`Your ID is ${data.id}`);
      $(".member-id").attr("value", data.id);
      renderAllBookmark(data.id);
    });
  }

  // rendering all bookmarks using get method.
  function renderAllBookmark(userId) {
    // console.log('userId', userId);
    $.get("/api/users/" + userId, function(data) {
      bookmarkRestaurant(data);
    });
  }

  // after getting datas from database, it is now looping thru all of it to create each list.
  function bookmarkRestaurant(data) {
    $(".bookmarks").empty();
    var allRestaurantList = [];
    for (var i = 0; i < data.length; i++) {
      allRestaurantList.push(createNewList(data[i]));
    }
    $(".bookmarks").append(allRestaurantList);
  }

  // create <li> with what restaurant name is
  function createNewList(data) {
    var newliEl = $("<li>");
    $(newliEl)
      .addClass("list-group-item")
      .text(data.shop_name)
      .attr("id", data.id);
    return newliEl;
  }

  $(".bookmarks").on("click", "li", function() {
    var restaurantID = $(this).attr("id");
    console.log("id\n", $(this).attr("id"));
    $.get("/api/restaurant/" + restaurantID)
      .then((res) => {
        console.log("result \n", res);
        renderInfo(res.address, res.shop_name, res.shop_url);
        renderImage(res.shop_image);
        renderReview(res.id, res.user_review, res.user_rating);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  function renderInfo(address, name, url) {
    $("#shop-details").empty();
    var title = $("<h4>");
    var pElOne = $("<p>");
    var pElTwo = $("<p>");

    $(title).text(name);
    $(pElOne).text(address);
    $(pElTwo).text(url);

    $("#shop-details").append(title);
    $("#shop-details").append(pElOne);
    $("#shop-details").append(pElTwo);
  }

  function renderReview(id, review, rating) {
    $(".review-form").empty();
    var deleteBtn = $("<button>");
    var updateBtn = $("<button>");
    $(deleteBtn)
      .attr("value", id)
      .attr("class", "delete-btn buttons")
      .text("Delete");
    $(updateBtn)
      .attr("value", id)
      .attr("class", "update-btn buttons")
      .text("Update");
    $(".review-form").append(updateBtn);
    $(".review-form").append(deleteBtn);

    var reviewBody = $("<textarea>");
    $(reviewBody)
      .attr("id", "user-review")
      .attr("name", "review")
      .attr("placeholder", "Write Your Review")
      .attr(
        "style",
        "width:400px; height:200px; text-align:center; border: none; width: 90%;"
      );
    if (review !== null) {
      $(reviewBody).append(review);
    }
    $(".review-form").append(reviewBody);

    var linebreak = $("<br>");
    $(".review-form").append(linebreak);

    var ratingDisplay = $("<p>");
    switch(rating) {
        case 5: 
        ratingDisplay.text("😍😍😍😍😍");
        break;
        
        case 4: 
        ratingDisplay.text("😍😍😍😍");
        break;
       
        case 3: 
        ratingDisplay.text("😍😍😍");
        break;
       
        case 2: 
        ratingDisplay.text("😍😍");
        break;
        
        case 1: 
        ratingDisplay.text("😍");
        break;
    }
    $(".review-form").append(ratingDisplay);

    var ratingBody = $("<select>");
    $(ratingBody)
      .attr("name", "rating")
      .attr("id", "user-rating");
    var rateOne = $("<option>")
      .attr("value", 1)
      .text("1");
    var rateTwo = $("<option>")
      .attr("value", 2)
      .text("2");
    var rateThree = $("<option>")
      .attr("value", 3)
      .text("3");
    var rateFour = $("<option>")
      .attr("value", 4)
      .text("4");
    var rateFive = $("<option>")
      .attr("value", 5)
      .text("5");
    ratingBody.append(rateFive);
    ratingBody.append(rateFour);
    ratingBody.append(rateThree);
    ratingBody.append(rateTwo);
    ratingBody.append(rateOne);
    $(".review-form").append(ratingBody);
   
  }

  function renderImage(image) {
    $("#shop-image").empty();
    var imgEl = $("<img>");
    $(imgEl).attr("src", image);
    $(imgEl).attr("class", "card-img");
    $("#shop-image").append(imgEl);
  }

  // Delete Button
  $(document).on("click", "button.delete-btn", function() {
    var resId = $(".delete-btn").attr("value");
    deleteBookmark(resId);
  });

  function deleteBookmark(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/restaurant/del/" + id,
    })
      .then((res) => {
        console.log("result ", res);
      })
      .catch((error) => {
        console.error(error);
      });
  }

//   $('#sel1 option:selected').val();
//   $('#sel1 option:selected').text();
  // var ratingInput = Need one
  // Update Button
  $(document).on("click", "button.update-btn", function() {
    var reviewInput = $("#user-review");
    var ratingInput = $('#user-rating option:selected').val();
    var resId = $(".update-btn").attr("value");
    var newReview = {
      user_review: reviewInput.val().trim(),
      user_rating: ratingInput
    };
    updateBookmark(resId, newReview);
  });

  function updateBookmark(id, review) {
    $.ajax({
      method: "PUT",
      url: "/api/restaurant/up/" + id,
      data: review,
    })
      .then(function() {
        window.location.href = "/main";
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getUserName();
});
