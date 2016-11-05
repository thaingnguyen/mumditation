export default class HRVCalculator {
    static getHRV(data) {
        console.log('something');
        // console.log(data);
        if(data) {
            var arr = data['activities-heart-intraday']['dataset'];
            var sum = 0;
            var min = 2000;
            var max = 0;

            console.log(arr.length);
            
            for(var index = 0; index < arr.length; index++) {
                var parsedTime = arr[index].time.split(":");
                var newTime = new Date();
                newTime.setHours(+parsedTime[0]);
                newTime.setMinutes(parsedTime[1]);
                newTime.setSeconds(parsedTime[2]);
                arr[index]['parsed_time'] = newTime;
            }

            var rmssdArr = this.calculatingChunk(arr);
            var time = [];
            var runningRMSSD = [];
            var runningSum = 0;
            for(var index = rmssdArr.length-1; index >= rmssdArr.length - 1 - 120; index--) {
                time.push(rmssdArr[index].time.getHours() + ":" + rmssdArr[index].time.getMinutes());
                runningRMSSD.push(rmssdArr[index].rmssd);
                runningSum += rmssdArr[index].rmssd;
            }
            var timeAndRMSSD = {};
            time.reverse();
            runningRMSSD.reverse();
            timeAndRMSSD['time'] = time;
            timeAndRMSSD['rmssd'] = runningRMSSD;
            var avg = runningSum / rmssdArr.length;
            timeAndRMSSD['avg_rmssd'] = avg.toString().substring(0, 5);
            return timeAndRMSSD;
        }
        else return "nope";
    }

    static getNumSeconds(input) {
        var t = Date.parse(input);
        return t.getSeconds() + (t.getMinutes()*60) + (t.getHours()*60*60);
    }

    static calculatingChunk(arr) {
        var rmssdPerMinute = [];
        var count = 0;
        var runningSum = 0;
        for(var index = 1; index < arr.length; index++) {
            if(arr[index].parsed_time.getHours() == arr[index-1].parsed_time.getHours() && arr[index].parsed_time.getMinutes() == arr[index-1].parsed_time.getMinutes()) {
                runningSum += (arr[index].value - arr[index-1].value)*(arr[index].value - arr[index-1].value);
                count++;
            } else {
                var rmssd = Math.sqrt(runningSum / (count-1));
                var correspondingTime = new Date();
                correspondingTime.setHours(arr[index-1].parsed_time.getHours());
                correspondingTime.setMinutes(arr[index-1].parsed_time.getMinutes());
                rmssdPerMinute.push({time : correspondingTime, rmssd : rmssd});
                runningSum = 0;
                count = 0;
            }
        }
        return rmssdPerMinute;
        
    }
}