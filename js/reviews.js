const firebaseConfig = {
    apiKey: "AIzaSyCl5Nmh0RAicDyAvX_PDgVmXOL4iVjH9Z0",
    authDomain: "hungergames-5d095.firebaseapp.com",
    databaseURL: "https://hungergames-5d095.firebaseio.com",
    projectId: "hungergames-5d095",
    storageBucket: "hungergames-5d095.appspot.com",
    messagingSenderId: "634694544737",
    appId: "1:634694544737:web:bb7a92b745b33289a86920",
    measurementId: "G-TMPPHM4TZH"
  };
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

$(document).ready(function() {
    $('.rating-stars').rating();
});

$(function() {

    $("#reviewForm input,#reviewForm textarea").jqBootstrapValidation({
      preventSubmit: true,
      submitError: function($form, event, errors) {
        // additional error messages or events
      },
      submitSuccess: function($form, event) {
        event.preventDefault(); // prevent default submit behaviour
        // get values from FORM
        var reviewer = $("input#reviewer").val();
        var rating = $("input#rating").val();
        var text = $("textarea#text").val();
        var firstName = name; // For Success/Failure Message
        // Check for white space in name for Success/Fail message
        if (firstName.indexOf(' ') >= 0) {
          firstName = name.split(' ').slice(0, -1).join(' ');
        }
        $this = $("#sendMessageButton");
        $this.prop("disabled", true); // Disable submit button until AJAX call is complete to prevent duplicate messages
        db.collection("reviews").add({
            reviewer: reviewer,
            rating: rating,
            text: text
        })
        .then(function(docRef) {
            $('#success').html("<div class='alert alert-success'>");
            $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
              .append("</button>");
            $('#success > .alert-success')
              .append("<strong>Your gift has been received. </strong>");
            $('#success > .alert-success')
              .append('</div>');
            //clear all fields
            $('#contactForm').trigger("reset");
        })
        .catch(function(error) {
            // Fail message
            $('#success').html("<div class='alert alert-danger'>");
            $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                .append("</button>");
            $('#success > .alert-danger').append($("<strong>").text("Sorry " + firstName + ", it seems that my server is not responding. Please try again later!"));
            $('#success > .alert-danger').append('</div>');
            //clear all fields
            $('#contactForm').trigger("reset");
        })
        .finally(function() {
            setTimeout(function() {
                $this.prop("disabled", false); // Re-enable submit button when AJAX call is complete
              }, 1000);
        })
      },
      filter: function() {
        return $(this).is(":visible");
      },
    });
  
    $("a[data-toggle=\"tab\"]").click(function(e) {
      e.preventDefault();
      $(this).tab("show");
    });
});
  
/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
$('#success').html('');
});

var reviewsContainer = document.getElementById("reviews-container")
var reviewsTemplate = document.getElementById("review-template")
var starHtml = '<i class="fas fa-star"></i>'

db.collection("reviews").get().then((snapshot) => {
    if (!snapshot.empty) {
        $("#no-reviews").remove();
    }
    snapshot.forEach(function(doc) {
        var data = doc.data();
        var rating = data.rating;
        var reviewer = data.reviewer;
        var text = data.text;

        var clone = reviewsTemplate.content.cloneNode(true);

        var ratingNode = clone.querySelector(".review-rating");
        for (var i = 0; i < rating; i++) {
            ratingNode.innerHTML = ratingNode.innerHTML + starHtml
        }

        var reviewerNode = clone.querySelector(".review-reviewer");
        reviewerNode.textContent = reviewer;

        var textNode = clone.querySelector(".review-text");
        textNode.textContent = text;

        reviewsContainer.appendChild(clone);

    })
})

