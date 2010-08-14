var Edit = {
  config: {
    dialogId: 'dialog',
    editModeClass: 'editmode'
  },
  
  
  init: function() {
    // This requires the movies.js file to be loaded.
    if (!Movies || !Movies.trElms) return;
    
    Edit.createHtml();
  },
  
  
  createHtml: function() {
    var aElm = document.createElement('a');
      aElm.href = 'javascript:Edit.editMode()';
      aElm.appendChild(document.createTextNode('Edit'));
      Movies.actionsBoxElm.appendChild(aElm);
  },
  
  
  editMode: function() {
    Edit.editMode = true;
    
    if (Edit.initiated)
      return;
    
    Edit.pElm = document.createElement('p');
      Edit.pElm.appendChild(document.createTextNode('Click on a table row to edit the movie. '));
      addClass(Edit.pElm, 'message');
      
      var closeLinkElm = document.createElement('a');
        closeLinkElm.appendChild(document.createTextNode('Exit edit mode…'));
        closeLinkElm.href = '#';
        addEvent(closeLinkElm, 'click', Edit.exitEditMode);
        Edit.pElm.appendChild(closeLinkElm);
      
    var tableElm = document.getElementsByTagName('table')[0];
    document.body.insertBefore(Edit.pElm, tableElm);
    
    tbodyElm = tableElm.getElementsByTagName('tbody')[0];
    
    addEvent(tbodyElm, 'click', Edit.clickRow);
    
    Edit.dialogElm = document.createElement('div');
      Edit.dialogElm.id = Edit.config.dialogId;
      addClass(Edit.dialogElm, 'hide');
      
    Edit.h2Elm = document.createElement('h2');
      Edit.dialogElm.appendChild(Edit.h2Elm);
      
    var formElm = document.createElement('form');
      formElm.action = 'edit.php';
      formElm.method = 'post';
      Edit.dialogElm.appendChild(formElm);
      
      var p1Elm = document.createElement('p');
        formElm.appendChild(p1Elm);
      
        var labelElm = document.createElement('label');
          labelElm.appendChild(document.createTextNode('New rating: '));
          labelElm.htmlFor = 'rating';
          p1Elm.appendChild(labelElm);
      
        Edit.selectElm = document.createElement('select');
          Edit.selectElm.id = 'rating';
          Edit.selectElm.name = 'rating';
    
          for (var i = 1; i < 11; ++i) {
            var optionElm = document.createElement('option');
            optionElm.innerHTML = i;
            optionElm.value = i;
            Edit.selectElm.appendChild(optionElm);
          }
    
          p1Elm.appendChild(Edit.selectElm);
    
        var submitButtonElm = document.createElement('input');
          submitButtonElm.type = 'submit';
          submitButtonElm.value = 'Submit…';
          addClass(submitButtonElm, 'submit');
          p1Elm.appendChild(submitButtonElm);
    
        var hiddenTaskElm = document.createElement('input');
          hiddenTaskElm.type = 'hidden';
          hiddenTaskElm.name = 'task';
          hiddenTaskElm.value = 'edit';
          p1Elm.appendChild(hiddenTaskElm);
    
        Edit.hiddenIdElm = document.createElement('input');
          Edit.hiddenIdElm.type = 'hidden';
          Edit.hiddenIdElm.name = 'id';
          p1Elm.appendChild(Edit.hiddenIdElm);
      
      var p2Elm = document.createElement('p');
        formElm.appendChild(p2Elm);
        
        Edit.deleteLink = document.createElement('a');
          addClass(Edit.deleteLink, 'delete');
          Edit.deleteLink.appendChild(document.createTextNode('Delete'));
          addEvent(Edit.deleteLink, 'click', Edit.deleteSure);
          p2Elm.appendChild(Edit.deleteLink);
      
      var p3Elm = document.createElement('p');
        formElm.appendChild(p3Elm);
        
        Edit.editTitlesLink = document.createElement('a');
          Edit.editTitlesLink.appendChild(document.createTextNode('Edit titles…'));
          Edit.editTitlesLink.href = '#';
          p3Elm.appendChild(Edit.editTitlesLink);
      
    document.body.insertBefore(Edit.dialogElm, tableElm);
    addClass(document.body, Edit.config.editModeClass);
    
    if (Compare && Compare.jsFileLoaded)
      Compare.closeIt();
    
    Edit.initiated = true;
  },
  
  
  clickRow: function(e) {
    if (!Edit.editMode)
      return;
    
    stopDefault(e);
    
    if (!e)
      var e = window.event;
    target = (e.target) ? e.target : e.srcElement;
    
    while (target.nodeName.toLowerCase() != 'tr') {
      target = target.parentNode;
    }
    
    var aElm = target.getElementsByTagName('a')[0];
    var id = aElm.href.substring(28, 35);
    
    Edit.h2Elm.innerHTML = aElm.innerHTML;
    Edit.hiddenIdElm.value = id;
    Edit.deleteLink.href = './edit.php?task=delete&id=' + id;
    Edit.editTitlesLink.href = './edit-titles.php?id=' + id;
    
    removeClass(Edit.dialogElm, 'hide');
  },
  
  
  exitEditMode: function(e) {
    stopDefault(e);
    
    addClass(Edit.dialogElm, 'hide');
    removeClass(document.body, Edit.config.editModeClass);
    
    Edit.editMode = false;
    
    if (Edit.pElm)
      addClass(Edit.pElm, 'hide');
  },
  
  
  deleteSure: function(e) {
    var confirmed = window.confirm('Are you sure you want to delete this movie?');
    
    if (!confirmed)
      stopDefault(e);
  }
};

DOMReady(Edit.init);