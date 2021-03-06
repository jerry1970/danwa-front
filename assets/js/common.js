/**
 * danwa common.js, 2015, Robin de Graaf, devvoh.com
 */

// set hash globally to current hash
var hash = window.location.hash;
var urlBase = 'http://api.danwa.net/v1/';
var target;
var routes = {
    '': {
        'controller': 'getHome'
    },
    'user/{username}': {
        'controller': 'getUser',
    },
    'settings': {
        'controller': 'getSettings'
    },
    'post/{id}': {
        'controller': 'getPost'
    }
}
var collections = {
    'user': {
        'url': 'users'
    },
    'post': {
        'url': 'posts'
    },
    'allPosts': {
        'url': 'consolidated/x/allposts'
    }
}

// instantiate router with routes
var router = new Router(routes);

$(function() {
    
    // set the target
    target = $('.page');
    
    // route the current hash
    router.route(window.location.hash);
    
    // and recognize hash changes
    $(window).on('hashchange', function() {
        router.route(window.location.hash);
    });
    
});

function getApiResult(collection) {
    var url = urlBase + collections[collection].url;
    return $.ajax({
        type: "GET",
        url: url,
        async: false
    }).responseJSON.data;
}