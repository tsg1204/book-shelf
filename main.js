let ProjectBookShelf = function() {
	let books = Collection();

	let $books = $('.books');

	let renderBooks = function() {

		$books.empty();

		for(let i = 0; i < books.models.length; i++) {
			let bookModel = books.models[i];
			//console.log(bookModel);

			let bookTemplate = Handlebars.compile($('#book-template').html());
			let bookView = View(bookModel, bookTemplate);
			$books.append(bookView.render());
		}
	}

	let getBooks = function(result) {	
		for(let i = 0; i < result.items.length; i++) {
			let bookObj = {
				title: '',
				authors: [],
				pageCount: 0,
				isbn: '',
				imageURL: ''
			};

			bookObj.title = result.items[i].volumeInfo.title;
			bookObj.authors = result.items[i].volumeInfo.authors.length > 1 ? Array.from(result.items[i].volumeInfo.authors) : result.items[i].volumeInfo.authors[0];
			bookObj.pageCount = result.items[i].volumeInfo.pageCount;
			bookObj.isbn = result.items[i].volumeInfo.industryIdentifiers ? result.items[i].volumeInfo.industryIdentifiers[1].identifier : '';
			bookObj.imageURL = result.items[i].volumeInfo.imageLinks.smallThumbnail;
			//
			let modelObj = Model(bookObj);
			books.add(modelObj);
		}
		//console.log(books.models);
		return books.models;
	}

	return {
		books: books,
		renderBooks: renderBooks,
		getBooks: getBooks
	}
}

let app = ProjectBookShelf();

//use async await with fetch()
const fetchBooks = async(query) => {
	const res = await fetch(
	    'https://www.googleapis.com/books/v1/volumes?q='+query+"'"
	  );
	const json = await res.json();

  	console.log(json);
	app.getBooks(json);
	app.renderBooks();
}

// let fetch = function (query) {
//   $.ajax({
//     method: "GET",
//     url: "https://www.googleapis.com/books/v1/volumes?q="+query+'"',
//     dataType: "json",
//     success: function(data) {
//       //console.log(data);

//       app.getBooks(data);
//       app.renderBooks();
//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//       console.log(textStatus);
//     }
//   });
// };

$('.search').on('click', function () {
  let search = $('#search-query').val();

  fetchBooks(search);
});
