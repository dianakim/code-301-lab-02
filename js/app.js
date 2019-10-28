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

Image.prototype.toHtml = function() {
  let template = $('#photo-template').html();
  let templateRender = Handlebars.compile(template);
  return templateRender(this);
};

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
  Image.allImages.forEach(imageToRender => {
    $('#photos-container').append(imageToRender.toHtml());
  });
};

Image.loadFilterList = () => {
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

$(() => {
  Image.getJsonData('data/page-1.json');
  Image.loadImages();
  Image.loadFilterList();
});
