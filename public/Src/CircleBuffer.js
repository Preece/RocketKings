()=>{
    const buffer = new Array(100); 
    let tail, head, pointer = 0; 

    const areTheSame = (truth, chunk)=>{
        return Object.getOwnProperties(truth)
                 .every((key)=> truth[key] == chunk[key]);
    };
    
    return {
        saveState: (state)=>{
            buffer[head++] = state; 
            head = (head >= buffer.length) ? 0 : head; 
        },
        truthCheck: (truth, physObjs, physics)=>{
            pointer = tail; 
            do{
                let chunk = buffer[pointer]; 
                if(chunk.time == truth.time){
                    if(areTheSame(truth, chunk)){
                        break; 
                    }else{
                        Object.getOwnProperties(truth)
                          .forEach((key)=> physObjs[key].reset(truth[key]));
                        const physSteps = (head > pointer) ? head - pointer : 100 - pointer + head; 
                        physics.recalculate(physSteps, pointer); 
                    }
                }else{
                    pointer++; 
                    pointer = (pointer >= buffer.length) ? 0 : pointer; 
                }
            }while(pointer != tail);
        }
    };

}();    