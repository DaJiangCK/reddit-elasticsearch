'use strict';

const allowed = ['title', 'url'];
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});
const axios = require('axios');
module.exports = function (Post) {
  Post.bulkInsert = function (cb) {
    axios.get('https://www.reddit.com/r/nba/new.json?restrict_sr=1')
      .then(function (response) {
        // handle success
        const filteredArray = filterData(response.data.data.children);
        bulkInsert(filteredArray, cb);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })

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

    const bulkInsert = function (data, cb) {
      client.bulk({
        body: data
      }, (err, resp) => {
        if (err) console.log(err);
        cb(null, "Bulk Insert is done!");
      });
    }
  }

  Post.search = function (text, cb) {
    client.search({
      index: 'redditnba',
      type: 'post',
      q: text
    }).then(function (resp) {
      let results = [];
      resp.hits.hits.forEach(function (h) {
        results.push(h._source);
      });
      cb(null, results);
    }, function (err) {
      throw new Error(err);
    });
  }
  Post.remoteMethod('bulkInsert', {
    http: {
      verb: 'post'
    },
    returns: {
      arg: 'msg',
      type: 'string'
    }
  });
  Post.remoteMethod('search', {
    accepts: {
      arg: 'text',
      type: 'string'
    },
    returns: {
      arg: 'results',
      type: 'array'
    },
    http: {
      verb: 'get'
    }
  });
};
