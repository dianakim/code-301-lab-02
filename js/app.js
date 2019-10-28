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
  if (!allKeywords.includes(key)) {
    allKeywords.push(key);
  }
}

Image.getJsonData = (filePath) => {
  $.get(filePath, 'json')
    .then(data => {
      data.forEach(item => {
        Image.allImages.push(new Image(item));
        Image.sortBy('title');
        populateUniqueKeywordsArr(item.keyword);
      });
    })
    .then(Image.loadImages)
    .then(Image.loadFilterList);
};

Image.loadImages = () => {
  $('div').remove();
  console.log('loading images');
  console.log('Image.allImages from .loadImages: ', Image.allImages);
  Image.allImages.forEach(imageToRender => {
    $('#photos-container').append(imageToRender.toHtml());
  });
};

Image.loadFilterList = () => {
  // empty filter dropdown list except for the first option
  let filterContainer = $('select[id="filters-container"]');

  filterContainer.find('option').not(':first').remove();

  // for each item in allKeywords, add a new dropdown list item
  $.each(allKeywords, function(index, value){
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

Image.sortBy = (sortCategory) => {
  Image.allImages.sort((a, b) => {
    console.log('a[sortCategory]: ', a[sortCategory]);
    console.log('b[sortCategory]: ', b[sortCategory]);
    return (a[sortCategory] > b[sortCategory]) ? 1 : (a[sortCategory] < b[sortCategory]) ? -1 : 0;
  });
  console.log('sorted Image.allImages: ', Image.allImages);
};

$('.sort').on('click', function() {
  let $selection = ($(this).text()).toLowerCase();
  // Image.sortBy(Image.allImages, $selection);
  Image.sortBy($selection);
  Image.loadImages();
});

$(() => {
  Image.getJsonData('data/page-1.json');
});
