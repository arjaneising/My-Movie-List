var Slider = {
  sliders: [],
  
  
  // Initiate a slider, set all values to the configured ones.
  create: function(config) {
    var sliderElm = elm(config.sliderId);
    var handle1Elm = elm(config.handle1Id);
    var handle2Elm = elm(config.handle2Id);
    var fillerElm = elm(config.fillerId);
    
    var callback = config.callback ? config.callback : false;
    
    var sliderWidth = sliderElm.offsetWidth;
    
    if (config.borderPlusPadding)
      sliderWidth -= config.borderPlusPadding;
    
    var handle1Width= handle1Elm.offsetWidth;
    var handle2Width= handle2Elm.offsetWidth;
    var workingArea = sliderWidth - handle1Width - handle2Width;
    
    Slider.sliders[config.sliderId] = [
      handle1Elm, //0
      handle2Elm, //1
      fillerElm, //2
      sliderWidth, //3
      handle1Width, //4
      handle2Width, //5
      workingArea, //6
      config.minValue, //7
      config.maxValue, //8
      config.handle1Value, //9
      config.handle2Value, //10
      callback //11
    ];
    
    Slider.updateUI(config.sliderId);
    
    addEvent(handle1Elm, 'mousedown', Slider.slideStart);
    addEvent(handle2Elm, 'mousedown', Slider.slideStart);
    addEvent(document.body, 'mouseup', Slider.slideEnd);
    
    Slider.registerMoving = false;
    
    if (!Slider.initiatedBefore) {
      addEvent(document.body, 'mousemove', Slider.registerMove);
    }
    
    Slider.initiatedBefore = true;
  },
  
  
  // set the slider to a specified value
  setValues: function(id, handle1Value, handle2Value) {
    if (Slider.sliders[id][7] > handle1Value)
      handle1Value = Slider.sliders[id][7];
    
    if (Slider.sliders[id][8] < handle2Value)
      handle2Value = Slider.sliders[id][8];
    
    if (handle1Value > handle2Value)
      handle1Value = handle2Value;
    
    Slider.sliders[id][9] = handle1Value;
    Slider.sliders[id][10] = handle2Value;
    
    Slider.updateUI(id);
  },
  
  
  // To set the slider offstes and the filler width
  updateUI: function(id) {
    var handle1Offset = Math.round(((Slider.sliders[id][9] - Slider.sliders[id][7]) * Slider.sliders[id][6]) / (Slider.sliders[id][8] - Slider.sliders[id][7]));
    var handle2Offset = Math.round(((Slider.sliders[id][10] - Slider.sliders[id][7]) * Slider.sliders[id][6]) / (Slider.sliders[id][8] - Slider.sliders[id][7])) + Slider.sliders[id][5];
    Slider.sliders[id][0].style.left = handle1Offset + 'px';
    Slider.sliders[id][1].style.left = handle2Offset + 'px';
    Slider.sliders[id][2].style.left = (handle1Offset + Slider.sliders[id][4]) + 'px';
    Slider.sliders[id][2].style.width = (handle2Offset - handle1Offset - Slider.sliders[id][4]) + 'px';
  },
  
  
  // When the user clicks on a slider handle
  slideStart: function(e) {
    stopDefault(e);
    
    Slider.registerMoving = true;
    
    if (!e) var e = window.event;
    target = (e.target) ? e.target : e.srcElement;
    
    Slider.currentHandleElm = target;
    Slider.currentSliderElm = target.parentNode;
    Slider.currentSlider = Slider.sliders[Slider.currentSliderElm.id];
    
    Slider.findSliderOffset(Slider.currentSliderElm);
  },
  
  
  // When the user mouse-ups the mousebutton.
  slideEnd: function(e) {
    stopDefault(e);
    
    if (!Slider.currentSliderElm)
      return;
    
    Slider.registerMoving = false;
    
    Slider.sliders[Slider.currentSliderElm.id][9] = Math.round(Slider.sliders[Slider.currentSliderElm.id][9]);
    Slider.sliders[Slider.currentSliderElm.id][10] = Math.round(Slider.sliders[Slider.currentSliderElm.id][10]);
    Slider.updateUI(Slider.currentSliderElm.id);
  },
  
  
  // When the user moves his mouse
  registerMove: function(e) {
    if (!Slider.registerMoving)
      return;
    
    var posx = 0;
    if (!e) e = window.event;

    if (e.pageX || e.pageY)
      posx = e.pageX;
    else if (e.clientX || e.clientY)
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    
    var difference = posx - Slider.sliderOffsetLeft;
    
    // If it's the first handle
    if (Slider.currentSlider[0] == Slider.currentHandleElm) {
      difference -= (Slider.currentSlider[4] / 2);
      Slider.sliders[Slider.currentSliderElm.id][9] = (((Slider.currentSlider[8] - Slider.currentSlider[7]) * difference) / Slider.currentSlider[6]) + Slider.currentSlider[7];
      
      // If we go beyond handle 2
      if (Slider.sliders[Slider.currentSliderElm.id][9] > Slider.sliders[Slider.currentSliderElm.id][10])
        Slider.sliders[Slider.currentSliderElm.id][9] = Slider.sliders[Slider.currentSliderElm.id][10];
      
      // If we are blow the minimum value
      if (Slider.sliders[Slider.currentSliderElm.id][9] < Slider.sliders[Slider.currentSliderElm.id][7])
        Slider.sliders[Slider.currentSliderElm.id][9] =  Slider.sliders[Slider.currentSliderElm.id][7];
    }
    else {
      difference -= (Slider.currentSlider[5] / 2);
      difference -= Slider.currentSlider[4];
      Slider.sliders[Slider.currentSliderElm.id][10] = (((Slider.currentSlider[8] - Slider.currentSlider[7]) * difference) / Slider.currentSlider[6]) + Slider.currentSlider[7];
      
      // If we are beyond handle 1
      if (Slider.sliders[Slider.currentSliderElm.id][9] > Slider.sliders[Slider.currentSliderElm.id][10])
        Slider.sliders[Slider.currentSliderElm.id][10] = Slider.sliders[Slider.currentSliderElm.id][9];
      
      // If we are over the maximum value
      if (Slider.sliders[Slider.currentSliderElm.id][10] > Slider.sliders[Slider.currentSliderElm.id][8])
        Slider.sliders[Slider.currentSliderElm.id][10] =  Slider.sliders[Slider.currentSliderElm.id][8];
    }
    
    Slider.updateUI(Slider.currentSliderElm.id);
    
    if (Slider.sliders[Slider.currentSliderElm.id][11])
      Slider.sliders[Slider.currentSliderElm.id][11]({'sliderId':Slider.currentSliderElm.id,'handle1Value':Math.round(Slider.sliders[Slider.currentSliderElm.id][9]),'handle2Value':Math.round(Slider.sliders[Slider.currentSliderElm.id][10])});
  },
  
  
  // Find the X position of the slider elm
  findSliderOffset: function(elm) {
    Slider.sliderOffsetLeft = 0;
  
    if (elm.offsetParent) {
      do {
        Slider.sliderOffsetLeft += elm.offsetLeft;
      } while (elm = elm.offsetParent);
    }
  }
};