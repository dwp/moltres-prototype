//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Find an address plugin
const findAddressPlugin = require("find-an-address-plugin");

// Logging session data  
// This code shows in the terminal what session data has been saved.
router.use((req, res, next) => {    
    const log = {  
      method: req.method,  
      url: req.originalUrl,  
      data: req.session.data  
    }  
    console.log(JSON.stringify(log, null, 2))  
   
  next()  
})  

// This code shows in the terminal what page you are on and what the previous page was.
router.use('/', (req, res, next) => {  
    res.locals.currentURL = req.originalUrl; //current screen  
    res.locals.prevURL = req.get('Referrer'); // previous screen
  
  console.log('folder : ' + res.locals.folder + ', subfolder : ' + res.locals.subfolder  );
  
    next();  
  });

  // Routing for the example journey. 

router.post('/V1/hig-qs/adjustments/adjustments-detail', function(request, response) {

	var adjustmentNeeded = request.session.data['adjustment-needed']
	if (adjustmentNeeded == 'Yes'){
		response.redirect("/V1/hig-qs/adjustments/adjustments-detail")
	} else {
		response.redirect("/V1/hig-qs/adjustments/adjustments-check-answers")
	}
})

router.post('/V1/hig-qs/adjustments/lang-options', function(request, response) {

	var langPrefs = request.session.data['lang-prefs']
	if (langPrefs == 'Yes'){
		response.redirect("/V1/hig-qs/adjustments/lang-options")
	} else {
		response.redirect("/V1/hig-qs/adjustments/lang-prefs-check-answers")
	}
})

router.post('/V2/agent-checks/resolve-this-issue-idv', function (request, response) {

  var addressMatch = request.session.data['whereDoYouLive']

  if (addressMatch === 'yes') {
    response.redirect('/V2/agent-checks/pre-checks-no-issue')
  } 
  else if (addressMatch === 'no') {
    response.redirect('/V2/agent-checks/resolve-this-issue-idv')
  } 
  else {
    response.redirect('/V2/agent-checks/pre-checks-ra-paused')
  }

})

router.post('/V2/agent-checks/pre-checks-ra-paused', function (request, response) {

  var confirmAddress = request.session.data['confirmAddress']

  if (confirmAddress === 'yes') {
    response.redirect('/V2/agent-checks/add-cmr-note')
  } 
  else if (confirmAddress === 'no') {
    response.redirect('/V2/agent-checks/pre-checks-ra-issue')
  } 
  else if (confirmAddress === 'later') {
    response.redirect('/V2/agent-checks/pre-checks-ra-paused')
  } 
  else if (confirmAddress === 'false') {
    response.redirect('/V2/agent-checks/pre-checks-no-issue')
  } 
  else {
    // safety fallback if nothing selected
    response.redirect('/V2/agent-checks/pre-checks-ra-paused')
  }

})




findAddressPlugin(router);



  