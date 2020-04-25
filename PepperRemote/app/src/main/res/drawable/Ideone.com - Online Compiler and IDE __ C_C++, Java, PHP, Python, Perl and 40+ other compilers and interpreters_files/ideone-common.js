var lang_map = {
		27: "csharp",
		114: "go",
		121: "groovy",
		11: "c_cpp",
		1: "c_cpp",
		44: "c_cpp",
		34: "c_cpp",
		43: "objectivec",
		111: "clojure",
		10: "java",
		55: "java", // Java7
		35: "javascript",
		112: "javascript",
		26: "lua",
		8: "ocaml",
		3: "perl",
		54: "perl",
		29: "php",
		4: "python",
		116: "python",
		17: "ruby",
		39: "scala",
		28: "sh",
		40: "sql",
		62: "text",
		13: "assembly_x86",
		45: "assembly_x86",
		42: "assembly_x86",
		21: "haskell",
		22: "pascal",
		2: "pascal",
		85: "swift",
		50: "vbscript",
		7: "ada",
		// 105: "AWK", brak
		// 104: "AWK", brak
		110: "c_cpp", // BC lang, "syntax similar to the C programming language."
		// 12: "brainfuck", brak
		81: "c_cpp",
		41: "c_cpp",
		82: "c_cpp",
		14: "clips",
		118: "cobol",
		106: "cobol",
		91: "coffee",
		31: "lisp",
		32: "lisp",
		102: "d",
		84: "d",
		20: "d",
		48: "dart",
		96: "elixir",
		36: "erlang",
		// 124: "f#", brak
		// 92: "fantom", brak
		107: "forth",
		5: "fortran",
		98: "java", // gosu lang
		// 16: "icon", brak
		//  9: "intercal", brak
		47: "kotlin",
		30: "csharp", // nemerle lang, "It has a simple C#-like syntax"
		// 25: "nice",
		122: "python", // nice lang, "The syntax of Nim is similar to Python."
		56: "javascript",
		83: "objectivec",
		127: "matlab",
		// 119: "oz", brak
		94: "lisp",
		19: "c_cpp", // pike lang, "syntax similar to that of C"
		15: "prolog",
		108: "prolog",
		99: "python",
		126: "python",
		117: "r",
		// 95: "racket", brak
		93: "rust",
		33: "scheme",
		97: "scheme",
		18: "scheme",
		// 23: "smalltalk", brak
		38: "tcl",
		62: "text",
		// 115: "unlambda", brak
		101: "vbscript",
		6: "text", // whitespace lang
};

var lang_ace_options = {
		6: {
			showInvisibles: true
		}
};

function changeAceOptions(editor, langId) {
	// default options
	editor.setOptions({
		showInvisibles: false
	});
	
	if( lang_ace_options[langId] != undefined ){
		editor.setOptions(lang_ace_options[langId]);
		// nie każda opcja działa przez setOptions więc jak będzie więcej opcji to będzie trzeba zmieniać każdą opcję osobno (if true then set)
	}
	
	if(jQuery.isEmptyObject(ace_options) == false) {
		editor.setTheme(ace_options.theme);
		editor.setKeyboardHandler(ace_options.keyboard_handler);
		editor.setFontSize(ace_options.font_size);
		editor.setShowPrintMargin(ace_options.print_margin);
		editor.setPrintMarginColumn(ace_options.print_margin_column);
		editor.setHighlightGutterLine(ace_options.highligth_gutter_line);
		editor.setHighlightSelectedWord(ace_options.highlight_selected_word);
		editor.setHighlightActiveLine(ace_options.highlight_active_line);
		editor.setShowFoldWidgets(ace_options.show_fold_widgets);
		
		editor.getSession().setUseWrapMode(ace_options.use_wrap_mode);
		
		editor.setOption('showGutter', ace_options.show_gutter);
		editor.setOption('tabSize', ace_options.tab_size);
		
		// user force show invisibles option
		if(ace_options.show_invisibles != 0) {
			editor.setOption('showInvisibles', ace_options.show_invisibles == 1 ? true : false);
		}
	}
}

