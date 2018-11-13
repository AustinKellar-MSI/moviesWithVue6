const None = undefined;

var enumerate = function(arr) { 
    var k=0; return arr.map(function(e) {
        e._idx = k++;
        Vue.set(e, 'showComments', false);
        Vue.set(e, 'comments', []);
        Vue.set(e, 'addingComment', false);
        Vue.set(e, 'newComment', '');
    });
};

var processMovies = function() {
    enumerate(app.movies);
};

var onPageLoad = function() {
    $.getJSON(getMoviesUrl,
        function(response) {
            app.movies = response.movies;
            processMovies();
        }
    );
};

var insertMovie = function() {
    var newMovie = {
        title: app.newMovieTitle,
        description: app.newMovieDescription,
        rating: app.newMovieRating
    };
    $.post(insertMoviesUrl, newMovie, function(response) { 
        newMovie['id'] = response.new_movie_id;
        app.movies.push(newMovie);
        processMovies(); 
    });
};

var showComments = function(idx) {
    var id = app.movies[idx].id;
    var url = getCommentsUrl + '?id=' + id;
    app.movies[idx].showComments = true;
    $.post(url, function(response) {
        app.movies[idx].comments = response.comments;
    });
};

var hideComments = function(idx) {
    app.movies[idx].showComments = false;
};

var toggleAddingComment = function(idx) {
    app.movies[idx].addingComment = !app.movies[idx].addingComment;
};

var saveComment = function(idx) {
    // Your code goes here. Remember, we need to set the id of the new comment!
    $.post(insertCommentUrl, {
        movie_id: app.movies[idx].id,
        body: app.movies[idx].newComment
    }, (response) => {
        app.movies[idx].comments.unshift({
            id: response.id,
            movie_id: app.movies[idx].id,
            body: app.movies[idx].newComment
        });
    });
};

var app = new Vue({
    el: '#app',
    delimiters: ['${', '}'],
    unsafeDelimiters: ['!{', '}'],
    data: {
        newMovieTitle: "",
        newMovieDescription: "",
        newMovieRating: "",
        movies: []
    },
    methods: {
        submitMovie: insertMovie,
        showComments: showComments,
        hideComments: hideComments,
        toggleAddingComment: toggleAddingComment,
        saveComment: saveComment
    }
});

onPageLoad();