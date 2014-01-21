define(['./api'], function(api){

	return {

		init: function(app){
			app.post('/find', api.find);
            app.get('/categories', api.categories);
            app.get('/city', api.city);

		}

	}
});