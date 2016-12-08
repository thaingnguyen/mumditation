export default class HRVCalculator {
    static getHRV(data) {
        if (data && data['activities-heart-intraday']) {
            var data = data['activities-heart-intraday']['dataset'];
            var rrIntervals = this.getRRIntervalsFromData(data);
            var averageRMSSDs = this.getAvgRmssdOverInterval(rrIntervals, 60000);
            var sumRMSSD = 0;
            var rmssds = [];
            var times = [];
            for (var index = 0; index < averageRMSSDs.length; index += 1){
              sumRMSSD += averageRMSSDs[index].value;
              rmssds.push(averageRMSSDs[index].value);
              times.push(averageRMSSDs[index].time.getHours() + ":" + averageRMSSDs[index].time.getMinutes());
            }
            var rMSSD = sumRMSSD / averageRMSSDs.length;

            // console.log(averageRMSSDs);
            console.log(rMSSD);

            var stats = {};
            stats['stress'] = this.getStressLevel(rmssds, 3.58);
            stats['bpm'] = data[data.length-1].value;
            stats['rmssd'] = rmssds;
            stats['time'] = times;
            stats['avg_rmssd'] = rMSSD.toFixed(3);


            console.log(rmssds.join(","));
            // console.log(times.join("','"));

            return stats;
        } else {
          return {
            'stress': 'High',
            'bpm': 82,
            'avg_rmssd': 3.2,
            'rmssd': [3.340588176828815,2.8322775629129597,3.139579262138686,3.203739132717718,3.127618299137187,2.790941676601407,2.634627350086385,2.991042530285121,2.8896604682748555,3.2679864520871886,3.4686531450372993,3.230379861956096,3.805320473968936,3.56506441486395,3.468203027304451,3.4240395905281904,3.575592176657386,3.7409511473406436,3.5914989253095873,3.652618149526451,3.2250788875031087,2.4455110869465733,2.921361000152787,1.8711461627333537,3.099319468093838,2.967387778423896,3.077586519179653,3.288633116955106,3.1885850686476793,3.1453671854881238,3.3494212101517515,3.23825581457883,3.157373124682695,3.1941699735923472,3.6815613505048606,3.0670103221293377,3.419776738413401,3.224912847946024,3.375224260445426,3.291243718546794,3.28296982650423,3.266077126254939,3.368005771801552,3.286515545573805,3.2240019124212305,3.040492609892461,3.1297073923327563],
            'time': ['0:23','0:40','0:46','1:25','2:42','2:46','2:51','2:55','3:8','3:35','3:48','5:2','5:19','5:39','6:2','7:34','8:22','8:31','9:2','9:55','10:28','10:31','10:59','11:3','11:31','11:41','11:50','11:53','12:0','12:30','12:49','13:31','14:15','15:48','16:0','16:17','16:36','17:20','17:22','17:46','18:16','18:43','18:57','20:40','21:42','21:46','22:5']
          }
        }
    }

    static getRRIntervalsFromData(data) {
      var rrs = [];
      for (var index = 0; index < data.length; index++) {
          var parsedTime = data[index].time.split(":");
          rrs.push({
              'value': 60000.0 / data[index].value,
              'time': this.createTime(parsedTime[0], parsedTime[1], parsedTime[2])
          });
      }
      return rrs;
    }

    static getNumSeconds(input) {
        var t = Date.parse(input);
        return t.getSeconds() + (t.getMinutes()*60) + (t.getHours()*60*60);
    }

    // Interal is in milliseconds unit
    static getAvgRmssdOverInterval(rrIntervals, interval) {
      var averageRMSSDs = [];
      var currentIntervalCount = 0;
      var currentSumSSD = 0;
      var lastTime = null;

      for(var index = 1; index < rrIntervals.length; index++) {
        if (rrIntervals[index].time - rrIntervals[index - 1].time < interval) {
          var diff = rrIntervals[index].value - rrIntervals[index-1].value;
          currentSumSSD += diff * diff;
          currentIntervalCount += 1;
          lastTime = rrIntervals[index].time;
        } else {
          if (currentIntervalCount > 1 && currentSumSSD > 0) {
            averageRMSSDs.push({
              'value': Math.log(Math.sqrt(currentSumSSD / (currentIntervalCount - 1))),
              'time': lastTime
            });
          }
          currentIntervalCount = 0;
          currentSumSSD = 0;
          lastTime = null;
        }
      }
      return averageRMSSDs;
    }

    static createTime(hour, minute, second) {
      var time = new Date();
      time.setHours(hour);
      time.setMinutes(minute);
      time.setSeconds(second);
      return time;
    }

    static getStressLevel(rmssds, threshold) {
      var lowerCount = 0;
      console.log(threshold);
      for (var index = 0; index < rmssds.length; index++) {
        console.log(rmssds[index]);

        if (rmssds[index] < threshold) {
          lowerCount += 1.0;
        }
      }
      var stressPercent = lowerCount / rmssds.length;
      console.log(stressPercent);
      if (stressPercent < 0.5) {
        return 'Low';
      } else if (stressPercent < 0.8) {
        return 'Medium';
      } else {
        return 'High';
      }
    }
}
