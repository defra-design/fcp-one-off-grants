//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here


// FETF items individual pages START

const _ = require('underscore')
const { getData } = require('../app/data')
const data = getData()

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

router.get('/fetf/application/v1-0/items/equipment-list', (req, res) => {
    const sortedData = _.sortBy(data, 'principleTitle')
    const groupedData = _.groupBy(sortedData, 'sectionNumber')
    const allData = _.sortBy(data, 'sectionNumber')
    // console.log(groupedData)
    res.render('fetf/application/v1-0/items/equipment-list.html', { groupedData, sortedData, allData });
})

// router.get('/:principleTitle', (req, res) => {
//     const { principleTitle } = req.params
//     const item = _.findWhere(data, {principleTitle: capitalizeFirstLetter(principleTitle.replace('-', ' '))})
//     res.render('principle.html', { item });
// })

router.get('/fetf/application/v1-0/items/:termName', (req, res) => {
    const { termName } = req.params
    const item = _.findWhere(data, {termName: capitalizeFirstLetter(termName.replace('-', ' '))})
    res.render('fetf/application/v1-0/items/equipment.html', { item })
})

router.get('/fetf/application/v1-0/item-quantity/:termName', (req, res) => {
  const { termName } = req.params
  const item = _.findWhere(data, {termName: capitalizeFirstLetter(termName.replace('-', ' '))})
  res.render('fetf/application/v1-0/item-quantity.html', { item })
})

router.get('/fetf/application/v1-0/item-quantity/:termName', (req, res) => {
  const { termName } = req.params
  const item = _.findWhere(data, {termName: capitalizeFirstLetter(termName.replace('-', ' '))})
  res.render('fetf/application/v1-0/item-quantity.html', { item })
})



// FETF items individual pages END



// FETF items filters START

router.post('/fetf/application/v1-0/items/equipment-list/apply-filters', (req, res) => {
  if (req.session.data.clearFilters == "true") {
    req.session.data.section = ""
    req.session.data.role = ""
    req.session.data.disciplines = ""
    req.session.data.filteredResults = ""
    req.session.data.clearFilters = ""
  } else {

  console.log('success test')
  
  const allData = _.sortBy(data, 'sectionNumber')
  console.log(data.length)
  // console.log(allData)

  // let filteredResults = ''
  // console.log(filteredResults)

//filters
let categoryFilter = req.session.data.category

//set global scope of filtered results
let filteredResults = [];

//loop through each of the objects
for (i of allData) {
  // console.log(i.disciplines);
  //if the object contains a matching value from the filter then add it to the filtered results array

  if (typeof categoryFilter === 'undefined') {
    categoryFilter= ""
 }  
  if (i.category.some((value) => categoryFilter.includes(value))) {
    filteredResults.push(i);
  }
}

console.log(categoryFilter);
  
  req.session.data.filteredResults = filteredResults
  
}
  res.redirect('/fetf/application/v1-0/items/equipment-list') 
})

// FETF items filters END



// FETF journey branching START


// FETF item selection

router.post('/fetf-items-selection', function(request, response) {
  response.redirect("/fetf/application/v1-0/item-quantity")
})


// FETF item quantity

router.post('/fetf-add-to-selected-items', function(request, response) {
  var quantity = Number(request.body['quantity'])
  var termName = request.body['termName']
  var itemExists = false
  for (var selectedItem of request.session.data['selected-items']){
    if (selectedItem.termName == termName) {
      itemExists = true
      selectedItem.quantity += quantity
      selectedItem.grantTotal = Number(selectedItem.quantity) * Number(selectedItem.grantValue.replace(',',''))
    }
  }
  if (itemExists == false){
    const item = _.findWhere(data, {termName: termName})
    item.quantity = quantity
    item.grantTotal = Number(item.quantity) * Number(item.grantValue.replace(',',''))
    request.session.data['selected-items'].push(item)
  }
  
  response.redirect("/fetf/application/v1-0/selected-items")
})


// FETF claims summary

router.post('/fetf-add-to-selected-items-claims', function(request, response) {
  var quantity = Number(request.body['quantity'])
  var termName = request.body['termName']
  var itemExists = false
  for (var selectedItem of request.session.data['selected-items']){
    if (selectedItem.termName == termName) {
      itemExists = true
      selectedItem.quantity += quantity
      selectedItem.grantTotal = Number(selectedItem.quantity) * Number(selectedItem.grantValue.replace(',',''))
    }
  }
  if (itemExists == false){
    const item = _.findWhere(data, {termName: termName})
    item.quantity = quantity
    item.grantTotal = Number(item.quantity) * Number(item.grantValue.replace(',',''))
    request.session.data['selected-items'].push(item)
  }
  
  response.redirect("/fetf/_includes/body-content_claim-detail-main-block")
})


// FETF item summary

router.post('/selected-items-summary', function(request, response) {
  response.redirect("/fetf/application/v1-0/select-items-complete")
})


// FETF items section complete question (not used, bring it back if we want to include the 'Have you completed this section' question)