var queueApplManager = $.manageAjax.create('queueApplManager', {queue: true});
var statusCodes = {};
var loader_img = '<img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>';
var ok_img = '<img src="/gfx2/img/ok.png" style="height: 10px;" />';

function alertIdeoneGeneratedError(data) {
	alert("Error occurred.\n" + "Error code: " + data.error_code + "\n" + "Error description: " + data.description);
}

function masstestGetStatus(id) {
	queueApplManager.add({
        url: "/masstest/status/" + id + "/",
        dataType: 'html',
        success: function(data) {
			$('#solutions').html(data);
			bindHighLightRows();
			bindClickableRows();
			setTimeout("masstestGetStatus(" + id + ")", 4000);
        }
	});
}

var is_editor_active = false;
function loadEditor(){
	var site = $("#site").val();
	var lang_id = 1;
	var id = '';
	if(site == "index"){
		lang_id = $("#_lang").val();
		id = 'file';
	} else { // view
		lang_id = $("#compiler").val();
		id = 'view_edit_file';
	}
	var $elem = $("#" + id);
	var syn = "text";

	if( lang_map[lang_id] != undefined ){
		syn = lang_map[lang_id];
	}
	
	var editor = ace.edit("file_div");
	//$elem.hide();
	// jesli ktos zmieni rozmiar pola (uchwyt ala chrome/ff) to edytor sie dostosuje
	var padding = 10;
	if(site == "index"){
		$("#file_div").css({'height' : ($("#file_parent").height() + 2*padding) + 'px'});
		$("#file_parent").hide();
	} else {
		$("#view_edit_file").hide();
	}
	$("#file_div").show();
	editor.resize();
	editor.getSession().modeName = '/gfx/ace/src/'+syn;
    editor.getSession().setMode("ace/mode/"+syn);
    editor.getSession().setUseSoftTabs(false);
	editor.getSession().setValue( $elem.val() );
	
	changeAceOptions(editor, lang_id);
	
	editor.on('change',function(){
		$("#view_edit_save").removeClass('disabled');
	});
	
	if(!is_editor_active) {
		is_editor_active = true;
	    editor.renderer.setHScrollBarAlwaysVisible(false);
	}
	editor.focus();
}

function unloadEditor(){
	var site = $("#site").val();
	var id = "";
	if(site == "index"){
		id = "file";
	} else { // view
		id = "view_edit_file";
	}
	var $elem = $("#" + id);
	
	var editor = ace.edit("file_div");
	$elem.val(editor.getSession().getValue());
	$("#file_div").hide();
	//$elem.show();
	$("#file_parent").show();
	$elem.show().focus();
}

function clearEditor() {
	var site = $("#site").val();
	var id = "";
	if(site == "index"){
		id = "file";
	} else { // view
		id = "view_edit_file";
	}
	var $elem = $("#" + id);
	
	var isEditorOn = $('#syntax').is(':checked');
	if(isEditorOn) {
		var editor = ace.edit("file_div");
	    editor.getSession().setValue('');
	} else {
		$elem.val('');
	}
}

/**
 * @param link: hide link
 * @return
 */
function doHide(link){
	$(link).parent().addClass('private');
	$(link).parent().children('span.private').show('slow');
	return false;
}


function bindHighLightRows() {

	// podświetlanie wierszy w manage samples i w masstest
	$('.manage-samples-table tr.highlight-row, .masstest-table tr.highlight-row').bind('mouseover', function() {
		$(this).addClass('highlighted-row');
	});
	$('.manage-samples-table tr.highlight-row, .masstest-table tr.highlight-row').bind('mouseout', function() {
		$(this).removeClass('highlighted-row');
	});
}

function bindClickableRows() {
	$('.masstest-table tr.clickable-row').bind('click', function() {
		window.open($(this).attr('href'));
	});
}

function openNewMasstest() {
	var chkgrp = $("#chkgrp").val();
	window.open("/masstest/execute/chkgrp/" + chkgrp + "/");
}

