'use strict';

let allHorns = [];

function Horn(url, title, description, keyword, horns) {
  this.url = url;
  this.title = title;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;

  allHorns.push(this);
}

function getJsonData(){
  $.get('../data/page-1.json', function(json){
    console.log('json:', json);
    $.each(json, function(item) {
      // console.log('item.responseJson', item.responseJSON);
      console.log('json[item]:', json[item]);
      // instantiate a new Horn object
      new Horn(json[item].url, json[item].title, json[item].description, json[item].keyword, json[item].horns);
    });
  });
}

$(document).ready(function(){
  getJsonData();
  console.log('allHorns', allHorns);
  // draw it to the page
});
