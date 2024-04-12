// (function($) {
  
//   "use strict";  

//   $(window).on('load', function() {



//   /*Page Loader active
//     ========================================================*/
//     $('#preloader').fadeOut();

//   // Sticky Nav
//     $(window).on('scroll', function() {
//         if ($(window).scrollTop() > 50) {
//             $('.scrolling-navbar').addClass('top-nav-collapse');
//         } else {
//             $('.scrolling-navbar').removeClass('top-nav-collapse');
//         }
//     });

//     /* slicknav mobile menu active  */
//     $('.mobile-menu').slicknav({
//         prependTo: '.navbar-header',
//         parentTag: 'liner',
//         allowParentLinks: true,
//         duplicate: true,
//         label: '',
//         closedSymbol: '<i class="lni-chevron-right"></i>',
//         openedSymbol: '<i class="lni-chevron-down"></i>',
//       });

//       /* WOW Scroll Spy
//     ========================================================*/
//      var wow = new WOW({
//       //disabled for mobile
//         mobile: false
//     });

//     wow.init();

//      /* Testimonials Carousel 
//     ========================================================*/
//     var owl = $("#teams");
//       owl.owlCarousel({
//         loop: true,
//         nav: false,
//         dots: false,
//         center: true,
//         margin: 15,
//         slideSpeed: 1000,
//         stopOnHover: true,
//         autoPlay: true,
//         responsiveClass: true,
//         responsiveRefreshRate: true,
//         responsive : {
//             0 : {
//                 items: 1
//             },
//             768 : {
//                 items: 3
//             },
//             960 : {
//                 items: 3
//             },
//             1200 : {
//                 items: 3
//             },
//             1920 : {
//                 items: 3
//             }
//         }
//       });  



//     /* Counter
//     ========================================================*/
//     $('.counterUp').counterUp({
//      delay: 10,
//      time: 1000
//     });


//     /* Back Top Link active
//     ========================================================*/
//       var offset = 200;
//       var duration = 500;
//       $(window).scroll(function() {
//         if ($(this).scrollTop() > offset) {
//           $('.back-to-top').fadeIn(400);
//         } else {
//           $('.back-to-top').fadeOut(400);
//         }
//       });

//       $('.back-to-top').on('click',function(event) {
//         event.preventDefault();
//         $('html, body').animate({
//           scrollTop: 0
//         }, 600);
//         return false;
//       });


//   });      

// }(jQuery));


/* Back Top Link active
========================================================*/
var offset = 200;
var duration = 500;
$(window).scroll(function() {
  if ($(this).scrollTop() > offset) {
    $('.back-to-top').fadeIn(400);
  } else {
    $('.back-to-top').fadeOut(400);
  }
});

$('.back-to-top').on('click',function(event) {
  event.preventDefault();
  $('html, body').animate({
    scrollTop: 0
  }, 600);
  return false;
});


var flag = false;
var loading1 = document.getElementById("loading1");
var loading2 = document.getElementById("loading2");
var nps_file = document.getElementById("nps-a");
var textbox = document.getElementById('textbox');
var fileupload = document.getElementById('fileupload');
var table = document.querySelectorAll('.four');
var result_show = document.getElementById('result-show');
var loader_result_show = document.getElementById('loader-result-show');
var filebtn = document.getElementById("filebtn");
var load_nps = document.getElementById("nps-load-a");
var ambtn = document.getElementById("ambtn")


// 质谱文件上传
ambtn.addEventListener("change",function () {

  var file = ambtn.files[0];
  // console.log("上传");
  // console.log(file);
  var formFile = new FormData();
  formFile.append("file", file); //加入文件对象
  // console.log(formFile.get('file'));

  $.ajax({
    url: '/uploader',
    type:'POST',
    data: formFile,
    processData: false,//用于对data参数进行序列化处理 这里必须false
    contentType: false, //必须
    success: function(response) {
      // console.log(response.res);
      alert("MS file uploaded successfully!");
      flag = true;
      ambtn.value = '';
    },
    error:function (res) { //这里是如果过程中出现错误，打印出来的报错信息之类的
      // console.log("错误");
      alert("Your upload file is not a valid MS!");
    }
  })
})

