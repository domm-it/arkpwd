// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

/*=======================================================
 CARICAMENTO PACCHETTI NODE
=======================================================*/
const remote = require('electron').remote;
const exec = require('child_process').exec;
const fs = require('fs')
const zxcvbn = require('zxcvbn');

/*=======================================================
 CARICAMENTO PAGINA INIZIALE
=======================================================*/
$(function(){
    secure_access();
    if(sec()) page();
});
