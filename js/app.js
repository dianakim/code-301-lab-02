'use strict';

function Image(image) {
  this.image_url = image.image_url;
  this.title = image.title;
  this.description = image.description;
  this.keyword = image.keyword;
  this.horns = image.horns;
}

Image.allImages = [];
let allKeywords = [];

Image.prototype.render = function() {
  $('main').append('<div class="clone"></div>');
  let imageClone = $('div[class="clone"]');
  let imageHtml = $('#photo-template').html();

  allKeywords.push(this.keyword);

  imageClone.html(imageHtml);
  imageClone.find('h2').text(this.title);
  imageClone.find('img').attr('src', this.image_url);
  imageClone.find('p').text(this.description);
  imageClone.attr('data-keyword', this.keyword);
  imageClone.removeClass('clone');
  imageClone.attr('class', this.title);
  $('#photo-template').hide();
};

$('select[name="keyword"]').on('change', function() {
  let $selection = $(this).val();
  $('div').hide();
  $(`div[data-keyword="${$selection}"]`).show();
});

$('.page').on('click', function() {
  let $selection = $(this).text();
  let jsonFilePath = '';
  $('div').remove();
  allKeywords = [];

  // empty out the allImages array
  Image.allImages = [];

  if ($selection === 'Page 1'){
    jsonFilePath = 'data/page-1.json';
  } else {
    jsonFilePath = 'data/page-2.json';
  }
  Image.getJsonData(jsonFilePath);
});

function loadFilterList(){
  // first, remove duplicate values in allKeywords array
  const uniqueKeywords = Array.from(new Set(allKeywords));
  let keyList = $('select[id="keyword-dropdown"]');
  // empty dropdown list
  keyList.find('option').not(':first').remove();

  // for each item in uniqueKeywords, add a new dropdown list item
  $.each(uniqueKeywords, function(index, value){
    $('select').append('<option class="keyword-clone"></option>');
    let keywordOptionClone = $('option[class="keyword-clone"]');
    keywordOptionClone.text(value);
    keywordOptionClone.removeClass('keyword-clone');
    keywordOptionClone.attr('class', value);
  });
}

Image.getJsonData = (filePath) => {
  $.get(filePath, 'json')
    .then(data => {
      data.forEach(item => {
        Image.allImages.push(new Image(item));
      });
    })
    .then(Image.loadImages);
};

Image.loadImages = () => {
  Image.allImages.forEach(image => image.render());
  loadFilterList();
};

$(() => {
  Image.getJsonData('data/page-1.json');
});

// $(document).ready( () => {
//   Image.getJsonData();
// });
