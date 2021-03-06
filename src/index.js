/**
 * es6 modules and imports
 */
// import sayHello from './hello';
// sayHello('World');

/**
 * require style imports
 */
const {getMovies} = require('./api.js');
const $ = require('jquery');

let id;

$(".container").html("<img src='https://media1.tenor.com/images/bddd3efa10babe9f55afa16aa862b104/tenor.gif?itemid=4713516'>");
$(".afterLoad").hide();

$("#addMovie").click((e) => {
    e.preventDefault();
    if ($("#newMovie").val() !== "") {
        $("#addMovie").html("<img class='smallLoading' src='https://media1.tenor.com/images/d6cd5151c04765d1992edfde14483068/tenor.gif?itemid=5662595'>");
        const movie = {title: $("#newMovie").val(), rating: $("#rating").val(), id: ""};
        const url = '/api/movies';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movie),
        };
        fetch(url, options)
            .then(movie => {
                updateMovies();
                $("#addMovie").html("Submit");
                $("#addModal").css("display", "none");
            })
            .catch(error => console.log(error));
        $("#newMovie").val("");
        $("#rating").val("1");
    } else {
        alert("Oops, there's nothing here!");
    }
});
updateMovies();
function updateMovies() {

    getMovies().then((movies) => {
      $(".afterLoad").show();
        $(".editMovieForm").hide();
      let html = "<table><tr><th>Movie</th><th>Rating</th><th> </th></tr>";
      movies.forEach(({title, rating, id}) => {
        html += `<tr><td>${title}</td><td class="rating">`;
        html += starRating(rating);
        html += `</td><td><button data-movie="${title}" data-rating="${rating}" value="${id}" class="edit">Edit</button><button class="delete" value="${id}">Delete</button></td></tr>`;
      });
        html += "</table>";
        $(".movieList").html(html);
        $(".container").hide();
        $(".edit").click((e) => {
             id = e.target.value;
            let movie = e.target.dataset.movie;
            let rating = e.target.dataset.rating;
            $("#editMovie").val(movie);
            $("#newRating").val(rating);
            // $(".editMovieForm").show();
            $("#editModal").css("display", "block");
        });
        $(".delete").click((e) => {
            id = e.target.value;
            $(".delete").eq(id-1).html("<img class='smallLoading' src='https://media1.tenor.com/images/d6cd5151c04765d1992edfde14483068/tenor.gif?itemid=5662595'>");
            deleteMovie();
        })
    }).catch((error) => {
      alert('Oh no! Something went wrong.\nCheck the console for details.');
      console.log(error);
    });
}
    $("#updateMovie").click((e) => {
            console.log(e);
            e.preventDefault();
            $("#updateMovie").html("<img class='smallLoading' src='https://media1.tenor.com/images/d6cd5151c04765d1992edfde14483068/tenor.gif?itemid=5662595'>");
            saveMovie();
        });
function saveMovie() {
    if ($("#editMovie").val() !== "") {
        const movie = {title: $("#editMovie").val(), rating: $("#newRating").val(), id: ""};
        const url = `/api/movies/${id}`;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movie)
        };
        fetch(url, options)
            .then(movie => {
                updateMovies();
                // $(".editMovieForm").hide();
                $("#editMovie").val("");
                $("#newRating").val("1");
                $("#updateMovie").html("Save");
                $("#editModal").css("display", "none");
            })
            .catch();
    }
}
$("#addMovieModal").click(() => {
    $("#addModal").css("display", "block");
});
function deleteMovie() {
    const url = `/api/movies/${id}`;
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    fetch(url, options)
        .then( () => updateMovies())
        .catch();
}
function starRating(rating) {
    let html = "";
    for(let i = 5; i>= 1; i--) {
        if (i > rating) {
            html += `<span class="hover" data-rating=${i}>&#9734</span>`
        }
        else if (i <= rating) {
            html += `<span class="hover" data-rating=${i}>&#9733</span>`
        }

    }
    console.log(html);
    return html;
}
$("#close").click((e) => {
    e.preventDefault();
    $("#addModal").css("display", "none");
    $("#newMovie").val("");
    $("#rating").val("1");
});
