// create a new collection with a new books model already inside
var booksCollection = Collection(
  Model({ title: 'Harry Potter', author: 'J.K. Rowling', imageURL: 'https://books.google.com/books/content?id=WV8pZj_oNBwC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', isbn: '9781921479311', pageCount: 268 })
);

// when a book is added to the collection, render the books
booksCollection.change(function () {
  renderBooks();
});

var fetch = function (query) {
  var baseUrl = 'https://www.googleapis.com/books/v1/volumes?q=';

  var searchUrl = baseUrl + query;

  $.ajax({
    method: "GET",
    url: searchUrl,
    dataType: "json",
    success: function(data) {
      addBooks(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var addBooks = function (data) {
  // reset the books collection to empty
  booksCollection.reset()

  for (var i = 0; i < data.items.length; i++) {
    var bookData = data.items[i];

    var author = function () {
      if (bookData.volumeInfo.authors) {
        return bookData.volumeInfo.authors[0];
      } else {
        return null;
      }
    };

    var imageURL = function () {
      if (bookData.volumeInfo.imageLinks) {
        return bookData.volumeInfo.imageLinks.thumbnail;
      } else {
        return null;
      }
    };

    var isbn = function () {
      if (bookData.volumeInfo.industryIdentifiers) {
        return bookData.volumeInfo.industryIdentifiers[0].identifier;
      } else {
        return null;
      }
    };

    var pageCount = function () {
      if (bookData.volumeInfo.pageCount) {
        return bookData.volumeInfo.pageCount;
      } else {
        return null;
      }
    };

    var title = function () {
      if (bookData.volumeInfo.title) {
        return bookData.volumeInfo.title;
      } else {
        return null;
      }
    };

    var bookModel = Model({
      title: title(),
      author: author(),
      imageURL: imageURL(),
      pageCount: pageCount(),
      isbn: isbn()
    });

    booksCollection.add(bookModel);
  }
};


var renderBooks = function () {
  $('.books').empty();

  var models = booksCollection.getModels();

  for (var i = 0; i < models.length; i++) {
    var source = $('#book-template').html();
    var template = Handlebars.compile(source);

    var book = {
      title: models[i].get('title'),
      author: models[i].get('author'),
      pageCount: models[i].get('pageCount'),
      isbn: models[i].get('isbn'),
      imageURL: models[i].get('imageURL')
    };

    var bookHTML = template(book);

    $('.books').append(bookHTML);
  }
}

$('.search').on('click', function () {
  var search = $('#search-query').val();

  fetch(search);
});

renderBooks();
