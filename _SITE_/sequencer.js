
class Sequencer {
    sortArray(arr) {
        let len = arr.length;
        for(let i = 0; i<len; i++){
            for(let j = i+1; j<len; j++){
                if(arr[i].length > arr[j].length){
                    let temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        return arr;
    } 
    constructor() {

    }
}

