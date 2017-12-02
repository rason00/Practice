
//-------省份-----------------
var _province, selected_province, dealer_data;

function getProvince() {
  _province = dealer_data.citylist;
  $("#province").empty();
  $("#province").append('<option>请选择省份</option>');
  for (var i in _province) {
    $("#province").append("<option value='" + i + "'>" + _province[i].p + "</option>");
  }
  getCity(0);
};

function getCity(id) {
  var c = _province[id].c;
  selected_province = c;
  $("#city").empty();
  $("#city").append('<option>请选择城市</option>');
  var first = 0;
  for (var i in c) {
    if (first == 0) {
      first = i;
    }
    $("#city").append("<option value='" + i + "'>" + c[i].n + "</option>")
  }
  getDealer(0);
};

function getDealer(id) {
  var d = selected_province[id].a;
  $("#dealer").empty();
  $("#dealer").append('<option>请选择经销商</option>');
  for (var i = 0, n = d.length; i < n; i++) {
    $("#dealer").append("<option value='" + i + "'>" + d[i].s + "</option>")
  };
};

// ----省市-----
$.ajax({
  url: "/js/dealer_data.js",
  type: "get",
  dataType: "json",
  success: function (json) {
    dealer_data = json;
    getProvince();
  }
});
$("#province").change(function () {
  var id = $(this).val();
  getCity(id);
});

$("#city").change(function () {
  var id = $(this).val();
  getDealer(id);
});