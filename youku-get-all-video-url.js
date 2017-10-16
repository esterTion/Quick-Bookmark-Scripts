javascript:(function(){
var cna=document.cookie.match(/cna=([^;]+)/)[1];
var vid = location.href.match(/\/id_([a-zA-Z0-9=]+)/)[1];
alert(vid);
document.head.appendChild(document.createElement('script')).src='https://ups.youku.com/ups/get.json?callback=getAllUrl&ccode=0401&client_ip=192.168.1.2&utid=' + encodeURIComponent(cna) + '&client_ts=' + Date.now() + '&vid=' + vid;

window.getAllUrl=function(json){
var str=[];
json.data.stream.forEach(function(i){
str.push(i.stream_type);
str.push('<a href="'+i.m3u8_url+'" target="_blank">'+i.m3u8_url+'</a>');
i.segs.forEach(function(i){
str.push('<a href="'+i.cdn_url+'" target="_blank">'+i.cdn_url+'</a>');
});
str.push("");
});
location.href="data:text/html,"+encodeURIComponent("<meta name=viewport content=width=device-width><style>*{font-family:Verdana;width:100%;overflow:auto;white-space:pre;-webkit-overflow-scrolling:touch}</style><pre>"+str.join("\n")+"</pre>");
};
})()