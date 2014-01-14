define(['./api'], function(api){

	return {

		init: function(app){
			app.get('/api', api.find);

		}

	}
});