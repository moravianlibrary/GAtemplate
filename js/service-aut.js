function submit_form() {
if (( document.f.P1001151__a ) && ( submit_conf_ge() )) {
 document.f.submit();
 }
if (( document.f.P0901155__a ) && ( submit_conf_fd() )) {
 document.f.submit();
 }
}
function reset_form() {
var e = document.f.elements;
for ( var i = 0; i < e.length; i++ )
  if (( e[i].type == "text" ) && ( e[i].name.substring(0,1) == "P" )) e[i].value = "";
}
function get_sid() {
try {
  if ( window.opener.sid ) return window.opener.sid
  }
catch(e) { }
}

function submit_conf_ge() {
var text = "";
var text1 = "";
var r = null;
var f = document.f;
var e = document.f.elements;
for ( var i = 0; i < e.length; i++ ) {
  if ( e[i].name.substring(0,1) == "P" )
    e[i].value = e[i].value.replace(/ *$/,"");
  }
if ( f.P1001151__a.value == "" ) {
  text += "\u2022  CHYBÍ ZÁHLAVÍ - GEOGRAFICKÝ TERMÍN !!!        \n";
  r = f.P1001151__a;
  }
if ( f.P0701043__a.value + f.P0702043__a.value + f.P0703043__a.value == "" ) {
  text += "\u2022  CHYBÍ KÓD GEOGRAFICKÉ OBLASTI !!!        \n";
  if ( r == null ) r = f.P0701043__a;
  }
else {
  if (( f.P0701043__a.value != "" ) && ( f.P0701043__a.value.match(/^[a-z-]{7}$/) == null )) {
    text1 += "\u00a0 \u00a0 \u00a0 \u00a0  - KÓD GEOGRAFICKÉ OBLASTI        \n";
    if ( r == null ) r = f.P0701043__a;
    }
  else if (( f.P0702043__a.value != "" ) && ( f.P0702043__a.value.match(/^[a-z-]{7}$/) == null )) {
    text1 += "\u00a0 \u00a0 \u00a0 \u00a0  - KÓD GEOGRAFICKÉ OBLASTI        \n";
    if ( r == null ) r = f.P0702043__a;
    }
  else if (( f.P0703043__a.value != "" ) && ( f.P0703043__a.value.match(/^[a-z-]{7}$/) == null )) {
    text1 += "\u00a0 \u00a0 \u00a0 \u00a0  - KÓD GEOGRAFICKÉ OBLASTI        \n";
    if ( r == null ) r = f.P0703043__a;
    }
  }
//
// text += "\u2022  NEPLATNÝ KÓD GEOGRAFICKÉ OBLASTI !!!        \n";
//
if (( f.P0801080__a.value != "" ) && ( f.P0801080__a.value.match(/^\([1-9].*\)$/) == null )) {
  text1 += "\u00a0 \u00a0 \u00a0 \u00a0  - MDT        \n";
  if ( r == null ) r = f.P0801080__a;
  }
else if (( f.P0901080__a.value != "" ) && ( f.P0901080__a.value.match(/^\([1-9].*\)$/) == null )) {
  text1 += "\u00a0 \u00a0 \u00a0 \u00a0  - MDT        \n";
  if ( r == null ) r = f.P0901080__a;
  }
if ( text1 != "" )
  text += "\u2022  NEPLATNÉ ÚDAJE        \n" + text1;
if ( f.P1901670__a.value == "" ) {
  text += "\u2022  NENÍ UVEDEN ZDROJ OVĚŘENÍ !!!        \n";
  if ( r == null ) r = f.P1901670__a;
  }
if ( text != "" ) {
  text = "============================        \n" + text + "============================        \n";
  alert(text);
  r.focus();
  return false;
  }
for ( var i = 0; i < e.length; i++ )
  if (( e[i].name.substring(0,1) == "P" ) && ( e[i].value == "" )) e[i].disabled = true;
// f.sid.value = get_sid();
// f.tp.value = "ge";
return true;
}

function submit_conf_fd() {
var text = "";
var r = null;
var f = document.f;
var e = document.f.elements;
for ( var i = 0; i < e.length; i++ ) {
  if ( e[i].name.substring(0,1) == "P" )
    e[i].value = e[i].value.replace(/ *$/,"");
  }
if ( f.P0901155__a.value == "" ) {
  text += "\u2022  CHYBÍ ZÁHLAVÍ - FORMA, ŽÁNR !!!        \n";
  r = f.P0901155__a;
  }
if ( text != "" ) {
  text = "========================        \n" + text + "========================        \n";
  alert(text);
  r.focus();
  return false;
  }
for ( var i = 0; i < e.length; i++ )
  if (( e[i].name.substring(0,1) == "P" ) && ( e[i].value == "" )) e[i].disabled = true;
// f.sid.value = get_sid();
// f.tp.value = "fd";
return true;
}
