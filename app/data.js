const fs = require('fs')
const _ = require('underscore')

const files = fs.readdirSync('./app/data/equipment/')
const data = []


// Function below is combining all JSON data files into a function called getData

function getData() {
    // The loop to merge all JSON files together
    _.each(files, (el) => {
    const file = fs.readFileSync('./app/data/equipment/' + el).toString()
    try {
        const json = JSON.parse(file)
        json.filename = el
        data.push(json)
    } catch(err) {
        console.log(err)
    }
});

    return data;
}

module.exports = {
    getData,
}
