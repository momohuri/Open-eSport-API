module.exports = {
	
	setCategories: function(cat){
		var category;

		if((cat.toString().toLowerCase().indexOf("starcraft") > -1) || (cat.toString().toLowerCase().indexOf("sc2") > -1))
			category = "sc2";
		if((cat.toString().toLowerCase().indexOf("dota2") > -1) || (cat.toString().toLowerCase().indexOf("defense of the ancients") > -1))
			category = "dota2";
		if((cat.toString().toLowerCase().indexOf("lol") > -1) || (cat.toString().toLowerCase().indexOf("league of legends") > -1))
			category = "lol";
		if((cat.toString().toLowerCase().indexOf("tf2") > -1))
			category = "tf2";
		if((cat.toString().toLowerCase().indexOf("csgo") > -1) || (cat.toString().toLowerCase().indexOf("counter-strike") > -1))
			category = "csgo";
		if((cat.toString().toLowerCase().indexOf("sm") > -1))
			category = "sm";
		if((cat.toString().toLowerCase().indexOf("ql") > -1))
			category = "ql";
		if((cat.toString().toLowerCase().indexOf("sf4") > -1) || (cat.toString().toLowerCase().indexOf("street fighter") > -1) || 
			(cat.toString().toLowerCase().indexOf("baston") > -1))
			category = "sf4";

		return category;
	}	
};