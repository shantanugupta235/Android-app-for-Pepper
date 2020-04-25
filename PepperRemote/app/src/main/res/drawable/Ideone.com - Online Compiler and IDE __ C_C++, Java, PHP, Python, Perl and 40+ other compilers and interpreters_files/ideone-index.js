var editorCleanValue; // wartość, która była jako "czysta" - czyli użytkownik nie edytował

/**
 * Ladujemy template jesli edytor jest pusty lub jesli "twki" w nim niezmieniony przyklad poprzedniego jezyka.
 * @param $current_source obecny source
 */
function maybeInsertTemplate(current_source) {
	if(!current_source) {
		insertTemplateOrSample('template');
	}
	if(current_source == $("#file_template").val()) {
		insertTemplateOrSample('template');
	}
}


function insertTemplateOrSample(what) {
	
	var langId = $('#_lang').val();
	var solId = 0;
	
	if(what == 'template') {
		solId = langs_properties[langId]['template_sol_id'];
	}
	else if(what == 'sample') {
		solId = langs_properties[langId]['sample_sol_id'];
	}
	else if(what == 'userstemplate') {
		solId = langs_properties[langId]['users_template_sol_id'];
	}
	
	if(solId == 0) {
		return;
	}
	
	$('#insert-loader').show();
	queueApplManager.add({
            type: 'POST',
            url: '/insert/' + what + '/' + solId + '/',
            dataType: 'json',
            success: function(data){;
					var isEditorOn = $('#syntax').attr('checked');

					if(isEditorOn) {
						var editor = ace.edit("file_div");
						editorCleanValue = data.source;
					    editor.getSession().setValue(data.source);
					} else {
						$('#file').val(data.source);
					}
					$('#file_template').val(data.source);
					
					if(what == 'sample' || what == 'userstemplate') {
						var isInputVisible = $('#ex-input').is(':visible');
						if(!isInputVisible) {
							$('#button-input').click();
						}
						$('#input').val(data.input);
					} else {
						$('#input').val(''); 
					}
					$('#insert-loader').hide();
            },
            error: function(err,a,b){
            		alert("Error occured");
            }
    });
}

/**
 * Przeskakuje do edytora :)
 */
function focusEditor(){
	if($("#syntax").is(':checked')){
		var editor = ace.edit("file_div");
		editor.focus();
	} else {
		$("#file").focus();
	}
}

function languageChanged($this) {
	var lang_id = 0;
	var $lang_select = $("#lang_select");
	if($lang_select.is(':visible')) {
		lang_id = $lang_select.val();
		$menu_lang = $("#menu-lang-" + lang_id);
	} else {
		$menu_lang = $this;
		lang_id = $this.attr('data-id');
	}
	$("a.lang").parent().removeClass('active');
	$menu_lang.parent().addClass('active');
	$("#_lang").val(lang_id);
	$("#lang_advselect>a>span").html($menu_lang.html());
	$lang_select.val(lang_id);
	
	// do ciacha
	cookie_helper_set('run_lang', lang_id);
	
	// do analyticsa
	//_gaq.push(['_trackEvent', 'language', 'change']);
	ga('send', 'event', 'language', 'change');
	
	// edytor
	if($("#syntax").is(':checked')){
		// obsługa edytora
		var syn = 'text';
		if (typeof lang_map[lang_id] != "undefined") {
			syn = lang_map[lang_id]
		}
		
		var editor = ace.edit("file_div");
	    editor.getSession().modeName = '/gfx/ace/src/'+syn;
	    editor.getSession().setMode("ace/mode/"+syn);
	    
	    changeAceOptions(editor, lang_id);
	    
	    // moze ladujemy szablon domyslny
	    maybeInsertTemplate(editor.getValue());
	} else {
		
		// moze ladujemy szablon domyslny
		maybeInsertTemplate($("#file").val());
	}
	
	focusEditor();
	
	// 2013-02-11 by wiele: to juz chyba nie potrzebne?
	// włączanie / wyłączanie przycisku	"run code"
	// if(langs_properties[lang_id]["runnable"] == 1) {
	// 	$("#run_div").show();
	// }
	// else {
	// 	$("#run_div").hide();
	// }
	
	// włączanie / wyłączanie wstawiania przykładów / wzorców
	var template_sol_id = langs_properties[lang_id]["template_sol_id"];
	var sample_sol_id = langs_properties[lang_id]["sample_sol_id"];
	var users_template_sol_id = langs_properties[lang_id]["users_template_sol_id"];
	
	if(template_sol_id > 0 || sample_sol_id > 0 || users_template_sol_id > 0) {
		$("#insert-part-or").css('display', 'inline');
		$("#insert-part-insert").css('display', 'inline');
		if(template_sol_id > 0)
			$("#insert-part-template").css('display', 'inline');
		else
			$("#insert-part-template").css('display', 'none');
		
		if(template_sol_id > 0 && sample_sol_id > 0)
			$("#insert-part-or2").css('display', 'inline');
		else
			$("#insert-part-or2").css('display', 'none');
		
		if(sample_sol_id > 0)
			$("#insert-part-sample").css('display', 'inline');
		else
			$("#insert-part-sample").css('display', 'none');
		
		if(users_template_sol_id > 0) {
			if(template_sol_id > 0 || sample_sol_id > 0)
				$("#insert-part-or3").css('display', 'inline');
			else
				$("#insert-part-or3").css('display', 'none');
			
			$("#insert-part-users-template").css('display', 'inline');
		}
		else {
			$("#insert-part-or3").css('display', 'none');
			$("#insert-part-users-template").css('display', 'none');
		}
	}
	else {
		$("#insert-part-or").css('display', 'none');
		$("#insert-part-insert").css('display', 'none');
		$("#insert-part-template").css('display', 'none');
		$("#insert-part-or2").css('display', 'none');
		$("#insert-part-sample").css('display', 'none');
		$("#insert-part-or3").css('display', 'none');
		$("#insert-part-users-template").css('display', 'none');
	}
	
	return false;
}