// Text Input上传
function enter() {
  clear();  // 点击submit，清空之前的tr
  result_show.style.display = 'none'; // 点击submit，隐藏返回结果div
  nps_file.style.display = 'none'; // 点击submit，隐藏返回nps文件下载
 
  var keywords = $('#keywords').val()
  if (keywords == "请输入反应物" || keywords == "") {
    alert("请输入反应物");
    return false;
  }

  if (flag == false) {
    alert("please upload the MS file");
    return false;
  }

  loading1.style.display = 'block';  // 转圈圈表示在计算中。。。
  var data = {'data': keywords, 'type': 'textinput'}
  // console.log(data)
  $.ajax({
    url: '/',
    type:'POST',
    data: data,
    success: function(response) {
      // console.log(response)
      loading1.style.display = 'none'; // 后端计算完且返回结果，隐藏转圈圈
      
      // 文件下载
      const blob = new Blob([response.nps_file])
      let url = URL.createObjectURL(blob)
      nps_file.style.display = 'block';
      document.getElementById("nps_file").href = url 

      // 产物显示
      result_show.style.display = 'block'
      $('#rts').html("<p>" + response.rts + "</p>");

      shownps = '';
      var count = 0;
      var count_tr = 1;
      for (var i = 0; i < response.nps.length; i++) {
        shownps += "<td><p>" + response.nps[i] + "</p> <img src='data:image/png;base64," + response.nps_img[i] + "' style='margin: 0 auto;'></td>";
        count += 1;
        if (count == 4) {
          $("#row" + String(count_tr)).append(shownps);
          count = 0;
          shownps = '';
          count_tr += 1;
        }
      }
      // 匹配产物显示
      showpnps = '';
      var count = 0;
      var count_tr = 1;
      if (response.am.length == 0) {
        $('#pnps').html("<p>No Predicted Natural Products Found</p>");
       }
      for (var i = 0; i < response.am.length; i++) {
        showpnps += "<td><p>" + response.am[i][0] + "</p> <p>" + response.am[i][1] +"</p> <img src='data:image/png;base64," + response.am_img[i] + "' style='margin: 0 auto;'></td>";
        count += 1;
        // console.log(response)
        if (count == 4) {
          $("#pnp" + String(count_tr)).append(showpnps);
          count = 0;
          showpnps = '';
          count_tr += 1;
        }
      }
      $("#pnp" + String(count_tr)).append(showpnps);

      //最终文件下载
      const blob_ms = new Blob([response.am_file])
      let url_ms = URL.createObjectURL(blob_ms)
      document.getElementById("spnps_file").href = url_ms; 

      // 清空输入框内容
      document.getElementById("keywords").value = '';
      flag = false;
    },
    error:function (res) { //这里是如果过程中出现错误，打印出来的报错信息之类的
      // console.log("错误");
      loading1.style.display = 'none';
      alert("Your enter is not a valid reaction!");
    }
  })
}

// 文件上传
filebtn.addEventListener("change",function () {
  loader_clear();
  loader_result_show.style.display = 'none'
  load_nps.style.display = 'none';

  if (flag == false) {
    alert("please upload the MS file");
    filebtn.value = '';
    return false;
  }

  var file = filebtn.files[0];
  // console.log("上传");
  // console.log(file);
  loading2.style.display = 'block';
  var formFile = new FormData();
  formFile.append("file", file); //加入文件对象
  // console.log(formFile.get('file'));

  $.ajax({
    url: '/',
    type:'POST',
    data: formFile,
    processData: false,//用于对data参数进行序列化处理 这里必须false
    contentType: false, //必须
    success: function(response) {
      // console.log("上传成功");
      console.log(response)
      loading2.style.display = 'none';

      // 文件下载
      const blob = new Blob([response.nps_file])
      let url = URL.createObjectURL(blob)
      load_nps.style.display = 'block';
      document.getElementById("load_nps").href = url;

      // 产物显示
      loader_result_show.style.display = 'block'
      $('#loader-rts').html("<p>" + response.rts + "</p>");

      shownps = '';
      var count = 0;
      var count_tr = 1;
      for (var i = 0; i < response.nps.length; i++) {
        shownps += "<td><p>" + response.nps[i] + "</p> <img src='data:image/png;base64," + response.nps_img[i] + "' style='margin: 0 auto;'></td>";
        count += 1;
        if (count == 4) {
          $("#loader-row" + String(count_tr)).append(shownps);
          count = 0;
          shownps = '';
          count_tr += 1;
        }
      };
      // 匹配产物显示
      showpnps = '';
      var count = 0;
      var count_tr = 1;
      if (response.am.length == 0) {
        $('#loader-pnps').html("<p>No Predicted Natural Products Found</p>");
       }
      for (var i = 0; i < response.am.length; i++) {
        showpnps += "<td><p>" + response.am[i][0] + "</p> <p>" + response.am[i][1] +"</p> <img src='data:image/png;base64," + response.am_img[i] + "' style='margin: 0 auto;'></td>";
        count += 1;
        if (count == 4) {
          $("#loader-pnp" + String(count_tr)).append(showpnps);
          count = 0;
          showpnps = '';
          count_tr += 1;
        }
      }
      $("#loader-pnp" + String(count_tr)).append(showpnps);

      //最终文件下载
      const blob_ms = new Blob([response.am_file])
      let url_ms = URL.createObjectURL(blob_ms)
      document.getElementById("loader-spnps").href = url_ms;

      filebtn.value = '';
      flag = false;
    },
    error:function (res) { //这里是如果过程中出现错误，打印出来的报错信息之类的
      // console.log("错误");
      loading2.style.display = 'none';
      alert("Your upload file is not a valid reaction!");
    }
  })
})


