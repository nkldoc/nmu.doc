/*
author: Bojan Mihelac <bojan@mihelac.org>
http://source.mihelac.org
*/

var treetable_rowstate = new Array();
var treetable_callbacks = new Array();

function treetable_hideRow(rowId) {
  el = document.getElementById(rowId);
  el.style.display = "none";
}

function treetable_showRow(rowId) {
  el = document.getElementById(rowId);
  el.style.display = "";
}

function treetable_hasChildren(rowId) {
  res = document.getElementById(rowId + '_0');
  return (res != null);
}

function treetable_getRowChildren(rowId) {
  el = document.getElementById(rowId);
  var arr = new Array();
  i = 0;
  while (true) {
    childRowId = rowId + '_' + (i+1);
    childEl = document.getElementById(childRowId);
    if (childEl) {
      arr[i] = childRowId;
    } else {
      break;
    }
    i++;
  }
  return (arr);
}

function treetable_toggleRow(forceId, rowId, state, force) {	
  var rowChildren;
  var i;  if(rowId == null) { rowId	= forceId; }
  // open or close all children rows depend on current state
  force = (force == null) ? 1 : force;   
  if (state == null) {	  row_state = ((treetable_rowstate[rowId]) ? (treetable_rowstate[rowId]) : 1) * -1;
  } else {	  row_state = state;
  }
  rowChildren = treetable_getRowChildren(rowId);    treetable_removeClass(forceId, rowChildren, state);
  if (rowChildren.length == 0) return (false);
  for (i = 0; i < rowChildren.length; i++) {
    if (row_state == -1) {
      treetable_hideRow(rowChildren[i]);
      treetable_toggleRow(forceId,rowChildren[i], row_state, -1);
    } else {
      if (force == 1 || treetable_rowstate[rowId] != -1) {
        treetable_showRow(rowChildren[i]);
        treetable_toggleRow(forceId,rowChildren[i], row_state, -1);
      }
    }
  }
  if (force == 1) {
    treetable_rowstate[rowId] = row_state;
    treetable_fireEventRowStateChanged(rowId, row_state);
  }  
  return (true);
}

function treetable_fireEventRowStateChanged(rowId, state) {
  if (treetable_callbacks['eventRowStateChanged']) {
    callback = treetable_callbacks['eventRowStateChanged'] + "('" + rowId + "', " + state + ");";
    eval(callback);
  }
}function treetable_removeClass(forceId, rowChildren, state) {	var children_d	= $("#"+forceId).children().children().children();	if(children_d[0].className == "ux-maximgb-tg-elbow-minus" || children_d[0].className == "ux-maximgb-tg-elbow-plus") {		children_d.removeClass("ux-maximgb-tg-elbow-minus ux-maximgb-tg-elbow-plus");		if(state == -1)			children_d.addClass("ux-maximgb-tg-elbow-plus");		else			children_d.addClass("ux-maximgb-tg-elbow-minus");	} else if(children_d[0].className == "ux-maximgb-tg-elbow-end-minus" || children_d[0].className == "ux-maximgb-tg-elbow-end-plus") {		children_d.removeClass("ux-maximgb-tg-elbow-end-minus ux-maximgb-tg-elbow-end-plus");		if(state == -1)			children_d.addClass("ux-maximgb-tg-elbow-end-plus");		else			children_d.addClass("ux-maximgb-tg-elbow-end-minus");	} else if(children_d[0].className == "ux-maximgb-tg-elbow-end-minus-nl" || children_d[0].className == "ux-maximgb-tg-elbow-end-plus-nl") {		children_d.removeClass("ux-maximgb-tg-elbow-end-minus-nl ux-maximgb-tg-elbow-end-plus-nl");		if(state == -1)			children_d.addClass("ux-maximgb-tg-elbow-end-plus-nl");		else			children_d.addClass("ux-maximgb-tg-elbow-end-minus-nl");	}//  console.log(forceId, rowId, state, force);//  console.log(children_d);//  console.log(children_to);  //  if(children_d[0].className == "ux-maximgb-tg-elbow-end-minus") {//  	//		  children_d.removeClass("ux-maximgb-tg-elbow-end-minus");//  	//		  children_d.addClass("ux-maximgb-tg-elbow-end-plus");//  		  } else if(children_d[0].className == "ux-maximgb-tg-elbow-end-plus") {//  	//		  children_d.removeClass("ux-maximgb-tg-elbow-end-plus");//  	//		  children_d.addClass("ux-maximgb-tg-elbow-end-minus");//  		  }}

function treetable_collapseAll(tableId) {
  table = document.getElementById(tableId);
  rowChildren = table.getElementsByTagName('tr');
  for (i = 0; i < rowChildren.length; i++) {
    if (index = rowChildren[i].id.indexOf('_')) {
      // do not hide root elements
      if(index != rowChildren[i].id.lastIndexOf('_')) {
        rowChildren[i].style.display = 'none';
      }
      if (treetable_hasChildren(rowChildren[i].id)) {
        treetable_rowstate[rowChildren[i].id] = -1;
        treetable_fireEventRowStateChanged(rowChildren[i].id, -1);
      }
    }
  }
  return (true);
}    

function treetable_expandAll(tableId) {
  table = document.getElementById(tableId);
  rowChildren = table.getElementsByTagName('tr');
  for (i = 0; i < rowChildren.length; i++) {
    if (index = rowChildren[i].id.indexOf('_')) {
      rowChildren[i].style.display = '';
      if (treetable_hasChildren(rowChildren[i].id)) {
        treetable_rowstate[rowChildren[i].id] = 1;
        treetable_fireEventRowStateChanged(rowChildren[i].id, 1);
      }
    }
  }
  return (true);
}

