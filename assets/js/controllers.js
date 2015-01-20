/**
 * danwa controllers.js, 2015, Robin de Graaf
 */

function getHome(param) {
    $.get(urlBase + 'consolidated/x/allposts', function(result) {
        var template = _.template($('#template-post-list').html());
        target.html(template({
            'posts': result.data.posts
        }));
    });
}
function getUser(params) {
    console.log(params);
    var template = _.template($('#template-user-profile').html());
    target.html(template({
        'username': params.username
    }));
}
function getSettings() {
    target.html('Settings here');
}
function notFound() {
    target.html('404 - page not found');
}
function getTest(params) {
    console.log(params);
}