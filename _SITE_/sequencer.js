// class Sequencer {
//   sortArray(arr) {
//     let len = arr.length;
//     for (let i = 0; i < len; i++) {
//       for (let j = i + 1; j < len; j++) {
//         if (arr[i].length > arr[j].length) {
//           let temp = arr[i];
//           arr[i] = arr[j];
//           arr[j] = temp;
//         }
//       }
//     }
//     return arr;
//   }
//   constructor(){

//   }
// }

// module.exports = Sequencer
class Sequencer{
    sortArray(array){
        let len = array.length;

        for (let i = 0; i < len; i++){
            for (let j = i + 1; j < len; j++){
                if (array[i].length > array[j].length){
                    let temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
            }
        }
        return array;
    }
}