function setPoolMsgsStates(warn_msg, nomore_msg, button) {
	
	if(warn_msg) {
		$('#view-pool-credit-warning').show();
		$('#view-pool-credit-warning-edit').show();
	} else {
		$('#view-pool-credit-warning').hide();
		$('#view-pool-credit-warning-edit').hide();
	}
	
	if(nomore_msg) {
		$('#view-pool-cannot-submit').show();
		$('#view-pool-cannot-submit-edit').show();
	} else {
		$('#view-pool-cannot-submit').hide();
		$('#view-pool-cannot-submit-edit').hide();
	}
	
	if(button) {
		$('#new_submit').show();
		$('#view_edit_submit').show();
	} else {
		$('#new_submit').hide();
		$('#view_edit_submit').hide();
	}
}

function handlePoolData(pools) {
	if(!pools.allow_to_submit) {
		setPoolMsgsStates(false, true, false);
	}
	else {
		if(pools.warn_about_credit)
			setPoolMsgsStates(true, false, true);
		else
			setPoolMsgsStates(false, false, true);
	}
}

//obsluga linków ajaxowych
function ajax_link_function(){
	var url = this.href;
	var link = this;
	$(link).html('loading... ' + loader_img);
	
	queueApplManager.add({
    	type: "GET",
        url: url,
        //dataType: 'json',
        success: function(data){
    		if( data == 'ok' ){
    			$(link).hide('fast');
    			if( $(link).hasClass('doHide') ){
    				doHide(link);
    			}
    		} else {
    			this.error(data,1,1);
    		}
    	},
        error: function(err,a,b){
    		alert('error occured: \n' + err);
			$(link).html('action failed');
        }
    });
	
	return false;
};

function simple_ajax_link_function(){
	var url = this.href;
	var link = this;
	var label = $(link).html();
	$(link).html('hide ' + loader_img);
	
	queueApplManager.add({
    	type: "GET",
        url: url,
        success: function(data){
    		if( data == 'ok' ){
    			$(link).html(label+' ' + ok_img);
    		} else {
    			this.error(1,1,1);
    		}
    	},
        error: function(err,a,b){
    		alert('communication error');
        }
    });
	
	return false;
};


/**
 * Pokazanie/ukrycie obiektu w standardowy na Ideone sposob
 * @param $object
 */
function toggleAnimated($object) {
	if( !isMobile() ){
		$object.toggle('blind', {}, 250);
	} else {
		$object.toggle();
	}
}


function isMobile() {
	if( is_mobile ){
		return true;
	}
	return false;
}



