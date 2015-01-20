/*
 * router.js, 2015, Robin de Graaf, devvoh.com
 * 
 * use          var router = new Router(routes);
 * 
 * routes should be an object with elements laid out like so:
 * 
 * {
 *     'url': {
 *         'controller': 'homeController',
 *     }
 *     'paramUrl/{username}': {
 *         'controller': 'paramController',
 *     }
 * }
 * 
 * NOTE: Routes are entered into the route list WITHOUT the #/ prefix. So 'test': {} matches the
 *       actual url #/test. For home, simply use '' as the key.
 */

function Router (routes) {
    this.routes = routes;
    
    this.getRoutes = function() {
        return this.routes;
    }
    this.setRoutes = function(routes) {
        this.routes = routes;
    }
    
    // TODO split this into two functions: route & find. route calls find, then executes. find returns
    //      an object with function and parameters.
    this.route = function(url) {
        var routes = this.getRoutes();
        var func;
        var params = {};
        
        url = this.stripHash(url);
        
        if (routes[url] !== undefined) {
            // first try to find it directly
            func = window[routes[url].controller];
        } else {
            // now we need to loop through the routes with params and break them up to compare & rebuild
            Object.keys(routes).some(function(key) {
                if (key.indexOf('{') >= 0) {
                    // in case a previous route failed, clear params
                    params = {};
                    // this is a route with params, split it
                    var routeSplit = key.split('/');
                    var urlSplit = url.split('/');
                    
                    // loop through the route parts to start comparing
                    for (var i in routeSplit) {
                        if (routeSplit[i].indexOf('{') >= 0) {
                            // store the parameter
                            var cleanParam = routeSplit[i].replace(/[{}]/g, "");
                            params[cleanParam] = urlSplit[i];
                            // this is a parameter, replace the value in the url with the parameter
                            urlSplit[i] = routeSplit[i];
                        }
                        if (urlSplit.join('/') == routeSplit.join('/')) {
                            // we now have the same-ified url & route, if they match
                            // now, we know we've got the right one, so set the func
                            func = window[routes[key].controller];
                            // and stop iterating
                            return true;
                        }
                    }
                }
            });
        }

        if (typeof notFound == 'function' && typeof func !== 'function') {
            func = window['notFound'];
        }
        
        // if func is undefined, we do not have a function to call
        if (func !== undefined) {
            func(params);
            return;
        }
        return 'route not found';
        
    };

    // remove the hash if it exists
    this.stripHash = function(url) {
        if (url.substr(0,1) == '#') {
            var urlSplit = url.split('/');
            urlSplit.shift();
            url = urlSplit.join('/');
        }
        return url;
    }
    
    return this;
}