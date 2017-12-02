var province = dealer_data.citylist[province_id].pid;
var province_name = dealer_data.citylist[province_id].p;
var city = dealer_data.citylist[province_id].c[city_id].nid;
var city_name = dealer_data.citylist[province_id].c[city_id].n;
var dealer = dealer_data.citylist[province_id].c[city_id].a[dealer_id].scode;
var dealer_name = dealer_data.citylist[province_id].c[city_id].a[dealer_id].s;


var _aid = 0, _fid = 0;
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}

if (GetQueryString("ProjectID")) {
  _aid = GetQueryString("ProjectID");
};

if (GetQueryString("MediaID")) {
  _fid = GetQueryString("MediaID");
};
