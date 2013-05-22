var http = require('http');

http.createServer(function(request, response) {
	response.writeHead(200);
	response.write("Hello, this is dog.");
	
	SetInterval(getRssFeed, 3000);
	
	response.end();
}).listen(8080);
console.log('Listening on port 8080');

var FeedParser = 	require('feedparser'), 
					request = require('request');
					
var getRssFeed = new request('http://www.esportsfrance.com/rss/esports.rss')
	  .pipe(new FeedParser())
	  .on('error', function(error) {
  	    console.error(error);
	  })
	  .on('article', function (article) {
  	    console.log('Got article: %s', article.title || article.description);
	  })
	  .on('end', function () {
	   // do the next thing
	  });