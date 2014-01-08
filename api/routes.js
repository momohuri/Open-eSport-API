define(['./api'], function(api){

	return {

		init: function(app){
			app.get('/lang/:lang', api.findByLanguage);
			app.get('/website/:website', api.findByWebsite);
			app.get('/game/:game', api.findByGame);
			app.get('/duo/:website/:game', api.findByWebsiteAndGame);
			app.get('/posts/all/', api.findAllMobile);
			app.get('/posts/all', api.findAllMobile);
			app.get('/posts/mobile/', api.findAllMobile);
			app.get('/posts/mobile', api.findAllMobile);
			app.get('/posts/web', api.findAll);
			// app.get('/remove/all', api.removeAll);
		}

	}
});