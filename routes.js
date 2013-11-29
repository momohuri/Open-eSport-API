define(['api'], function(api){

	return {

		init: function(app){
			app.get('/lang/:lang', api.findByLanguage);
			app.get('/website/:website', api.findByWebsite);
			app.get('/game/:game', api.findByGame);
			app.get('/duo/:website/:game', api.findByWebsiteAndGame);
			app.get('/posts/all/', api.findAll);
			app.get('/posts/all', api.findAll);
			// app.get('/remove/all', api.removeAll);
		}

	}
});