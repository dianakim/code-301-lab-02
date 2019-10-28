'use strict';

let allKeywords = [];

function Image(image) {
  this.image_url = image.image_url;
  this.title = image.title;
  this.description = image.description;
  this.keyword = image.keyword;
  this.horns = image.horns;
}

Image.allImages = [];

Image.prototype.toHtml = function() {
  let template = $('#photo-template').html();
  let templateRender = Handlebars.compile(template);
  return templateRender(this);
};

function populateUniqueKeywordsArr(key) {
  console.log('key from popoulateUniqueKeywordsArr: ', key);
  if (!allKeywords.includes(key)) {
    allKeywords.push(key);
  }
}

Image.getJsonData = (filePath) => {
  $.get(filePath, 'json')
    .then(data => {
      data.forEach(item => {
        Image.allImages.push(new Image(item));
        populateUniqueKeywordsArr(item.keyword);
        console.log('item.keyword from Image.getJsonData: ', item.keyword);
      });
      console.log('allKeywords from Image.getJsonData: ', allKeywords);
    })
    .then(Image.loadImages)
    .then(Image.loadFilterList);
};

Image.loadImages = () => {
  Image.allImages.forEach(imageToRender => {
    $('#photos-container').append(imageToRender.toHtml());
  });
};

Image.loadFilterList = () => {
  // empty filter dropdown list except for the first option
  let filterContainer = $('select[id="filters-container"]');
  console.log('filterContainer from Image.loadFilterList: ', filterContainer);
  filterContainer.find('option').not(':first').remove();

  // for each item in allKeywords, add a new dropdown list item
  $.each(allKeywords, function(index, value){
    console.log('current keyword from Image.loadFilterList: ', value);
    filterContainer.append(`<option value="${value}">${value}</option> `);
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
  // Image.loadFilterList();
});
