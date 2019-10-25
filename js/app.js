'use strict';

function Horn(horn) {
  this.image_url = horn.image_url;
  this.title = horn.title;
  this.description = horn.description;
  this.keyword = horn.keyword;
  this.horns = horn.horns;
}

Horn.allHorns = [];
let allOptions = [];

Horn.prototype.render = function() {
  $('main').append('<div class="clone"></div>');
  let hornClone = $('div[class="clone"]');
  let hornHtml = $('#photo-template').html();

  // if this.keyword isn't already in the allOptions array
  // add it to the array and append to dropdown
  allOptions.forEach(function(value){
    if(this.keyword === value){
      console.log('keyword: ', this.keyword);
      console.log('value: ', value);
    } else {
      $('select').append('<option class="keyword-clone"></option>');
      let keywordOptionClone = $('option[class="keyword-clone"]');
      keywordOptionClone.text(this.keyword);
      keywordOptionClone.removeClass('keyword-clone');
      keywordOptionClone.attr('class', this.keyword);

      allOptions.push(value);
    }
  });

  // $('select').append('<option class="keyword-clone"></option>');
  // let keywordOptionClone = $('option[class="keyword-clone"]');
  // keywordOptionClone.text(this.keyword);
  // keywordOptionClone.removeClass('keyword-clone');
  // keywordOptionClone.attr('class', this.keyword);



  hornClone.html(hornHtml);
  hornClone.find('h2').text(this.title);
  hornClone.find('img').attr('src', this.image_url);
  hornClone.find('img').attr('data-keyword', this.keyword);
  hornClone.find('p').text(this.description);
  hornClone.removeClass('clone');
  hornClone.attr('class', this.title);
  $('#photo-template').hide();
};

$('select[name="keyword"]').on('change', function() {
  let $selection = $(this).val();
  $('img').hide();
  $(`img[data-keyword="${$selection}"]`).show();
});

Horn.getJsonData= () => {
  $.get('../data/page-1.json', 'json')
    .then(data => {
      data.forEach(item => {
        Horn.allHorns.push(new Horn(item));
      });
    })
    .then(Horn.loadHorns);
};

Horn.loadHorns = () => {
  Horn.allHorns.forEach(horn => horn.render());
};

$(() => Horn.getJsonData());
