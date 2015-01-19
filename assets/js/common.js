// danwa common.js, 2014

//                    var template = _.template($('#template-post-list').html());
//
//                    targets.page.html(template({
//                        'posts': posts.attributes.data.posts
//                    }));

// set hash globally to current hash
var hash = window.location.hash;
var urlBase = 'http://api.danwa.net/v1/';
var target;
var routes = {
    '': {
        'func': 'getHome'
    },
    'user': {
        'func': 'getUser',
        'param': 'id'
    },
    'settings': {
        'func': 'getSettings'
    }
}
$(function() {
    // set the target
    target = $('.page');
    // route the current hash
    route(window.location.hash);
    // and recognize hash changes
    $(window).on('hashchange', function() {
        route(window.location.hash);
    });
});

function route(hash) {
    /* future plan
     * 
     * var routes = {
     *     '': 'getHome',
     *     'user/{username}': getUser
     * }
     * 
     * where the 'router' splits the hash (i.e. '#/user/devvoh') into its constituent parts
     * 
     * So we SPLIT the key, and we SPLIT the hash
     * 
     *  key after split: ['user', '{username}']
     * hash after split: ['user', 'devvoh']
     * 
     * remove 'devvoh' from hash since we expect a parameter value here, and replace it with the corresponding
     * parameter from the key (index: 1 equals '{username}'). Now our hash is ['user', '{username}'] again, and if
     * we combine it, we get 'user/{username}', which we can directly match.
     * 
     * since we now know we have a parameter value that corresponds with username, we will pass an object to the 
     * function getUser(), consisting of {'username': 'devvoh'}
     * 
     * accepted: '#/user/{username}'
     *    given: '#/user/devvoh'
     *  outcome: getUser({'username': 'devvoh'});
     *  
     * accepted: '#/test/{id}/{type}'
     *    given: '#/test/123/super'
     *  outcome: getTest({'id': '123', 'type': 'super'});
     * 
     * */
    var routeKey = '';
    var routeParam = '';
    if (hash.length > 0) {
        hashSplit = hash.split('/');
        // remove the shebang
        hashSplit.shift()
        // the first of 2 params is the key
        routeKey = hashSplit.shift();
        // and the second must be an id of some sort
        routeParam = hashSplit.pop();
    }
    
    // default function is getNotFound()
    var func = window['getNotFound'];
     
    if (routes[routeKey] !== undefined) {
        func = window[routes[routeKey].func];
    }
    func(routeParam);
}

function getHome(param) {
    $.get(urlBase + 'consolidated/x/allposts', function(result) {
        var template = _.template($('#template-post-list').html());
        target.html(template({
            'posts': result.data.posts
        }));
    });
}
function getUser(param) {
    var template = _.template($('#template-user-profile').html());
    target.html(template({
        'username': param
    }));
}
function getSettings() {
    target.html('Settings here');
}
function getNotFound() {
    target.html('404 - page not found');
}