router.post('/fetf-items-complete', function(request, response) {
  var sectionComplete = request.session.data['haveYouCompletedThisSection']
  if (sectionComplete == "yes"){
      response.redirect("/fetf/activity-list/v2-0/?fetf-status=01b&fetf-apply=02b&fetf-agree=01&fetf-claim=01")
  } else {
      response.redirect("/fetf/activity-list/v2-0/?fetf-status=01b&fetf-apply=02a&fetf-agree=01&fetf-claim=01")
  }
})






// FETF items business address question

router.post('/fetf/fetf-items-business-address', function(request, response) {
  var aboutBusinessLocation = request.session.data['stored-business-address']
  if (aboutBusinessLocation == "Yes"){
      response.redirect("/fetf/application/v1-0/about-items/equipment-contracting")
  } else {
      response.redirect("/fetf/application/v1-0/about-items/equipment-location-details")
  }
})






// FETF items other locations

router.post('/fetf-items-other-locations', function(request, response) {
  response.redirect("/fetf/application/v1-0/about-items/equipment-contracting")
})


// FETF items contracting question

router.post('/fetf/fetf-items-contracting', function(req, res) {
  var aboutContracting = req.session.data['for-contracting']
  if (aboutContracting == "Yes"){
      res.redirect("/fetf/application/v1-0/about-items/equipment-contractor-details")
  } else {
      res.redirect("/fetf/application/v1-0/about-items/livestock-information")
  }
})





// FETF items contracting other question

router.post('/fetf-contractor-details', function(request, response) {
  response.redirect("/fetf/application/v1-0/about-items/livestock-information")
})


// FETF items contracting other question

router.post('/fetf-livestock-information', function(request, response) {
  response.redirect("/fetf/application/v1-0/about-items/equipment-summary")
})


// FETF items summary

router.post('/fetf-items-summary', function(request, response) {
  response.redirect("/fetf/activity-list/v2-0/?fetf-status=01b&fetf-apply=02d&fetf-agree=01&fetf-claim=01")
})






// FETF farm assurance schemes

router.post('/fetf-assurance-schemes', function(request, response) {
  response.redirect("/fetf/application/v1-0/business-details/livestock-schemes")
})


// FETF livestock health schemes

router.post('/fetf-livestock-schemes', function(request, response) {
  response.redirect("/fetf/application/v1-0/business-details/check-your-details")
})


// FETF check business details

router.post('/fetf-check-business-details', function(request, response) {
  response.redirect("/fetf/activity-list/v2-0/?fetf-status=01b&fetf-apply=02a&fetf-agree=01&fetf-claim=01")
})

// FETF submit application

router.post('/fetf-submit-application', function(request, response) {
  response.redirect("/fetf/application/v1-0/submit-application/confirmation")
})


// FETF journey branching END

module.exports = router

// Claims item details


router.get('/fetf/claim/v1-0/claim-item-details2/:termName', (req, res) => {
  const { termName } = req.params
  const item = _.findWhere(data, {termName: capitalizeFirstLetter(termName.replace('-', ' '))})
  res.render('/fetf/claim/v1-0/claim-item-detail2.html', { item })
})





// FETF item quantity livestock

router.post('/fetf-add-to-selected-items-livestock', function(request, response) {
  var quantity = Number(request.body['quantity'])
  var termName = request.body['termName']
  var itemExists = false
  for (var selectedItem of request.session.data['selected-items']){
    if (selectedItem.termName == termName) {
      itemExists = true
      selectedItem.quantity += quantity
      selectedItem.grantTotal = Number(selectedItem.quantity) * Number(selectedItem.grantValue.replace(',',''))
    }
  }
  if (itemExists == false){
    const item = _.findWhere(data, {termName: termName})
    item.quantity = quantity
    item.grantTotal = Number(item.quantity) * Number(item.grantValue.replace(',',''))
    request.session.data['selected-items'].push(item)
  }
  
  response.redirect("/fetf/application/v1-0/selected-items-livestock")
})



// Added for livestock questions (test)
router.get('/fetf/application/v1-0/livestock-information/:termName', (req, res) => {
  const { termName } = req.params
  const item = _.findWhere(data, {termName: capitalizeFirstLetter(termName.replace('-', ' '))})
  res.render('fetf/application/v1-0/livestock-information.html', { item })
})


// FETF business structure

router.post('/fetf-business-structure', function(request, response) {
  response.redirect("/fetf/application/v1-0/business-details/land-details")
})





// FETF business structure

router.post('/fetf-land-details', function(request, response) {
  response.redirect("/fetf/application/v1-0/business-details/farm-assurance")
})



//Claim task status

router.post('/fetf/set-status', function(request, response) {
  var termName = request.body['termName']
  for (var selectedItem of request.session.data['selected-items']){
    if (selectedItem.termName == termName) {
      selectedItem.status = "Completed"
    }
  }
  
  response.redirect("/fetf/claim/v1-0/upload")
})



//Feedback fetf

router.post('/fetf/feedback-question', function(req, res) {

  var giveFeedback = req.session.data['give-feedback']


  if (giveFeedback == "true"){

    res.redirect('/fetf/feedback-submit')
  } else {
    res.redirect('/fetf/help')
  }

})

//Feedback ftf

router.post('/ftf/feedback-question', function(req, res) {
  var giveFeedback = req.session.data['give-feedback']

  if (giveFeedback == "true"){
    res.redirect('/ftf/feedback-submit')
  } else {
    res.redirect('/ftf/help')
  }

})