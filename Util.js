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
module.exports = {
    Queue,
    sum
};
