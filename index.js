const allowed = ['title', 'url'];
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'trace'
});
const axios = require('axios');

axios.get('https://www.reddit.com/r/nba/new.json?restrict_sr=1')
	.then(function (response) {
		// handle success
		const filteredArray = filterData(response.data.data.children);
		bulkInsert(filteredArray);
	})
	.catch(function (error) {
		// handle error
		console.log(error);
	})
	.then(function () {
		console.log('Done');
	});

const filterData = function (data) {
	const filteredArray = [];
	data.map((content, index) => {
		filteredArray.push({
			"index": {
				"_index": "redditnba",
				"_type": "post",
				"_id": index
			}
		});
		const filtered = Object.keys(content.data)
			.filter(key => allowed.includes(key))
			.reduce((obj, key) => {
				obj[key] = content.data[key];
				return obj;
			}, {});
		filteredArray.push(filtered);
	});
	return filteredArray;
}

const bulkInsert = function (data) {
	client.bulk({
		body: data
	}, (err, resp) => {
		if (err) console.log(err);
	});
}