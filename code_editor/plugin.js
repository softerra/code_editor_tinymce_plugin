tinymce.PluginManager.add('code_editor', function(editor, url) {

    editor.addCommand("codeEditor", function () {

        editor.windowManager.open({
            title: 'Code Editor',
            file: tinyMCE.baseURL + '/plugins/code_editor/index.html',
            width: 1010,
            height: 600,
            inline: 1,
        });
    }),
        // Add a button that opens a window
    editor.addButton('code_editor', {
        text: 'Code',
        title: 'Code Editor',
        cmd: "codeEditor",
	    stateSelector: 'div[class=codePluginHolder]'
    });

    // Adds a menu item to the tools menu
    editor.addMenuItem('code_editor', {
        text: 'Code Editor',
        icon: 'code',
        context: 'tools',
        cmd: "codeEditor"
    });
});
