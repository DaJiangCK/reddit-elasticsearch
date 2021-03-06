'use strict';

const allowed = ['title', 'url'];
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});
const axios = require('axios');
module.exports = function (Post) {

  Post.createIndex = function (cb) {
    client.indices.create({
      index: 'reddit'
    }).then(res => {
      cb(null, res);
    }).catch(err => {
      cb(err);
    });
  }

  Post.bulkInsert = function (subreddit, cb) {
    axios.get('https://www.reddit.com/r/' + subreddit + '/new.json?restrict_sr=1')
      .then(function (response) {
        // handle success
        const filteredArray = filterData(response.data.data.children);
        bulkInsert(filteredArray, cb);
      })
      .catch(function (err) {
        // handle err
        cb(err);
      })

    const filterData = function (data) {
      const filteredArray = [];
      data.map((content, index) => {
        filteredArray.push({
          "index": {
            "_index": "reddit",
            "_type": subreddit,
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
        if (err) return cb(err);
        cb(null, resp);
      });
    }
  }

  Post.search = function (subreddit, text, cb) {
    client.search({
      index: 'reddit',
      type: subreddit,
      q: text
    }).then(resp => {
      let results = [];
      resp.hits.hits.forEach(function (h) {
        results.push(h._source);
      });
      cb(null, results);
    }).catch(err => {
      cb(err);
    });
  }

  Post.bulkDelete = function (cb) {
    client.indices.delete({
      index: 'reddit'
    }).then(res => {
      cb(null, res);
    }).catch(err => {
      cb(err);
    })
  }

  Post.remoteMethod('createIndex', {
    http: {
      verb: 'post'
    },
    returns: {
      arg: 'msg',
      type: 'string'
    }
  });
  Post.remoteMethod('bulkInsert', {
    http: {
      verb: 'post'
    },
    accepts: {
      arg: 'subreddit',
      type: 'string'
    },
    returns: {
      arg: 'msg',
      type: 'string'
    }
  });
  Post.remoteMethod('search', {
    accepts: [{
        arg: 'subreddit',
        type: 'string'
      },
      {
        arg: 'text',
        type: 'string'
      },
    ],
    returns: {
      arg: 'results',
      type: 'array'
    },
    http: {
      verb: 'get'
    }
  });
  Post.remoteMethod('bulkDelete', {
    http: {
      verb: 'delete'
    },
    returns: {
      arg: 'msg',
      type: 'string'
    }
  });
};
