(()=> {
    let config = {
        timeStep: 1/60,
        pxm: 1/20,
        pxmKeys: ['jumpPower', 'strafeSpeed', 'airStrafeSpeed', 'width', 
        'height', 'gravity', 'startPos', 'platforms'],//put key values for properties that need to be mulitplied by pixel to meter conversion
        jumpPower: 150,
        strafeSpeed: 200,
        airStrafeSpeed: 100,
        width: 640,
        height: 320,
        startPos: [
            [50, 200],
            [250, 200]
        ],
        gravity: [0,-40],
        platforms: [
            [225,0,50,50]
        ]
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