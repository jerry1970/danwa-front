/**
 * danwa controllers.js, 2015, Robin de Graaf
 */

function getHome(param) {
    var data = getApiResult('allPosts');
    console.log(data);
    var template = _.template($('#template-post-list').html());
    target.html(template({
        'posts': data.posts
    }));
}
function getUser(params) {
    var template = _.template($('#template-user-profile').html());
    target.html(template({
        'username': params.username
    }));
}
function getPost(params) {
    var data = getApiResult('post');
    console.log(data);
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