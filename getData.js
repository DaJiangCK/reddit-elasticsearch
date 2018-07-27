const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'trace'
});

const exists = client.getSource({
	index: 'redditnba',
	type: 'post',
	id: 1
  })
  .then(result => {
	  console.log(result);
  });