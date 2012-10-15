var test = $('div.editor').get(0);
console.log(test);
var editor = ace.edit(test);
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");