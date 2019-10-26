'use strict';

function Horn(horn) {
  this.image_url = horn.image_url;
  this.title = horn.title;
  this.description = horn.description;
  this.keyword = horn.keyword;
  this.horns = horn.horns;
}

Horn.allHorns = [];
let allKeywords = [];

Horn.prototype.render = function() {
  $('main').append('<div class="clone"></div>');
  let hornClone = $('div[class="clone"]');
  let hornHtml = $('#photo-template').html();

  allKeywords.push(this.keyword);

  hornClone.html(hornHtml);
  hornClone.find('h2').text(this.title);
  hornClone.find('img').attr('src', this.image_url);
  hornClone.find('p').text(this.description);
  hornClone.attr('data-keyword', this.keyword);
  hornClone.removeClass('clone');
  hornClone.attr('class', this.title);
  $('#photo-template').hide();
};

$('select[name="keyword"]').on('change', function() {
  let $selection = $(this).val();
  $('div').hide();
  $(`div[data-keyword="${$selection}"]`).show();
});

function loadFilterList(){
  // first, remove duplicate values in allKeywords array
  const uniqueKeywords = Array.from(new Set(allKeywords));

  // for each item in uniqueKeywords, add a new dropdown list item
  $.each(uniqueKeywords, function(index, value){
    $('select').append('<option class="keyword-clone"></option>');
    let keywordOptionClone = $('option[class="keyword-clone"]');
    keywordOptionClone.text(value);
    keywordOptionClone.removeClass('keyword-clone');
    keywordOptionClone.attr('class', value);
  });
}

Horn.getJsonData = () => {
  $.get('data/page-1.json', 'json')
    .then(data => {
      data.forEach(item => {
        Horn.allHorns.push(new Horn(item));
      });
    })
    .then(Horn.loadHorns);
};

Horn.loadHorns = () => {
  Horn.allHorns.forEach(horn => horn.render());
  loadFilterList();
};

$(() => Horn.getJsonData());

// $(document).ready( () => {
//   Horn.getJsonData();
// });
