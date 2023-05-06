
// Author: Rodrigo Arguello-Serrano
// API configurations
const url = 'https://yelp-reviews.p.rapidapi.com/business-reviews?business_id=buono-s-pizza-gilbert&page=1&query=cheese&language=en&num_pages=1&sort_by=HIGHEST_RATED';
const options = {
    method: 'GET',
    headers: {
        'content-type': 'application/octet-stream',
        'X-RapidAPI-Key': '6d457dd656msh8e248fc8af4b456p1e4607jsn4d0a4d24b032',
        'X-RapidAPI-Host': 'yelp-reviews.p.rapidapi.com'
    }
};

// Function to get the api data
function getYelpApi() {
  // Fletch Function
    fetch(url,options)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Chaining the repsonse to get an Array of review objects
        reviews_array = data.data.reviews;
        // Sort the data by review_rating
        data_sorted = reviews_array.sort((a, b) => {if (b.review_rating < a.review_rating){
          return -1;
        }});
        // Slicing the data to get the first 6 reviews
        first_six = data_sorted.slice(0, 6);
  
        //Loop over the data to generate a table, each table row will have a link to the repo url
        for (let index = 0; index < first_six.length; index++) {
          // HTML Items declaration
          var customerStarReview = document.getElementById("customer-star-review"+(index+1));
          var reviewRating = first_six[index].review_rating;
          var dateCustomer = document.getElementById("date-customer" + (index+1));
          var yelpCustomerName = document.getElementById("yelp-customer-name"+ (index+1))
          var customerReview = document.getElementById("customer-review"+ (index+1));
          var customerPic = document.getElementById("customer-pic"+ (index+1));

          // Setting Items with API data
          yelpCustomerName.textContent = first_six[index].author_name;
          customerReview.textContent = first_six[index].review_text;
          dateCustomer.textContent = (first_six[index].review_datetime_utc).slice(0, 10);
          customerPic.src = first_six[index].author_image_url;
          // Reviews stars formatting
          for (let i = 0; i < reviewRating; i++) {
            customerStarReview.children[i].classList="fa fa-star checked"
            
          }
        }
      })
    };
  
getYelpApi();