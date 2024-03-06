//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here


// Techspike routes START

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


// Techspike routes END



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



// Working filter for principles section - DO NOT DELETE - START

//   let sectionFilter = req.session.data.section
//   if (typeof sectionFilter === 'undefined') {
//     sectionFilter= ""
//  }
//  if (typeof sectionFilter.length) {
//     filteredResults = allData.filter(el => ( sectionFilter.indexOf(el.section) >= 0 ))
//  }

//   console.log(sectionFilter)

// Working filter for principles section - DON NOT DELETE - END



// Option 1: Only works for a single UCD discipline (content), doesn't work in conjunction with the section filter

//   let disciplineFilter = req.session.data.disciplineContent
//   if (typeof disciplineFilter === 'undefined') {
//     disciplineFilter= ""
//  }
//  if (typeof disciplineFilter.length) {
//     filteredResults = allData.filter(el => ( disciplineFilter.indexOf(el.disciplineContent) >= 0 ))
//  }

//   console.log(disciplineFilter)






// Option 2: Chris filter example test


//array of objects
// let foo = [
//   { items: ["Content design"] },
//   { items: ["Content design", "Interaction design"] },
//   { items: ["Content design", "Service design"] },
//   { items: ["Service design"] }
// ];

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



// let disciplineFilter = req.session.data.disciplineContent
// if (typeof disciplineFilter === 'undefined') {
//   disciplineFilter= ""
// }
// if (typeof disciplineFilter.length) {
//   filteredResults = allData.filter(el => ( disciplineFilter.indexOf(el.disciplineContent) >= 0 ))
// }



//   let roleFilter = req.session.data.role
//   if (typeof roleFilter === 'undefined') {
//     roleFilter= ""
//  }
//  if (typeof roleFilter.length) {
//     filteredResults = allData.filter(el => ( roleFilter.indexOf(el.role,el.role1,el.role2,el.role3) >= 0 ))
//  }


  
  req.session.data.filteredResults = filteredResults
  
}
  res.redirect('/fetf/application/v1-0/items/equipment-list') 
})




module.exports = router