$().ready(function() {});

function appendAttributes(object,category){
  for (var k in object){
    if(typeof(object[k])==='object'&&object[k]!=null){
      var idx = 0;
      for (var i in object[k]) {
        if (idx===2) {
          var identifier = object[k][i];
        };
        idx++;
      };
      $("div#usr").append("<h5><a name='"+k+"s' value='"+object[k].ID+"' class='text-white object-instance' href='#'>"+k+": "+identifier+"</a></h5>");
    } else {
      $("div#usr").append("<h5>"+k+": "+object[k]+"</h5>");
    };
  };
  if (category==='PurchaseRequests') {
    $("div#usr").append("<div id='lineItems'></div>");
    appendAssociatedLineItems(object.ID);
    buttonToAddLineItems();
  };
};

function appendObjects(list,category){
  $('#usr').empty();
  for (var k in list){
    var idx = 0;
    for (var i in list[k]) {
      if (idx===2) {
        $("div#usr").append("<h5><a name='"+category+"' value='"+list[k].ID+"' class='text-white object-instance' href='#'>"+k+": "+list[k][i]+"</a></h5>");
      };
      idx++;
    };
  };
};

function listAllAttributes(category,id){
  $('#usr').empty();
  $.getJSON(`http://prs.doudsystems.com/`+category+`/Get/`+id+``)
    .done(function(object) {
      appendAttributes(object,category);
    });
};

$('div#usr').on('click','a',function(e) {
  e.preventDefault();
  listAllAttributes($(this).attr('name'),$(this).attr('value'));
});

function getCategoryList(category){
  $.getJSON(`http://prs.doudsystems.com/`+category+`/List`)
    .done(function(list) {
      appendObjects(list,category);
    });
};

function addProductDropdownList(){
  $.getJSON(`http://prs.doudsystems.com/Products/List`)
    .done(function(list) {
      for(var x in list){
        $('#selectProduct').append("<option value='value1'>"+list[x].Name+"</option>")
        // console.log(list[x].Name);
      };
    });
};

$('a.navbar-brand').on('click',function() {
  var that = $(this).attr('value');
  getCategoryList(that);
});

function buttonToAddLineItems(){
  $("div#lineItems").append("<button id='prliButton' class='btn btn-primary'>add a new line item</button>").on('click',function(event) {
    if(event.target.id==='prliButton'){
      $('div#lineItems').prepend("<form id='productDropdown' class='jumbotron'><div id='productDiv'><label>Product: </label><select id='selectProduct'></div>");
      addProductDropdownList();
      $('#productDropdown').append("<div><label>Quantity: </label><input type='text' id='quantity'></div></form>");
      $('#productDropdown').append("<button>this does not work yet as greg doesnt want us messing with the data</button>")
      $('button#prliButton').remove();
    }else {
      event.preventDefault();
    }
  });
};

function appendAssociatedLineItems(id) {
  $.getJSON(`http://prs.doudsystems.com/PurchaseRequestLineItems/List`)
    .done(function(list) {
      for(var m in list){
        if (list[m].PurchaseRequestId===id) {
          $("div#lineItems").append("<h5><a name='Products' value='"+list[m].Product.ID+"' class='text-white object-instance' href='#'>"+list[m].Product.Name+" -(quantity :"+list[m].Quantity+")"+"</a></h5>");
        };
      };
    });
};