$(document).ready(function() {
    
	$("#Submit").click(function(){
		if($('#syntax').attr('checked')){
			var editor = ace.edit("file_div");
			$("#file").val(editor.getSession().getValue());
		}
	});
	
	$("#Run").bind('click', function(){
		$("#main_form").attr("action", "/ideone/Interactive/submit/");
		return true;
	});
	
	$("a.lang").click(function() {
		languageChanged($(this));
		$("#lang_advselect").removeClass('open');
		return false;
	});
	$("a.lang").hover(function() {
		$("#language-details").text( $(this).attr('title') );
	});
	$("#lang_select").change(function() {
		languageChanged($(this));
		return false;
	});
	$("#lang-dropdown-menu-button").click(function () {
		if(!$("#lang-dropdown-menu").is(':visible')) {
			$("#language-details").text('');
		}
	});
	
	// pierwsze automatyczne ladowanie template'a
	// powyzsze robione jest teraz po stronie serwera, bo ponizsze rozwiazanie powodowalo nastepujacy blad:
	// 		[fw] gdy sie wchodzi na strone glowna i laduje sie template (asynchroniczny request do serwera)
	//		to bywa czasem ze request dlugo trwa (wiecej niz sekunde), zaczynam cos pisac w polu na kod albo cos wkleje,
	//		i dopiero w tym momencie laduje sie template nadpisujac to co ja na napisalem. Trzeba wiec zrobic zeby pierwszy
	//		template byl ladowany po stronie serwera
	/*if($("#syntax").is(':checked')){
		var editor = ace.edit("file_div");
	    // moze ladujemy szablon domyslny
	    maybeInsertTemplate(editor.getValue());
	} else {
		// moze ladujemy szablon domyslny
		maybeInsertTemplate($("#file").val());
	}*/
	

	// proba zrobienia zeby TAB dzialal dobrze, ale dziala srednio :P
	// EDIT: zeby sortowac jezyki po kolumnach trzeba bylo napisac odpowiednie sortowanie po stronie serwera wiec
	// 		tam tez "liczone" moze byc tabindex
	/*var popular_cols = 2;
	var popular_length = $("ul.popular > li").length;
	var popular_col_length = Math.ceil(popular_length / popular_cols);
	var i = 0;
	var j = 0;
	$("ul.popular > li").each(function() {
		var $a = $(this).find('a');
		$a.attr('tabindex', 10000 + i*popular_col_length + j);
		++i;
		if(i == popular_cols) {
			++j;
			i = 0;
		}
		//$a.html(i + " " + $a.attr('tabindex'));
	});
	
	var rest_cols = 4;
	var rest_length = $("ul.rest > li").length;
	var rest_col_length = Math.ceil(rest_length / rest_cols);
	var i = 0;
	var j = 0;
	$("ul.rest > li").each(function() {
		var $a = $(this).find('a');
		$a.attr('tabindex', 10000 + rest_length + i*rest_col_length + j);
		++i;
		if(i == rest_cols) {
			++j;
			i = 0;
		}
		//$a.html(i + " " + $a.attr('tabindex'));
	});*/
	
	
	/*
	 * 2013-02-11 by wiele: nieudolne proby zrobienia porzadku z TABem... 3h stracone :P
	$("a.lang").focus(function() {
		console.log($(this).attr('tabindex'));
	});
	
	$("#lang-dropdown-menu-button").focusin(function() {
		if( $("#lang-dropdown-menu").is(':visible') ){
			console.log('1!');
		}
		if( $("#lang-dropdown-menu").is(':visible') ){
			//$(this).attr('tabindex', 10000-1);
		}
		$("#menu-lang-" + $("#lang").val()).focus().css({'color': 'red'});
		//
			//$("#lang-dropdown-menu").focus();$("#lang-dropdown-menu").focusin();
			//$("#insert-part-insert").focus();
			
	});
	
	$("#lang-dropdown-menu-button").focus(function() {
		//if( $("#lang-dropdown-menu").is(':visible') ){
			console.log('2!');
			$a = $("#menu-lang-" + $("#lang").val());
			var t = $a.attr('tabindex');
			$a.focus();
			$a.attr('tabindex', -1);
			$a.focus();
			$a.attr('tabindex', t);
			$a.focus();
		//}
	});
	*/
	

	$("#insert-template-link").bind('click', function() {
		insertTemplateOrSample('template');
		return false;
	});
	
	$("#insert-sample-link").bind('click', function() {
		insertTemplateOrSample('sample');
		return false;
	});
	
	$("#insert-users-template-link").bind('click', function() {
		insertTemplateOrSample('userstemplate');
		return false;
	});
	
	$("#button-input").click(function(){
		var $input_panel = $("#ex-input");
		toggleAnimated( $input_panel );
		
		// po kliknieciu focus na input
		// ale nie na mobile, bo mobile ma za maly ekran i gdy sie ustawi focus, to ekran za bardzo "skacze" i user traci orientacje co sie dzieje
		if( ! isMobile() ){
			setTimeout(function(){
				if($input_panel.is(':visible')){
					$input_panel.find('textarea').focus();
					cookie_helper_set('cp_show_input', 1);
				} else {
					focusEditor();
					cookie_helper_set('cp_show_input', 0);
				}
			}, 300);
		}
		
		return false;
	});
	
	$("#button-more-options").click(function(){
		var $more_options_panel = $("#ex-more-options");
		toggleAnimated( $more_options_panel );
		
		// po kliknieciu focus na notatke
		// ale nie na mobile, bo mobile ma za maly ekran i gdy sie ustawi focus, to ekran za bardzo "skacze" i user traci orientacje co sie dzieje 
		if( ! isMobile() ){
			setTimeout(function(){
				if($more_options_panel.is(':visible')){
					$more_options_panel.find('textarea').focus();
					cookie_helper_set('cp_show_options', 1);
					//$("#syntax").focus();
				} else {
					focusEditor();
					cookie_helper_set('cp_show_options', 0);
				}
			}, 300);
		}
		
		if($(this).find('.more-options-less').is(':visible')) {
			$(this).find('.more-options-less').hide();
			$(this).find('.more-options-more').show();
		} else {
			$(this).find('.more-options-more').hide();
			$(this).find('.more-options-less').show();
		}
		
		return false;
	});
	
	/*
	function onIndexWindowResize() {
		var $file = $("#file");
		var $file_div = $("#file_div");
		var $parent = $file.parent();
		var padding = 2;
		// wysokosc przywracamy do pierwotnego stanu
		// EDIT: ale tylko szerokosc, wysokosc niech zostanie taka jaka sobie user ustawil
		$file.css({
			'width': ($parent.width() - 2*padding) + 'px'
			//'height': $parent.height() + 'px'
		});
		$file_div.css({
			'width': $parent.width() + 'px'
			//'height' : $parent.height() + 'px'
		});
		
		var $input = $("#input");
		//$parent = $input.parent();
		//console.log($parent);
		$input.css({
			'width': ($parent.width() - 2*padding) + 'px'
			//'height': $parent.height() + 'px'
		});
		// $("#file").val( $("#file").val() + 'y' );
	}
	// to jest zrobione bo:
	// 1. nie na kazdej przegladarce width:100% dla textarea dziala
	// 2. zeby przy zmianie rozmiaru okna, nawet jesli user manualnie zmieni rozmiar textarea, to zeby rozmiar wrocil do oryginalu (zarowno dla textarea jak i dla edytora)
	var doOnIndexWindowResizeTimeoutHandle = null;
	$(window).resize(function() {
		// jednak wiele to nie pomaga
		// clearTimeout(doOnIndexWindowResizeTimeoutHandle);
		// doOnIndexWindowResizeTimeoutHandle = setTimeout(function(){onIndexWindowResize();}, 100);
		
		// $("#file").val( $("#file").val() + 'x' );
		
		onIndexWindowResize();
	});
	onIndexWindowResize();
	*/
	
	// ctrl+enter (albo cmd+enter na mac os x) = submit
	$(document).keypress(function(event) {
		// 13 or 10
		// http://code.google.com/p/chromium/issues/detail?id=79407
		// http://stackoverflow.com/questions/3532313/jquery-ctrlenter-as-enter-in-text-area
		if( (event.keyCode == 13 || event.keyCode == 10) && (event.ctrlKey || event.metaKey)) {	
			$("#Submit").click();
		}
	});
	
	//////////////////
	// BEGIN OF LABELS
	//////////////////
	
	function isLabelNameValid(name) {
		// valid characters are A-Z, a-z, 0-9 and '_-#!@()[]/+'; hmm oraz spacja ;)
		return name.match(/^[ A-Za-z0-9_#!@\(\)\[\]\/\+\-]*$/);
	}
	
	function turnOnLabelError(error_type) {
		$("#new-label-control-group").addClass('error');
		$("#new-label-control-group span.help-inline").hide();
		if(error_type == 'characters') {
			$("#new-label-control-group span.invalid-characters").show();
		} else if(error_type == 'empty') {
			$("#new-label-control-group span.cannot-be-empty").show();
		}
	}
	function turnOffLabelError() {
		$("#new-label-control-group").removeClass('error');
		$("#new-label-control-group span.help-inline").hide();
	}
	
	var new_labels_counter = 0;
	$("#new-label-button").click(function(){
		var $new_label_input = $("#new-label-input");
		var name = $new_label_input.val();
		if(!name) {
			name = '';
		}
		name = name.trim().replace(/\s+/g, ' ');
		if( name != '' && isLabelNameValid(name) ){
			$("#new-label-control-group").removeClass('error');

			var label_exists = false;
			$("li.label-list-label").each(function() {
				if( $(this).find('span.label-name').text() == name ) {
					label_exists = true;
					$(this).find('input[type=checkbox]').prop('checked', true);
					$(this).find('span.label').effect('highlight', {}, 700);
				}
			});
			
			if(!label_exists) {
				var $new = $("#new-label-pattern").clone();
				$new.attr('id', '');
				$new.css('display', 'inline-block');
				$new.find('input[type=checkbox]').attr('name', 'data[labels][new][' + new_labels_counter + '][checked]');
				$new.find('input[type=hidden]').attr('name', 'data[labels][new][' + new_labels_counter + '][name]');
				$new.find('input[type=hidden]').val( name );
				$new.find('span.label > span.label-name').text( name );
				$("#new-label-li").before($new);
				$("#new-label-li").before(' ');
				$("#you-have-no-labels").hide();
				++new_labels_counter;
			}
			
			$new_label_input.focus();
		} else {
			if(name == '') {
				turnOnLabelError('empty');
			} else {
				turnOnLabelError('characters');
			}
		}
	});
	
	$("#new-label-input").focus(function() {
		$(this).select();
	});
	
	$("#new-label-input").keypress(function(event) {
		if(event.which == 13) {
			event.preventDefault();
			$("#new-label-button").click();
		}
	});
					
	// hack zeby wykryc kazda zmiane w inpucie (klawiszami, JSem, copy/paste/cut, autouzupelnianiem przegladarki, itp)
	// http://stackoverflow.com/questions/1948332/detect-all-changes-to-a-input-type-text-immediately-using-jquery
	$("#new-label-input").data('oldval', $("#new-label-input").val() );
	$("#new-label-input").bind('propertychange keyup input paste', function(){
		var $this = $(this);
		if($this.val() != $this.data('oldval')) {
			$this.data('oldval', $this.val());
			
			if( isLabelNameValid( $this.val() ) ){
				turnOffLabelError();
			} else {
				turnOnLabelError('characters');
			}
		}
	});
	
	////////////////
	// END OF LABELS
	////////////////
	
	
	// "responsive" fb widget
	$(window).bind("load resize", function(){
      var $container = $('#fb-like-box-root');
	  var container_width = $container.width();
	  var old_width = $container.attr('data-old-width');
	  if(container_width != old_width){
		var data_show_faces = (is_mobile)?"false":"true";
	    $('#fb-like-box-root').html('<div class="fb-like-box" ' + 
	    'data-href="https://www.facebook.com/ideone"' +
	    ' data-width="' + container_width + '" data-height="258" data-show-faces="' + data_show_faces + '" data-show-border="false" ' +
	    'data-stream="false" data-header="false"></div>');
	    FB.XFBML.parse( );
	    $container.attr('data-old-width', container_width);
	  }
	});
	
	
	$('#input').on('input', function(){
		if($(this).val().length > 65535) {
			$('#input-alert-too-long').removeClass('hidden');
		} else {
			$('#input-alert-too-long').addClass('hidden');
		}
	});
	
	$('#file').on('input', function(){
		if($(this).val().length > 65535) {
			$('#source-code-alert-too-long').removeClass('hidden');
			$('#Submit').attr("disabled", true);
		} else {
			$('#source-code-alert-too-long').addClass('hidden');
			$('#Submit').attr("disabled", false);
		}
	});
	
	var editor = ace.edit("file_div");
	editor.getSession().on('change', function(e) {
		if(editor.getValue().length > 65535) {
			$('#source-code-alert-too-long').removeClass('hidden');
			$('#Submit').attr("disabled", true);
		} else {
			$('#source-code-alert-too-long').addClass('hidden');
			$('#Submit').attr("disabled", false);
		}
	});
	

	var isCtrl = false;
	var isShift = false;

	// action on key up
	$(document).keyup(function(e) {
		if(e.which == 17) {
			isCtrl = false;
		}
		if(e.which == 16) {
			isShift = false;
		}
	});
	// action on key down
	$(document).keydown(function(e) {
		if(e.which == 17) {
			isCtrl = true; 
		}
		if(e.which == 16) {
			isShift = true; 
		}
		/*
		if(e.which == 83 && isCtrl) { 
			
			return false;
		}
		*/
	});
	
	// https://github.com/snikch/jquery.dirtyforms
	$('#main_form').dirtyForms();
	
	// przełączanie się pomiędzy edytorem lub czasem wykonywania nie powoduje wyświetlania komunikatu
	$('#syntax, #timelimit-0, #timelimit-1').addClass($.DirtyForms.ignoreClass); 

	// helper dla DirtyForms, sprawdza czy edytor Ace został zmieniany 
	var editor = ace.edit("file_div");
	editorCleanValue = editor.getValue();
	var AceDirty = {
		isDirty : function($node){
			// Perform dirty check on a given node (usually a form element)
			return editor.getValue() != editorCleanValue;
		},
		setClean : function($node){
			// Perform logic to reset the node so the isDirty function will return true
			// the next time it is called for this node.
			editorCleanValue = editor.getValue();
		}

	}
	$.DirtyForms.helpers.push(AceDirty);
	
	// Przy włączaniu edytora musimy przekopiować treść z textarea aby nie pojawiał się komunikat gdy nie było żadnych zmian
	// a jak były jakieś zmiany to pole textarea ma informacje, że użytkownik edytował
	$("#syntax").bind('click', function(){
		if( $("#syntax").attr('checked') ){
			if($('#main_form #file').dirtyForms('isDirty') === true) {
				editorCleanValue = $('#file').val();
			}
		}
		return true;
	});
});
