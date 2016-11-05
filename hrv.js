export default class HRVCalculator {
    static getHRV(data) {
        console.log('something');
        console.log(data);
        if(data) {
            var arr = data['activities-heart-intraday']['dataset'];
            var sum = 0;
            for(var x = 0; x < arr.length; x++) {
                sum += arr[x].value;
            }
            var mean = sum/arr.length;
            var sumOfDifferences = 0;
            for(var x = 0; x < arr.length; x++) {
                sumOfDifferences += (arr[x].value-mean)*(arr[x].value-mean);
            }
            var HRV = Math.sqrt(sumOfDifferences/(arr.length-1));
            console.log("mean: " + mean + ", HRV: " + HRV);
            return "mean: " + mean + ", HRV: " + HRV;
        }
        else return "nope";
    }

    static getNumSeconds(input) {
        var t = Date.parse(input);
        return t.getSeconds() + (t.getMinutes()*60) + (t.getHours()*60*60);
    }
}