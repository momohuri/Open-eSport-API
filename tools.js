module.exports = {
	
	setCategories: function(cat){
		var categories = [];

		if((cat.toString().toLowerCase().indexOf("starcraft") > -1) || (cat.toString().toLowerCase().indexOf("sc2") > -1))
			categories.push("sc2");
		if((cat.toString().toLowerCase().indexOf("dota2") > -1) || (cat.toString().toLowerCase().indexOf("defense of the ancients") > -1))
			categories.push("dota2");
		if((cat.toString().toLowerCase().indexOf("lol") > -1) || (cat.toString().toLowerCase().indexOf("league of legends") > -1))
			categories.push("lol");
		if((cat.toString().toLowerCase().indexOf("tf2") > -1))
			categories.push("tf2");
		if((cat.toString().toLowerCase().indexOf("csgo") > -1) || (cat.toString().toLowerCase().indexOf("counter-strike") > -1))
			categories.push("csgo");
		if((cat.toString().toLowerCase().indexOf("sm") > -1))
			categories.push("sm");
		if((cat.toString().toLowerCase().indexOf("ql") > -1))
			categories.push("ql");
		if((cat.toString().toLowerCase().indexOf("sf4") > -1) || (cat.toString().toLowerCase().indexOf("street fighter") > -1) || 
			(cat.toString().toLowerCase().indexOf("baston") > -1))
			categories.push("sf4");

		return categories;
	}	
};