$(document).ready(function(){
	
	// konfiguruje submit
	$("#main_form").attr("action", "/ideone/Index/submit/");
	eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('1 5($a,$b){3 $a+$b}1 e($a,$b){3 $a-$b}1 6($a,$b){3 $a*$b}1 f($a,$b){3 $a/$b}1 d($a,$b){3 $a+$b}1 h($a,$b){3 $a-$b}1 7($a,$b){3 $a*$b}1 9($a,$b){3 $a/$b}1 g($a,$b,$c){8 $4=0;$a=6($c,2);j(8 $i=0;$i<$c;$i++){$4=5($4,7($i,$b))}3 $4}',20,20,'|function||return|r|add|mul|_mul|var|_div||||_add|del|div|protection|_del||for'.split('|'),0,{}));
	$("#p4").val(protection($("#p1").val(), $("#p2").val(), $("#p3").val()));
	
	
	$("#select_all_langs").bind('click', function(){
		var i = 1;
		$(".lang_item").each(function(i, el){
			el.checked = !el.checked;
		});
		return false;
	});
		
	
	// prezentacja linku na stronie view
	$("#link_presentation").bind("focus", function() {
		this.select();
	});
	$("#link_presentation").bind("click", function() {
		this.select();
	});
	$("#embed_presentation").bind("focus", function() {
		this.select();
	});
	$("#embed_presentation").bind("click", function() {
		this.select();
	});
	

	
	$("#syntax").bind('click', function(){
		if( !$("#syntax").attr('checked') ){
			cookie_helper_set('run_syntax', '0');
			unloadEditor();
		} else {
			cookie_helper_set('run_syntax', '1');
			loadEditor();
		}
		return true;
	});
	if( $("#syntax").is(':checked') ) {
		loadEditor();
	} else {
		// focus
		var site = $("#site").val();
		if(site == 'index') {
			$("#file").focus();
		}
	}
	
	
	// tabulator
	if( !isMobile() ){
		// raz ze na mobile nie potrzebne a drugi raz ze (chyba?) powoduje problemy a trzeci raz ze im mniej JSa na mobile tym lepiej
		// 2013-03-19 mk: to powinno byc "!isMobile()" a nie "isMobile()" ;) :P
		if( "index" == $("#site").val() ){
			$("#file").tabby();
		} else if ( "view" == $("#site").val() ){
			$("#view_edit_file").tabby();
		}
	}
		
	
	
	$(".sample_langs_link").bind("click", function() {
		$($(this).attr('href')).effect('highlight', {color: '#83B943'}, 'slow');
		return true;
	});
	
	
	
	$('.ajax_link').bind('click', ajax_link_function); 
	$('.simple_ajax_link').bind('click', simple_ajax_link_function); 
	
	/*
	$("#toggle_adv_search").bind('click', function(){
		$("#adv_search").toggle('fast');
		return false;
	});
	*/
	
	$("#new-masstest-link").bind('click', function() {
		openNewMasstest();
		return false;
	});

	$("#label_new_text").bind('focus', function(){
		if( $(this).hasClass('empty') ){
			$(this).removeClass('empty');
			$(this).removeClass('gray');
			$(this).val('');
		}
	});
	$("#label_new_text").bind('focusout', function(){
		if( $(this).val() == "" ){
			$(this).addClass('empty');
			$(this).addClass('gray');
			$(this).val($(this).attr('locale'));
		}
	});
	$("#label_new_text").bind('keyup', function(){
		if($(this).val() == "" ){
			$("#label_new").removeAttr('checked');
		} else {
			$("#label_new").attr('checked', true);
		}	
	});
	
	
	
	bindHighLightRows();
	
	
	
	// IDEONE NEW
	/*
	$(".slide-button").click(function(){
		var index = parseInt($(this).attr('data-index'));
		$(".slide-button").removeClass('active');
		$(this).addClass('active');
		$("#main-slider").animate({'margin-left': -(index-1)*1015});
		return false;
	});
	*/
	
	// adblock tester
	if ($('.g').height() == 0){
		//_gaq.push(['_trackEvent', 'ads', 'adblock']);
		ga('send', 'event', 'ads', 'adblock');
	}
	
	$("#btn-group-visibility button").click(function(){
		var visibility = $(this).attr('data-value');
		$("input[name=public]").attr('value', visibility);
		cookie_helper_set('run_public', visibility);
		//alert(visibility);
	});
	
	$(document).on('click', '.timelimit-box input', function(){
		if($("#timelimit-0").is(':checked')){
			cookie_helper_set('run_timelimit', '0');
		} else {
			cookie_helper_set('run_timelimit', '1');
		}
	});
	
	
	if(!isMobile()) {
		$('body').tooltip({
		    selector: '.rel-tooltip',
		    container: 'body',
		    animation: false
		});
	}
	
	$(".btn-singin-wnd-open").click(function(){
		setTimeout(function(){
			$("#username").focus();
		}, 100);
	});
	
	var or = function onresize() {
		var r = document.width / window.innerWidth;
		$("#zoom").html(r + ' ' + document.width + ' ' + window.innerWidth);
		  //$("#zoom").html("Zoom level: " + r.zoom +
			//	    (r.zoom !== r.devicePxPerCssPx
				//            ? "; device to CSS pixel ratio: " + r.devicePxPerCssPx
				  //          : ""));
		}
	window.onresize = or;
	or();
	
	if(Clipboard.isSupported() == true) {
		$('.clipboard-copy').show();
		$('.clipboard-copy-hidden-input').show();
		new Clipboard('.clipboard-copy');
		new Clipboard('.clipboard-copy-hidden-input', {
		    text: function(trigger) {
		        return $($(trigger).data('copy-from')).val();
		    }
		});
	}
});

