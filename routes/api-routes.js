var Article = require("../models/Article.js");
var Note = require("../models/Note.js");
var request = require("request");
var cheerio = require("cheerio");


module.exports = function(app){
	//request to scrape website
	app.get("/", function(req,res){
		Article.find(function(error,results){
			res.render("index", {article: results});
		});
	});

	app.get("/scrape", function(req,res){
		request("https://news.ycombinator.com/", function(error, response, html){
			var $= cheerio.load(html);

			$(".storylink").each(function(i, element){
				var result = {};

				result.title = $(this).text();
				result.link = $(this).attr("href");
				var entry = new Article(result);

				entry.save(function(err, doc){
					if (err) {
						console.log(err);
					}
					else {
						console.log(doc);
					}
				});
			});
		});
		res.send("Scrape Complete");
	});

	// This will get the articles we scraped from the mongoDB
	app.get("/articles", function(req,res){
		Article.find({}, function(error,doc){
			if (error){
				res.send(error);
			}
			else{
				res.send(doc);
			}
		});
	});

	// This will grab an article by it's ObjectId
	app.get("/articles/:id", function(req,res){
		Article.findById(req.params.id)
		.populate("note")
		.exec(function(error,results){
			if (error){
				res.send(error);
			}
			else {
				res.send(results);
			}
		});
	});

	// Create a new note or replace an existing note
	app.post("/articles/:id", function(req, res) {
	 	var newNote = new Note(req.body);
	  	newNote.save(function(error,doc){
		    if (error){
		      res.send(error)
		    }
		    else {
		      Article.findByIdAndUpdate(req.params.id, {note: doc._id}, {new:true}, function(error,newNote){
		          if (error){
		            res.send(error);
		          }
		          else {
		            res.send(newNote);
		          }
		      });
		    }
		});
	});
}