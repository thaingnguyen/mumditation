export default class HRVCalculator {
    static getHRV(data) {
        if (data) {
            var bpms = data['activities-heart-intraday']['dataset'];
            console.log(bpms.length);

            for(var index = 0; index < bpms.length; index++) {
                var parsedTime = bpms[index].time.split(":");
                bpms[index]['parsed_time'] =
                  this.createTime(parsedTime[0], parsedTime[1], parsedTime[2]);
            }

            var rmssdArr = this.calculatingChunk(bpms);
            var time = [];
            var runningRMSSD = [];
            var runningSum = 0;
            for(var index = rmssdArr.length-1; index >= Math.max(0, rmssdArr.length - 1 - 120); index--) {
                time.push(rmssdArr[index].time.getHours() + ":" + rmssdArr[index].time.getMinutes());
                runningRMSSD.push(rmssdArr[index].rmssd);
                runningSum += rmssdArr[index].rmssd;
            }

            time.reverse();
            runningRMSSD.reverse();

            var stats = {};
            stats['stress'] = this.getStressLevel(runningRMSSD, 0.5);
            stats['bpm'] = bpms[bpms.length-1].value;
            stats['time'] = time;
            stats['rmssd'] = runningRMSSD;
            stats['avg_rmssd'] = Number((runningSum / rmssdArr.length).toFixed(3));
            return stats;
        }
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
                var correspondingTime = this.createTime(
                    arr[index-1].parsed_time.getHours(),
                    arr[index-1].parsed_time.getMinutes(),
                    arr[index-1].parsed_time.getSeconds());
                rmssdPerMinute.push({time : correspondingTime, rmssd : rmssd});
                runningSum = 0;
                count = 0;
            }
        }
        return rmssdPerMinute;
    }

    static createTime(hour, minute, second) {
      var time = new Date();
      time.setHours(hour);
      time.setMinutes(minute);
      time.setSeconds(second);
      return time;
    }

    static getStressLevel(rmsds, threshold) {
      var lowerCount = 0;
      for (var index = 0; index < rmsds.length; index++) {
        if (rmsds[index] < threshold) {
          lowerCount += 1;
        }
      }
      var stressPercent = lowerCount / rmsds.length;
      if (stressPercent < 0.3) {
        return 'Low';
      } else if (stressPercent < 0.6) {
        return 'Medium';
      } else {
        return 'High';
      }
    }
}
