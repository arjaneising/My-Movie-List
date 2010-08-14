var Sort = {
  config: {
    sortedClass: 'sorted',
    sortedClassDesc: 'sorted-desc'
  },
  
  
  init: function() {
    // This requires the movies.js file to be loaded.
    if (!Movies || !Movies.trElms) return;
    
    Sort.createHtml(Movies.tableElm, 0);
  },
  
  
  // Create the links
  createHtml: function(tableElm, sortedColumn) {
    // Append sortcolumns
    var thElms = tableElm.getElementsByTagName('thead')[0].getElementsByTagName('th');
    
    for (var i = 0; i < thElms.length; ++i) {
      thElm = thElms[i];
      if (hasClass(thElm, 'sort-alpha') || hasClass(thElm, 'sort-num')) {
        linkElm = document.createElement('a');
        linkElm.href = '#';
        linkElm.appendChild(thElm.childNodes[0]);
        linkElm.setAttribute('sort-column', i);
        linkElm.setAttribute('sort-type', hasClass(thElm, 'sort-alpha') ? 'a' : 'ns');
        addEvent(linkElm, 'click', Sort.sortColumn);
        
        if (i == sortedColumn)
          addClass(linkElm, Sort.config.sortedClass);
        
        thElm.appendChild(linkElm);
      }
    }
  },
  
  
  // When the user clicks one of the links
  sortColumn: function(e) {
    var type, column, target, tableElm;
    
    if (arguments.length === 1) {
      stopDefault(e);
    
      type = this.getAttribute('sort-type') == 'a' ? 'a' : 'n';
      column = parseInt(this.getAttribute('sort-column'), 10);
    
      if (!e) var e = window.event;
      target = (e.target) ? e.target : e.srcElement;

      tableElm = target;
  
      while (tableElm.nodeName.toLowerCase() != 'table') {
        tableElm = tableElm.parentNode;
      }
    }
    else {
      type = arguments[2];
      column = arguments[1];
      tableElm = arguments[0];
      
      target = tableElm.getElementsByTagName('th')[column].getElementsByTagName('a')[0];
    }
    
    var tbodyElm = tableElm.getElementsByTagName('tbody')[0];
    var trElms = tbodyElm.getElementsByTagName('tr');
    
    // If the table is already sorted
    if (hasClass(target, Sort.config.sortedClass)) {
      var trElmsLength = trElms.length;
      
      for (var i = 0; i < trElmsLength; ++i)
        tableElm.getElementsByTagName('tbody')[0].appendChild(trElms[trElmsLength - i - 1]);
      
      if (tableElm == Movies.tableElm)
        Movies.trElms = tableElm.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        
      if (hasClass(target, Sort.config.sortedClassDesc))
        removeClass(target, Sort.config.sortedClassDesc);
      else
        addClass(target, Sort.config.sortedClassDesc);
        
      Movies.applyOddEven(tbodyElm);
    }
    // The table is not yet sorted, sort it.
    else {
      var sortArray = [];
      for (var i = 0; i < trElms.length; ++i) {
        inner = trElms[i].getElementsByTagName('td')[column];
        
        if (inner.getAttribute('title'))
          inner = inner.getAttribute('title');
        else
          inner = (inner.innerText) ? inner.innerText : inner.textContent; 
        
        if (type == 'n')
          sortArray[i] = [parseInt(inner, 10), trElms[i]];
        else
          sortArray[i] = [inner.toLowerCase().replace(/^\s+|\s+$/g, ''), trElms[i]];
      }
      
      sortArray.sort(function(a, b) {
        if (a[0] == b[0]) return 0;
        if (a[0] < b[0]) return -1;
        return 1;
      });
    
      for (var i = 0; i < sortArray.length; ++i) {
        tbodyElm.appendChild(sortArray[i][1]);
      }
    
      if (tableElm == Movies.tableElm)
        Movies.trElms = tableElm.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        
      Movies.applyOddEven(tbodyElm);
      
      var theadElm = target;
      
      while (theadElm.nodeName.toLowerCase() != 'thead') {
        theadElm = theadElm.parentNode;
      }
      
      var sortedLink = elmsByClass(Sort.config.sortedClass, 'a', theadElm)[0];
      
      if (sortedLink) {
        removeClass(sortedLink, Sort.config.sortedClass);
        removeClass(sortedLink, Sort.config.sortedClassDesc);
      }
      
      addClass(target, Sort.config.sortedClass);
    }
  }
};

DOMReady(Sort.init);