filebtn.addEventListener("click",function () {
  loader_clear();
  loader_result_show.style.display = 'none'
  load_nps.style.display = 'none';
})


document.addEventListener('drop', function (e) {
  e.preventDefault()
}, false)
document.addEventListener('dragover', function (e) {
  e.preventDefault()
}, false)

// 拖拽上传
const dropBox = document.querySelector("#drag-and-drop-zone");
dropBox.addEventListener("dragenter",dragEnter,false);
dropBox.addEventListener("dragleave",dragLeave,false);
dropBox.addEventListener("dragover",dragOver,false);
dropBox.addEventListener("drop",drop,false);

function dragEnter(e){
	e.stopPropagation();
	e.preventDefault();
}

function dragLeave(e){
	e.stopPropagation();
	e.preventDefault();
}

function dragOver(e){
	e.stopPropagation();
	e.preventDefault();
}

function drop(e){
  e.preventDefault();

  loader_clear();
  loader_result_show.style.display = 'none'
  load_nps.style.display = 'none'

  if (flag == false) {
    alert("please upload the MS file");
    filebtn.value = '';
    return false;
  }

	// 当文件拖拽到dropBox区域时,可以在该事件取到files
	const files = e.dataTransfer.files[0];

  // console.log("拖拽");
  // console.log(files);
  loading2.style.display = 'block';
  var formFile = new FormData();
  formFile.append("file", files);
  // console.log(formFile.get('file'));
  $.ajax({
    url: '/',
    type:'POST',
    data: formFile,
    processData: false,//用于对data参数进行序列化处理 这里必须false
    contentType: false, //必须
    success: function(response) {
      // console.log("上传成功");
      loading2.style.display = 'none';

      // 文件下载
      const blob = new Blob([response.nps_file])
      let url = URL.createObjectURL(blob)
      load_nps.style.display = 'block';
      document.getElementById("load_nps").href = url;  

      // 产物显示
      loader_result_show.style.display = 'block'
      $('#loader-rts').html("<p>" + response.rts + "</p>");

      shownps = '';
      var count = 0;
      var count_tr = 1;
      for (var i = 0; i < response.nps.length; i++) {
        shownps += "<td><p>" + response.nps[i] + "</p> <img src='data:image/png;base64," + response.nps_img[i] + "' style='margin: 0 auto;'></td>";
        count += 1;
        if (count == 4) {
          $("#loader-row" + String(count_tr)).append(shownps);
          count = 0;
          shownps = '';
          count_tr += 1;
        }
      };
       // 匹配产物显示
       showpnps = '';
       var count = 0;
       var count_tr = 1;
       if (response.am.length == 0) {
        $('#loader-pnps').html("<p>No Predicted Natural Products Found</p>");
       }
       for (var i = 0; i < response.am.length; i++) {
         showpnps += "<td><p>" + response.am[i][0] + "</p> <p>" + response.am[i][1] +"</p> <img src='data:image/png;base64," + response.am_img[i] + "' style='margin: 0 auto;'></td>";
         count += 1;
        //  console.log(response)
         if (count == 4) {
           $("#loader-pnp" + String(count_tr)).append(showpnps);
           count = 0;
           showpnps = '';
           count_tr += 1;
         }
       }
       $("#loader-pnp" + String(count_tr)).append(showpnps);
 
       //最终文件下载
       const blob_ms = new Blob([response.am_file])
       let url_ms = URL.createObjectURL(blob_ms)
       document.getElementById("loader-spnps").href = url_ms;

      filebtn.value = '';
      flag = false;
    },
    error:function (res) { //这里是如果过程中出现错误，打印出来的报错信息之类的
      // console.log("错误");
      loading2.style.display = 'none';
      alert("Your upload file is not a valid reaction!");
    }
  })
}


document.getElementById("way1").onclick = function() {
  // console.log('click textbox')
  // 点击Text input后， file upload相关隐藏
  loader_result_show.style.display = 'none'
  load_nps.style.display = 'none';
  changpage();
  textbox.style.display = 'block';
}

document.getElementById("way2").onclick = function() {
  // console.log('click fileupload')
  // 点击Text input后， file upload相关隐藏
  result_show.style.display = 'none';
  nps_file.style.display = 'none';
  changpage()
  fileupload.style.display = 'block'
}

function changpage() {
  document.querySelectorAll('.way').forEach(el=>{
    // console.log('el change')
    el.style.display = 'none'
  })
}


function clear() {
  for (var i = 1; i < 9; i++) {
    $("#row" + String(i)).html('');
  }
  for (var i = 1; i < 4; i++) {
    $("#pnp" + String(i)).html('');
  }
}

function loader_clear() {
  for (var i = 1; i < 9; i++) {
    $("#loader-row" + String(i)).html('');
  }
  for (var i = 1; i < 4; i++) {
    $("#loader-pnp" + String(i)).html('');
  }
}



