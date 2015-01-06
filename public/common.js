// danwa common.js, 2014

// AJAX PRE-FILTER TO SET URL CORRECTLY
    $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        //options.url = '..' + options.url;
        //options.url = 'http://api.danwa.net' + options.url;
        options.url = 'http://localhost/danwa-api/public' + options.url;
    });

// ROUTES INITIALIZE
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home'
        }
    })
    var router = new Router();

// MODELS & COLLECTIONS
    var Users = Backbone.Collection.extend({
        url: '/v1/users'
    });
    var AllPosts = Backbone.Collection.extend({
	initialize: function(models, options) {
	    this.url = '/v1/consolidated/' + options.id + '/allposts';
	}
    });
    var Posts = Backbone.Collection.extend({
	url: '/v1/posts'
    });
    
// VIEWS
    var PageHome = Backbone.View.extend({
        el: $('.page'),
        initialize: function(){
            _.bindAll(this, 'render');
        },
        render: function() {
            var allPosts = new AllPosts([], {id: '54a31c8af2b08'});
            allPosts.fetch({
                success: function(posts) {
                    var posts = posts.shift();
                    var template = _.template($('#template-post-list').html());

                    $('.page').html(template({
                        'posts': posts.attributes.data.posts}
                    ));
                    $('.page').animate({
                        'opacity': 1
                    });
                },
                error: function() {
                    // arguments[1] is what we want to pass along
                    addNotification({type: 'danger', text: 'api not available'});
                }
            });
        }
    });
    var pageHome = new PageHome();
    
// ROUTE HANDLING
    router.on('route:home', function() {
        pageHome.render();
    });

// START BACKBONE HISTORY
Backbone.history.start();

// DOCUMENT READY
$(function() {
    $('.notifications').on('click', '.notification .close', function() {
	$(this).parent().remove();
    });
});

// UTILITY FUNCTIONS
function addNotification(notification) {
    var template = _.template($('#template-notification').html());
    var templateHtml = template({notification: notification});
    $('.notifications').prepend(templateHtml);
}
