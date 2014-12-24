// danwa common.js, 2014

// AJAX PRE-FILTER TO SET URL CORRECTLY
    $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        //options.url = '..' + options.url;
        options.url = 'http://api.danwa.net' + options.url;
    });

// ROUTES INITIALIZE
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home'
        }
    })
    var router = new Router();

// MODELS
    var Users = Backbone.Collection.extend({
        url: '/v1/users'
    })
    
// VIEWS
    var PageHome = Backbone.View.extend({
        el: $('.page'),
        initialize: function(){
            _.bindAll(this, 'render');
        },
        render: function() {
            var users = new Users();
            users.fetch({
                success: function(users) {
                    var users = users.shift();
                    var template = _.template($('#template-user-list').html());

                    $('.page').html(template({
                        'users': users.attributes.data.users}
                    ));
                    $('.page').animate({
                        'opacity': 1
                    });
                },
                error: function() {
                    console.log('ERROR',arguments)
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
