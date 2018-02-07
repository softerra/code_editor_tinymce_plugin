var script_languages = [
	{value: 'powershell', display: 'PowerShell'}
];

var ScriptCodeDialog = {
	CLASS_NAME: 'codePluginHolder',

	language: 'powershell',
	editMode: false,

	// jQuery objects references
	$code: null,
	$preview: null,
	$codepreview: null,
	$lang: null,

	$flag_scroll: true,
	
	tpl_cache: {}, // templates cache

	init: function () {
		var self = this;

		// Save elements references for further use
		this.$code = $('#text');
		this.$codepreview = $('#codePreview').find('pre');
		this.$preview = $('#codePreview').find('code');
		this.$lang = $('#language');

		// Event handlers
		this.$code.bind('keyup mouseup', function () {
			self.reHighlight();
		});
		this.$lang.on('change', function () {
			self.updateLanguage();
		});
		$('#insert').on('click', function () {
			self.insertAndClose();
			$ = editor.getWin().parent.jQuery;
			$('#result code.powershell').each(function(i, block) {
				if (Element.prototype.addEventListener) {
					hljs.highlightBlock(block);
				}
			});
		});
		$('#cancel').on('click', function () {
			parent.tinymce.activeEditor.windowManager.close();
		});

		var editor = parent.tinyMCE.activeEditor;
		this.selection = editor.selection;

		var $node = $(editor.selection.getNode());
		if (!$node.hasClass(this.CLASS_NAME)) {// Try to find our node
			var $parent = $node.closest(this.CLASS_NAME);
			if ($parent.length > 0) {
				$node = $parent;
			}
		}
		if ($node && $node.hasClass(this.CLASS_NAME)) { // Re-check, if really found
			this.editMode = true;
			this.$code.val($node.find('.codeHolder code').text());
		} else {
			this.editMode = false;
		}

		this.updatePreview();

/*		$('#text').on('scroll', function (e) {
        		        var percentage = this.scrollTop / (this.scrollHeight - this.offsetHeight);
	        	        $('#codePreview').find("pre").each(function (i, other) {
	                	    other.scrollTop = percentage * (other.scrollHeight - other.offsetHeight);
	        	        });
	        });

		this.$codepreview.on('scroll', function (e) {
				self.$flag_scroll = false;
				t = document.getElementById('text');
        		        var percentage = this.scrollTop / (this.scrollHeight - this.offsetHeight);
	        	        t.scrollTop = percentage * (t.scrollHeight - t.offsetHeight);
	        }); */

		var $divs = $('#text, #codePreviewPre');
		var sync = function(e){
		    var $other = $divs.not(this).off('scroll'), other = $other.get(0);
		    var percentage = this.scrollTop / (this.scrollHeight - this.offsetHeight);
		    other.scrollTop = percentage * (other.scrollHeight - other.offsetHeight);

		    /* Firefox workaround. Rebinding without delay isn't enough. */
		    //setTimeout( function(){ $other.on('scroll', sync ); },10);
		}
		$divs.on('scroll',sync);

	},

	insertAndClose: function () {
		var editor = parent.tinyMCE.activeEditor;

		// Fixes crash in Safari
		if (parent.tinyMCE.isWebKit)
			editor.getWin().focus();

		var code = editor.dom.encode(this.$code.val());
//		var code = this.$code.val();
		var title = this.getLanguageDisplay(this.language);

		var codeBlock = this.tpl('code_tpl', {language: this.language, code: code});
		var content = this.tpl('plugin_tpl', {title: title, code_blocks: codeBlock});

		if (editor.selection) {
			var node = editor.selection.getNode();
			if (!editor.dom.hasClass(node, this.CLASS_NAME)) {
				node = editor.dom.getParent(node, this.CLASS_NAME);
			}
			// Final check and deletion
			if (node && editor.dom.hasClass(node, this.CLASS_NAME)) {
//				editor.dom.remove(node, false);
			}
		}
		editor.execCommand('mceInsertRawHTML', false, content);
		parent.tinymce.activeEditor.windowManager.close();
	},

	updatePreview: function () {
		this.toggleButtons();
		this.reHighlight();
	},

	updateScroll: function () {
//              this.$codepreview.scrollTop = percentage * (this.$codepreview.scrollHeight - this.$codepreview.offsetHeight);
	},

	reHighlight: function () {
		var hl = hljs.highlight(this.language, this.$code.val(), true);
		this.$preview.html(hl.value);
	},

	updateLanguage: function () {
		var lang = this.$lang.val();
		if (lang != this.language) {
			this.language = lang;
			this.$preview.removeClass().addClass(this.language);
			this.reHighlight();
		}
	},

	toggleButtons: function () {
		var code = this.$code.val();
		// TODO: language constants for label
		$('#insert').prop('disabled', code.length == 0).val(this.editMode? 'Update' : 'Insert');
	},

	getLanguageDisplay: function (lang) {
		var found = $.grep(script_languages, function (language) {
			return language.value == lang;
		});

		return (found.length > 0) ? found[0].display : '';
	},

	// Simple JavaScript Templating
	// John Resig - http://ejohn.org/ - MIT Licensed
	tpl: function (str, data) {
		var fn = !/\W/.test(str) ?
			this.tpl_cache[str] = this.tpl_cache[str] ||
			this.tpl(document.getElementById(str).innerHTML) :
			new Function("obj",
				"var p=[],print=function(){p.push.apply(p,arguments);};" +
				"with(obj){p.push('" +
				str
					.replace(/[\r\t\n]/g, " ")
					.split("<%").join("\t")
					.replace(/((^|%>)[^\t]*)'/g, "$1\r")
					.replace(/\t=(.*?)%>/g, "',$1,'")
					.split("\t").join("');")
					.split("%>").join("p.push('")
					.split("\r").join("\\'")
				+ "');}return p.join('');");
		return data ? fn(data) : fn;
	}

};

$(function () {
	ScriptCodeDialog.init();
});
