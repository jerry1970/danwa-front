/**
 * danwa common.js, 2015, Robin de Graaf
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
    'test/{id}/{type}/super/{again}': {
        'controller': 'getTest'
    }
}

// instantiate router with routes
var router = new Router();
router.setRoutes(routes);

$(function() {
    
    // set the target
    target = $('.page');
    
    // route the current hash
    router.find(window.location.hash);
    
    // and recognize hash changes
    $(window).on('hashchange', function() {
        router.find(window.location.hash);
    });
    
});