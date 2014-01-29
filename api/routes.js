define(['./api'], function(api){

	return {

		init: function(app){
			app.get('/find', api.find);
            app.get('/categories', api.categories);
            app.get('/city', api.city);

		}

	}
});