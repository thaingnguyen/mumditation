export default class HRVCalculator {
    static getHRV(data) {
        if (data && data['activities-heart-intraday']) {
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
            console.log(runningRMSSD.join(","));
            console.log(time.join("','"));
            stats['avg_rmssd'] = Number((runningSum / rmssdArr.length).toFixed(3));
            return stats;
        } else {
          return {
            'stress': 'High',
            'bpm': 82,
            'avg_rmssd': 0.162,
            'rmssd': [0,0.23570226039551584,0.23570226039551584,0.22941573387056177,0,0.31622776601683794,0.22360679774997896,0.3333333333333333,0,0.22941573387056177,2.014235055087379,1.0504514628777804,1.2909944487358056,1.1245914290767742,1.118033988749895,0.7687061147858074,0.982607368881035,0.5916079783099616,1.1913667943625412,0.8660254037844386,0.6,0.565685424949238,0.5107539184552492,0.7637626158259734,0.674199862463242,0.7071067811865476,0.6582805886043833,0.4264014327112209,0.5188745216627708,0.6831300510639732,0.5222329678670935,0.5516772843673705,0.7302967433402214,0.5400617248673217,0.22941573387056177,0.5,0.7359800721939872,0.8416254115301732,0.6030226891555273,0.7237468644557459,0.5,0.6255432421712243,0.938083151964686,0,0.5916079783099616,0.6069769786668839,0.22360679774997896,0.5640760748177662,0.6172133998483676,0.4472135954999579,0,0,0,0.3535533905932738,0.5477225575051661,0.22941573387056177,0.3244428422615251,0,0,0,0,0,0,0,0,0,3.3015148038438356,0,4.724212296053366,2.258317958127243,2.796101181678127,0.4364357804719847,0.3779644730092272,0.5773502691896257,1,0.9354143466934853,0.6793662204867574,0.4364357804719847,0.674199862463242,0.22941573387056177,0.7071067811865476,0.4264014327112209,0,1.103354568734741,0.3872983346207417,0.5516772843673705,0,0.5222329678670935,0.5773502691896257,0.6030226891555273,0.7071067811865476,0.6396021490668313,0.22360679774997896,0.6255432421712243,0.659380473395787,0.6915640748081247,0.7687061147858074,0.659380473395787,0.8451542547285166,0.67700320038633,0.5516772843673705,0.816496580927726,0.6546536707079771,0.5516772843673705,0.6255432421712243,0.674199862463242,10.43822407017259,0.4472135954999579,0.3779644730092272,0.944911182523068,0.674199862463242,0.8257228238447705,0.45883146774112354,0.8660254037844386,0.7483314773547883,0.5222329678670935,0.31622776601683794,0.5640760748177662,0.4879500364742666,0.23570226039551584,0.39735970711951313],
            'time': ['6:57','6:58','6:59','7:0','7:1','7:2','7:3','7:4','7:5','7:6','7:7','7:8','7:9','7:10','7:11','7:12','7:13','7:14','7:15','7:16','7:17','7:18','7:19','7:20','7:21','7:22','7:23','7:24','7:25','7:26','7:27','7:28','7:29','7:30','7:31','7:32','7:33','7:34','7:35','7:36','7:37','7:38','7:39','7:40','7:41','7:42','7:43','7:44','7:45','7:46','7:47','7:48','7:50','7:51','7:54','7:55','7:56','7:57','8:33','8:34','8:35','8:39','8:40','8:41','10:9','10:10','10:11','10:52','10:53','10:54','10:55','10:56','10:57','10:58','10:59','11:0','11:1','11:2','11:3','11:4','11:5','11:6','11:7','11:8','11:9','11:10','11:11','11:12','11:13','11:14','11:15','11:16','11:17','11:18','11:19','11:20','11:21','11:22','11:23','11:24','11:25','11:26','11:27','11:28','11:29','11:30','11:31','11:32','11:33','11:34','11:35','11:36','11:37','11:38','11:39','11:40','11:41','11:42','11:43','11:44','11:45']
          }
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
