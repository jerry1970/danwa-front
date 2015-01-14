// danwa common.js, 2014

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

                    $('.page').html(template({
                        'posts': posts.attributes.data.posts
                    }));
                    $('.page').animate({
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
            setTimeout(function() {
        	addNotification({type: 'warning', text: 'page not found'});
            }, 500);
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
    console.log($('#template-notification').html());
    var template = _.template($('#template-notification').html());
    var templateHtml = template({notification: notification});
    $('.notifications').prepend(templateHtml);
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
	popover
	    .removeClass('.modal-popover-prototype')
	    .addClass('modal-popover ' + element.data('source-id'))
	    .css({
		top: element.offset().top + element.height() + 15
	    })
	    .html(source.html())
	    .hide();
	
	$('body').append(popover);
	
	// now that it's appended, we can get the width, set the left offset & show
	popover
	   .css({
		left: element.offset().left - (popover.width() / 2)
	   }).show();
    }
} 