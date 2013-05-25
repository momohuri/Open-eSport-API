//Modules
var http 			= require('http');
var FeedParser 		= require('feedparser'), 
request 			= require('request');
var mongoose 		= require('mongoose');

//Fichiers
var articleClass 	= require('./article_class');

//mongodb
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback(){
	console.log("WORK");
});

var articleSchemaMongo = mongoose.Schema({
	title: 			String,
	website: 		String,
	thumbnail: 		String,
	link: 			String,
	description: 	String,
	pubDate: 		String,
	author: 		String,
	titleDate: 		String
})

var ArticleMongo = mongoose.model('Article', articleSchemaMongo);

// ArticleMongo.find(function (err, articles){
// 	console.log(articles);
// })

//Lancement du serveur http (pour les tests)
http.createServer(function(request, response) {
	response.writeHead(200);
	response.write("Hello, this is dog.");
	//var articleTest = new articleClass.Article("title", "website", "thumbnail", "url", "description", "pubDate", "author");
	
	getRssFeed();
	
	
	response.end();
}).listen(8081);

console.log('Listening on port 8080');


//Interval de temps entre chaque lancement du parser RSS
//setInterval(getRssFeed, 3000);

//Déclaration du tableau d'objets Article
var rssArray = new Array();

//Fonction de parsing xml			
function getRssFeed(){
	request('http://www.esportsfrance.com/rss/esports.rss')
	  .pipe(new FeedParser())
	  .on('error', function(error) {
  	    console.error(error);
	  })
	  .on('article', function(article) {
		  rssArray.push(generateArticle(article));
	  })
	  .on('end', function () {
	   // do the next thing
	  });
  
	console.log(rssArray.length);
  	for(i = 0 ; i < rssArray.length ; i++){
  		console.log(rssArray[i].link);
  	}
};

function generateArticle(article){
	var articleSent = new articleClass.Article(article.title, "esfr", "sc2", article.link, article.description, article.pubDate, article.author);
	var articleMongo = new ArticleMongo({ 
		title: 			articleSent.title, 
		website: 		articleSent.website,
		thumbnail: 		articleSent.thumbnail,
		link: 			articleSent.link,
		description: 	articleSent.description,
		pubDate: 		articleSent.pubDate,
		author: 		articleSent.author,
		titleDate: 		articleSent.title + "-" + articleSent.pubDate
	});
	articleMongo.save();
	//console.log(article);
	return articleSent;
}