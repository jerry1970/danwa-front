// danwa common.js, 2014

// SET SOME DEFAULT TARGET ELEMENTS
var targets = {
    page: $('.page'),
    header: $('.site-header')
}

// AJAX PRE-FILTER TO SET URL CORRECTLY
    $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        //options.url = '..' + options.url;
        options.url = 'http://api.danwa.net' + options.url;
        //options.url = 'http://localhost/danwa-api/public' + options.url;
    });

// ROUTES INITIALIZE
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            '404': 'notFound'
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
        initialize: function(){
            _.bindAll(this, 'render');
        },
        render: function() {
            var allPosts = new AllPosts([], {id: '54b6e115d6456'});
            allPosts.fetch({
                success: function(posts) {
                    // by shifting we get the actual model
                    var posts = posts.shift();
                    var template = _.template($('#template-post-list').html());

                    targets.page.html(template({
                        'posts': posts.attributes.data.posts
                    }));
                    targets.page.animate({
                        'opacity': 1
                    });
                },
                error: function() {
                    addNotification({type: 'danger', text: 'api not available'});
                }
            });
        }
    });
    var pageHome = new PageHome();

    var NotFound = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this, 'render');
        },
        render: function() {
            addNotification({type: 'warning', text: 'page not found'});
        }
    });
    var notFound = new NotFound();
    
// ROUTE HANDLING
    router.on('route:home', function() {
        pageHome.render();
    });
    router.on('route:notFound', function() {
        notFound.render();
    });

// START BACKBONE HISTORY
if (!Backbone.history.start()) router.navigate('404', {trigger:true});

// DOCUMENT READY
$(function() {
    $('.notifications').on('click', '.notification .close', function() {
        $(this).parent().remove();
    });
    
    $('.modal-popover-link').on('click', function() {
        openModalPopover($(this));
    });
});

// UTILITY FUNCTIONS
function addNotification(notification) {
    // we need the timeout to pull it from the flow, to make sure that the template has rendered
    setTimeout(function() {
        var template = _.template($('#template-notification').html());
        var templateHtml = template({notification: notification});
        $('.notifications').prepend(templateHtml);
    }, 1);
}

function openModalPopover(element) {
    var source = $('#' + element.data('source-id'));

    if ($('.modal-popover.' + element.data('source-id')).length > 0) {
        $('.modal-popover').remove();
        return;
    }
    
    if (source.length > 0) {
        $('.modal-popover').remove();
        var popover = $('.modal-popover-prototype').clone();
        
        // do most of the settings, but keep it hidden until it's been appended
        popover.removeClass('.modal-popover-prototype');
        popover.addClass('modal-popover ' + element.data('source-id'));
        popover.css({
            top: element.offset().top + element.height()
        });
        popover.html(source.html());
        popover.hide();
        
        $('body').append(popover);
        
        // now that it's appended, we can get the width, set the left offset & show
        popover.css({
            left: element.offset().left - (popover.width() / 2)
        })
        popover.show();
    }
} 
