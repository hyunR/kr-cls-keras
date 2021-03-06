const SEQUENCE_LENGTH = 58;
var dict = {};
var model;
var myChart;

function TextToIndexVector(text, seqlen) {
  var wordVec = new Array();
  text = text.toLowerCase();
  var wordlst = text.split('');
  wordlst.forEach(function(word) {

    if (wordVec.length != seqlen) {
      if (word in dict) {
        wordVec.push(dict[word])
      } else {
        wordVec.push(0)
      }
    }
  });
  var new_arr = Array(seqlen - wordVec.length).fill(0).concat(wordVec)
  return new_arr;
}

function LoadModel() {

  $("#detectBtn").prop('disabled', true);
  NProgress.start();
  $("#messageType").html("<div class=\"alert alert-info\"><h5><i  class=\"fa fa-cloud-download\"></i>  모델 로딩중...</h5></div>");
  $.getJSON("wordindex_char_size.json", function(json) {
    dict = json;
  });
  model = new KerasJS.Model({
    filepath: './models/drip_boom_model.bin',
    gpu: false
  });

  model
    .ready()
    .then(() => {
      console.log("Model ready");
      NProgress.done();
      $("#messageText").prop('disabled', false);
      $("#messageType").html("<div class=\"alert alert-success\"><h5><i  class=\"fa fa-check-circle\"></i>  모델 로딩 완료</h5></div>");
      $("#messageType").fadeTo(2000, 500).slideUp(500, function() {
        $("#messageType").slideUp(500);
      });
    })


}

function checkInput() {
  var x = document.getElementById("messageText").value;
  if (x == "") {
    $("#detectBtn").prop('disabled', true);
    $("#messageType2").html("<div></div>");

  } else {
    $("#detectBtn").prop('disabled', false);
    $("#messageType2").html("<div class=\"alert alert-dark\"><h5><i  class=\"fa fa-keyboard-o\"></i> 입력중...</h5></div>");
  }
}

function evaluation() {
  NProgress.start();
  var x = document.getElementById("messageText").value;
  if (x == "") {
    $("#messageType2").html("<div class=\"alert alert-danger\"><h5> 입력값이 없습니다. </h5></div>");
    return
  }

  var result = TextToIndexVector(x, SEQUENCE_LENGTH);
  var seqIn = new Float32Array(result);
  model.predict({
    input: seqIn
  }).then(outputData => {
    $("#messageType2").html("<div class=\"alert alert-success\"> <h5><i  class=\"fa fa-check\"></i> 예측 완료 </h5></div>");
    if (outputData.output[4] > 0.95) {
      $("#messageType2").html("<div class=\"alert alert-danger\"><h5> ! 씹뜨억 경고 ! </h5></div>");
    }
    // $("#result").html(
    //   "붐베 : " + (outputData.output[0] * 100).toFixed(2) + '%' + "<br>" +
    //   "개드립 : " + (outputData.output[1] * 100).toFixed(2) + '%' + "<br>"
    // );

    $("#boom").html((outputData.output[0] * 100).toFixed(2) + '%');
    $("#drip").html((outputData.output[1] * 100).toFixed(2) + '%');

    var resultData = [(outputData.output[0] * 100).toFixed(4), (outputData.output[1] * 100).toFixed(4)]
    if (typeof(myChart) == "object") {
      myChart.destroy();
    }
    var ctx = $("#myChart");
    myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ["붐베", "개드립"],
        datasets: [{
          label: "hi",
          data: [(outputData.output[0] * 100).toFixed(4), (outputData.output[1] * 100).toFixed(4)],
          backgroundColor: [
            'rgba(255, 0, 0, 0.6)',
            'rgba(0, 0, 255, 0.6)'
          ]
        }]
      },
      options: {
        responsive: false
      }
    });
    NProgress.done();
  });

}

function precise(x) {
  return Number.parseFloat(x).toPrecision(4);
}