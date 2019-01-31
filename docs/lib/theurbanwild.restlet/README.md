## restlet Generated SDK

#### Input source
__theurbanwild - version: 1.4.0__


#### Structure

* `module.js` is the generated module containing a service
* `README.md` the current file

#### Usage

* Unzip the downloaded SDK into your project dependencies folder e.g.: myProject/libs/

* The module can be used directly. Considering your API in module.js with the following operations:
  * GET /companies/{companyId} in SDK myApi
  * POST /companies in SDK myApi


* Create a file `app.js` and inject the SDK as a dependency for your client module:

```javascript
// Declare the generated module as a dependency for your application
angular.module('appClient', [ 'restlet.myApi' ])

// Inject the services you want to use from the generated module
.controller('MainCtrl', function ($scope, $log,
                                  myApi) {

  // Configure one of the security schemes defined in the API definition. The security
  // configuration exposes one method per scheme, with the name prefixed with configure
  // and suffixed with Authentication.
  myApi.configureHttpBasicAuthentication("login", "password");

  // Get company list without config
  myApi.getCompanyList()
    .then(function (response) {
      $log.info('Get company list - Response status:' + response.status);
    })
    .catch(function (response) {
      $log.error('Get company list - Request failed with status:' + response.status);
    });

  var config = {
    params: {
      name: 'Nantes, France'
    }
  };

  // Adds a company
  var body = {
    tags: [ 'test tag' ],
    id: 'test id',
    address: {
      zipcode: 'test zipcode',
      street: 'test street',
      city: 'test city'
    },
    name: 'test name'
  };

  myApi.postCompanyList(body)
    .then(function (response) {
      $log.info('Add a company - Response status: ' + response.status);
    })
    .catch(function (response) {
      $log.error('Add a company - Request failed with status:' + response.status);
    });

  // Gets a company by ID
  var id = '00b00381-4810-11e5-b106-c598859c3466';

  myApi.getCompany(id)
    .then(function (response) {
      $log.info('Get a company by Id: ' + id + ' - Response status:' + response.status);
    })
    .catch(function (response) {
      $log.error('Get a company by Id: ' + id + ' - Request failed with status:' + response.status);
    });
```

##### Authentication

The SDK provides two authentication mechanisms:

* the first is global and is used, if configured, for any request which does not have any specified security
* the second is user-specific security which must be configured if some requests require it

###### Global authentication

The global authentication is provided through 3 standard methods:

* `configureGlobalBasicAuthentication(username, password)` sets automatically for each requests the `Authorization: Basic` header
* `configureGlobalApiToken(tokenName, tokenValue, location)` sets the API token in the specified location (either `HEADER`
or `QUERY`) using the provided name and value
* `configureGlobalOAuth2Token(token)` sets automatically for each requests the `Authorization: Bearer` header

###### User-specific authentication

####### theurbanwild

The list of user-specific authentication mechanism for theurbanwild is the following:

* `configureHTTP_BASICAuthentication`
