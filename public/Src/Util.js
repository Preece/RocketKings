(()=> {
    const Queue = function(){
        this.head = undefined;
        this.tail = undefined; 
    };

    Queue.prototype.add = function(value){
        let node = new QNode(value); 
        if(!this.head){
            this.head = node; 
            this.tail = node; 
        }else{
            this.tail.next = node; 
            this.tail = node; 
        }
    };

    Queue.prototype.remove = function(){
        if(this.head){
            let node = this.head; 
            this.head = this.head.next; 
        }
    };
    Queue.prototype.peek = function(){
        return this.head; 
    };

    const QNode = (value)=>{
        this.value = value; 
    };


    const sum = (arr1, arr2, cb)=>{
        if(arr2 === undefined){
            return arr1; 
        }
        if(arr1 === undefined){
            return arr2; 
        }
        let result = new Array(arr1.length); 
        for(let i = 0; i < arr1.length; i++){
            result[i] = cb(arr1[i], arr2[i]); 
        }
        return result; 
    };


    const normalize = (vec)=>{
        const magSqr = vec.reduce((total, next)=> next * next + total, 0); 
        const mag = Math.sqrt(mag); 
        return vec.map((val)=> val / mag); 
    };
    const magSqr = (vec)=>{
        return vec.reduce((total, next)=> next * next + total, 0); 
    };


    let returns = {
        Queue,
        sum,
        normalize
    };

    if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = returns;
    }
    exports.config = returns;
  } else {
    window.physics = returns;
  }


})();