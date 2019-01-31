(function () {
  'use strict';

  angular.module('restlet.sdk', []);

  angular.module('restlet.sdk')
    .service('parkelsewhere', ['$http', parkelsewhere]);

  function parkelsewhere ($http) {

    var endpoint = 'https://parkelsewheredb.herokuapp.com/';
    var globalSecurity = {};
    var securityConfigurations = {};

    this.setEndpoint = setEndpoint;

    this.configureGlobalBasicAuthentication = configureGlobalBasicAuthentication(globalSecurity);
    this.configureGlobalApiToken = configureGlobalApiToken(globalSecurity);
    this.configureGlobalOAuth2Token = configureGlobalOAuth2Token(globalSecurity);

    this.configureHTTP_BASICAuthentication = configureHTTP_BASICAuthentication;

    /**
     * Loads a list of Event
     *
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     {
       "$page" : "Number of the page to retrieve. Integer value.",
       "lon" : "Allows to filter the collections of result by the value of field lon",
       "id" : "Allows to filter the collections of result by the value of field id",
       "postcode" : "Allows to filter the collections of result by the value of field postcode",
       "date" : "Allows to filter the collections of result by the value of field date",
       "$sort" : "Order in which to retrieve the results. Multiple sort criteria can be passed. Example: sort=age ASC,height DESC",
       "thing" : "Allows to filter the collections of result by the value of field thing",
       "lat" : "Allows to filter the collections of result by the value of field lat",
       "$size" : "Size of the page to retrieve. Integer value"
     }
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     [
     {
       "date" : 1511395200000,
       "id" : "sample id",
       "lat" : 1.1,
       "lon" : 1.1,
       "postcode" : "M1 5GD",
       "thing" : "sample thing"
     }
     ]
     */
    this.getEvents = function (config) {
      var url = endpoint + '/events/';

      return send('GET', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Adds a Event
     *
     * @param body - the payload; is of type Event; has the following structure:
     {
       "date" : 1511395200000,
       "id" : "sample id",
       "lat" : 1.1,
       "lon" : 1.1,
       "postcode" : "M1 5GD",
       "thing" : "sample thing"
     }
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "date" : 1511395200000,
       "id" : "sample id",
       "lat" : 1.1,
       "lon" : 1.1,
       "postcode" : "M1 5GD",
       "thing" : "sample thing"
     }
     */
    this.postEvents = function (body, config) {
      var url = endpoint + '/events/';

      return send('POST', url, addSecurityConfiguration(config, 'HTTP_BASIC'), body);
    };

    /**
     * Loads a Event
     *
     * @param eventid - REQUIRED - Identifier of the Event
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "date" : 1511395200000,
       "id" : "sample id",
       "lat" : 1.1,
       "lon" : 1.1,
       "postcode" : "M1 5GD",
       "thing" : "sample thing"
     }
     */
    this.getEventsEventid = function (eventid, config) {
      checkPathVariables(eventid, 'eventid');

      var url = endpoint + '/events/' + eventid + '';

      return send('GET', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Stores a Event
     *
     * @param eventid - REQUIRED - Identifier of the Event
     * @param body - the payload; is of type Event; has the following structure:
     {
       "date" : 1511395200000,
       "id" : "sample id",
       "lat" : 1.1,
       "lon" : 1.1,
       "postcode" : "M1 5GD",
       "thing" : "sample thing"
     }
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "date" : 1511395200000,
       "id" : "sample id",
       "lat" : 1.1,
       "lon" : 1.1,
       "postcode" : "M1 5GD",
       "thing" : "sample thing"
     }
     */
    this.putEventsEventid = function (eventid, body, config) {
      checkPathVariables(eventid, 'eventid');

      var url = endpoint + '/events/' + eventid + '';

      return send('PUT', url, addSecurityConfiguration(config, 'HTTP_BASIC'), body);
    };

    /**
     * Deletes a Event
     *
     * @param eventid - REQUIRED - Identifier of the Event
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     */
    this.deleteEventsEventid = function (eventid, config) {
      checkPathVariables(eventid, 'eventid');

      var url = endpoint + '/events/' + eventid + '';

      return send('DELETE', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Loads a list of Thing
     *
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     {
       "$page" : "Number of the page to retrieve. Integer value.",
       "$sort" : "Order in which to retrieve the results. Multiple sort criteria can be passed. Example: sort=age ASC,height DESC",
       "$size" : "Size of the page to retrieve. Integer value",
       "name" : "Allows to filter the collections of result by the value of field name",
       "id" : "Allows to filter the collections of result by the value of field id"
     }
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     [
     {
       "id" : "sample id",
       "name" : "Jay"
     }
     ]
     */
    this.getThings = function (config) {
      var url = endpoint + '/things/';

      return send('GET', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Adds a Thing
     *
     * @param body - the payload; is of type Thing; has the following structure:
     {
       "id" : "sample id",
       "name" : "Jay"
     }
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "id" : "sample id",
       "name" : "Jay"
     }
     */
    this.postThings = function (body, config) {
      var url = endpoint + '/things/';

      return send('POST', url, addSecurityConfiguration(config, 'HTTP_BASIC'), body);
    };

    /**
     * Loads a Thing
     *
     * @param thingid - REQUIRED - Identifier of the Thing
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "id" : "sample id",
       "name" : "Jay"
     }
     */
    this.getThingsThingid = function (thingid, config) {
      checkPathVariables(thingid, 'thingid');

      var url = endpoint + '/things/' + thingid + '';

      return send('GET', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Stores a Thing
     *
     * @param thingid - REQUIRED - Identifier of the Thing
     * @param body - the payload; is of type Thing; has the following structure:
     {
       "id" : "sample id",
       "name" : "Jay"
     }
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "id" : "sample id",
       "name" : "Jay"
     }
     */
    this.putThingsThingid = function (thingid, body, config) {
      checkPathVariables(thingid, 'thingid');

      var url = endpoint + '/things/' + thingid + '';

      return send('PUT', url, addSecurityConfiguration(config, 'HTTP_BASIC'), body);
    };

    /**
     * Deletes a Thing
     *
     * @param thingid - REQUIRED - Identifier of the Thing
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     */
    this.deleteThingsThingid = function (thingid, config) {
      checkPathVariables(thingid, 'thingid');

      var url = endpoint + '/things/' + thingid + '';

      return send('DELETE', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    function configureHTTP_BASICAuthentication(username, key) {
      securityConfigurations.HTTP_BASIC = {
        type: 'BASIC',
        token: 'Basic ' + btoa(username + ':' + key)
      };
    }

    function isNotAuthenticated (securityRequirementName) {
      return securityRequirementName === '_NONE';
    }

    /**
     * Enhances the provided request configuration with the configured
     * security requirements.
     *
     * One might notice that the security requirements are not explicitly defined
     * in the method signature. The reason is that one method might have zero,
     * one or more security requirement(s), so security requirements are recovered
     * dynamically from the `arguments`.
     *
     * The security configuration is defined as follow:
     *  - If no specific security requirements is defined for the method then:
     *    - if a global security is set the call will be authenticated
     *    - if no security is configured then the call will be unauthenticated
     *  - If a specific security requirements is defined for the method then:
     *    - one of them is configured and the first of them is used for the authentication
     *    - none of them is configured and an error is thrown
     *
     * @param {Object} config - a configuration object used inside the requests
     * which can contain among other things the headers & the params
     * @param {String...} requirement - the name of the security scheme to support
     */
    function addSecurityConfiguration (config) {
      var securityRequirements = Array.prototype.slice.call(arguments, 1);

      return securityConfigurationHelper(config, globalSecurity, 
        securityConfigurations, isNotAuthenticated, 
        securityRequirements);
    }

    /**
     * Sends a request to server.
     *
     * @param methodName - The name of method: GET, POST, PUT, DELETE
     * @param url - url
     * @param body - body
     * @param config - Object describing the request to be made and how it should be processed.
     * @returns{HttpPromise} a promise object
     */
    function send (methodName, url, config, body) {
      return sendHelper ($http, methodName, url, config, body);
    };

    /**
     * Sets a new endpoint.
     *
     * @param newEndPoint - the endpoint to be set.
     */
    function setEndpoint (newEndPoint) {
      endpoint = newEndPoint;
    }
  }

  function securityConfigurationHelper (config, globalSecurity, 
    securityConfigurations, isNotAuthenticated, 
    securityRequirements) {
    
    if (securityRequirements.length === 0) {
      return enhanceWithGlobalSecurityIfRequired(config, globalSecurity);
    }

    for (var i = 0; i < securityRequirements.length; i++) {
      var securityRequirementName = securityRequirements[i];
      var securityConfig = securityConfigurations[securityRequirementName];

      if (isNotAuthenticated(securityRequirementName)) {
        return angular.copy(config);
      } else if (angular.isDefined(securityConfig)) {
        return enhanceConfigurationWithSpecificSecurity(config, securityConfig);
      }
    }

    throw new Error('There is no configured security scheme found among: ' + securityRequirements.join(', '));
  }

  function enhanceWithGlobalSecurityIfRequired (config, globalSecurity) {
    if (!isEmpty(globalSecurity)) {
      config = angular.copy(config);
      config = enhanceConfigurationWithSpecificSecurity(config, globalSecurity);
    }

    return config;
  }

  function enhanceConfigurationWithSpecificSecurity (config, securityConfig) {
    config = angular.copy(config) || {};

    if (!config.headers) {
      config.headers = {};
    }

    if (!config.params) {
      config.params = {};
    }

    if (securityConfig.type === 'BASIC') {
      config.headers.Authorization = securityConfig.token;
    } else if (securityConfig.type === 'API_KEY' && securityConfig.placement === 'HEADER') {
      config.headers[securityConfig.name] = securityConfig.token;
    } else if (securityConfig.type === 'API_KEY' && securityConfig.placement === 'QUERY') {
      config.params[securityConfig.name] = securityConfig.token;
    } else if (securityConfig.type === 'OAUTH2') {
      config.headers.Authorization = securityConfig.token;
    } else {
      throw new Error('Cannot update config for unknown scheme');
    }

    return config;
  }

  /**
   * Validates the path variables to ensure that those are properly defined
   * since any variable defined in the path should be defined to avoid having
   * something like '/foo/undefined/bar'
   *
   * The arguments are dynamically recovered from the `arguments` object and
   * are looked for by pair where
   *   - the 2n set (even indexes) are the values
   *   - the 2n + 1 set (odd indexes) are the labels for the error reports
   */
  function checkPathVariables () {

    var errors = [];

    for (var i = 0; i < arguments.length; i += 2) {
      if (angular.isUndefined(arguments[ i ])) {
        errors.push(arguments[ i + 1 ]);
      }
    }

    if (errors.length > 0) {
      throw new Error('Missing required parameter: ' + errors.join(', '));
    }
  };

  /**
   * Sets up the authentication to be performed through basic auth.
   *
   * @param username - the user's username
   * @param password - the user's password
   */
  function configureGlobalBasicAuthentication (globalSecurity) {
    return function (username, password) {
      globalSecurity.type = 'BASIC';
      globalSecurity.token = 'Basic ' + btoa(username + ':' + password);
    };
  };

  /**
   * Sets up the authentication to be performed through oAuth2 protocol
   * meaning that the Authorization header will contain a Bearer token.
   *
   * @param token - the oAuth token to use
   */
  function configureGlobalOAuth2Token (globalSecurity) {
    return function (token) {
      globalSecurity.type = 'OAUTH2';
      globalSecurity.token = 'Bearer ' + token;
    };
  };

  /**
   * Sets up the authentication to be performed through API token.
   *
   * @param tokenName - the name of the query parameter or header based on the location parameter.
   * @param tokenValue - the value of the token.
   * @param location - the location of the token, either header or query.
   */
  function configureGlobalApiToken (globalSecurity) {
    return function (tokenName, tokenValue, location) {
      if (angular.isUndefined(location)) {
        location = 'header';
      }

      if (location !== 'header' && location !== 'query') {
        throw new Error('Unknown location: ' + location);
      }

      globalSecurity.type = 'API_KEY';
      globalSecurity.placement = location;
      globalSecurity.name = tokenName;
      globalSecurity.token = tokenValue;
    };
  };

  /**
   * Sends a request to server.
   *
   * @param $http - the angular $http provider
   * @param methodName - The name of method: GET, POST, PUT, DELETE
   * @param url - url
   * @param body - body
   * @param config - Object describing the request to be made and how it should be processed.
   * @returns{HttpPromise} a promise object
   */
  function sendHelper ($http, methodName, url, config, body) {

    config = config || {};

    return $http({
      method: methodName,
      url: url,
      params: angular.extend({}, config.params),
      data: body,
      headers: angular.extend({}, config.headers)
    });
  };

  function isEmpty (obj) {
    return Object.keys(obj).length === 0;
  }

})();