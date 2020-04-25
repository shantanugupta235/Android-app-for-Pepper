// zmienne cookie_name i cookie_time sa generowane przez php w header.html

function set_cookie(name, val, days) {
	$.cookie(name, val, { expires: days, path: '/' } );
}

function get_cookie(name) {
	return $.cookie(name);
}

//dozwolone wartosci option dla funkcji cookie_helper_set i cookie_helper_get
//sa wymienione w includes/CookieHerlper.php

function cookie_helper_set(option, value) {
	var cookie = {};
	var cookie_json = get_cookie(cookie_name);
	if(cookie_json) {
		cookie = JSON.parse(cookie_json);
		if(!cookie) {
			cookie = {};
		}
	}
	cookie[option] = value;
	set_cookie(cookie_name, JSON.stringify(cookie), cookie_time / 60 / 60 / 24);
}

function cookie_helper_get(option) {
	var cookie_json = get_cookie(cookie_name);
	if(!cookie_json) {
		return null;
	}
	var cookie = JSON.parse(cookie_json);
	if(!cookie) {
		return null;
	}
	return cookie[option];
}