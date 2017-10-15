$(document).on("click","#scrape",function(){
	$.get("/scrape", function(){
		$.get("/", function(){

		});
	});
});

$(document).on("click","li",function(){
	$("#titleInput, #bodyInput").val("");
	var thisId = $(this).attr("data-id");
	$("#saveNote").attr("data-id", thisId);


	$.get("/articles/"+thisId, function(data){
		$("#articleTitle").html(data.title);
		if (data.note){
			$("#titleInput").val(data.note.title);
			$("#bodyInput").val(data.note.body);
		}
	});
});

$(document).on("click","#saveNote",function(){
	var thisId=$(this).attr("data-id");
	var newNote = {
		title: $("#titleInput").val().trim(),
		body: $("#bodyInput").val().trim()
	}
	$.post("/articles/"+thisId, newNote, function(data){
		console.log(data);
	});
});