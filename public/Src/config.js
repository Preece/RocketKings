(()=> {
    let config = {
        timeStep: 1/60,
        pxm: 1/20,
        pxmKeys: ['jumpPower', 'runSpeed', 'width', 'height'],//put key values for properties that need to be mulitplied by pixel to meter conversion
        jumpPower: 200,
        runSpeed: 200,
        width: 640,
        height: 320,
        startPos: [[50, 200], [200,200]],
    }; 


    if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = config;
    }
    exports.config = config;
  } else {
    window.config = config;
  }


})();