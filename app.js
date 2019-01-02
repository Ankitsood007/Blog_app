var express=require("express");
var app=express();
var bodyparser=require("body-parser");
var mongoose=require("mongoose");
var methodOverride=require("method-override")
mongoose.connect("mongodb://localhost/restfull_blog_app");


app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({ 
	title: String,
	image: String,
	body : String,
	created : {type: Date,default :Date.now}
})

var Blog = mongoose.model("Blog", blogSchema);

//routes ///

app.get("/",function(req,res){
	res.redirect("/blogs");
})

///home route to show all the existing blogs

app.get("/blogs",function(req,res){
   
   Blog.find({},function(err,blogs){
   	if(err){
   		console.log("error!")
   	}
   	else
   	{
   		 res.render("index",{blogs : blogs});
   	}
   })
});

///route to read the content of a new blog through a form rendered in new.ejs template..

app.get("/blogs/new",function(req,res){
	res.render("new");
})

///route to create new blog

app.post("/blogs",function(req,res){
	Blog.create(req.body.blog,function(err,newblog){
		if(err){
			res.render("new");
		}
		else{
			res.redirect("/blogs")
		}
	});
});

///show route

app.get("/blogs/:id",function(req,res){
  Blog.findById(req.params.id,function(err,foundblog){
       if(err){
        res.redirect("/blogs");
       }
       else{
       	res.render("show",{blog:foundblog});
       }         
	});	
});

///edit route

app.get("/blogs/:id/edit",function(req,res){
     Blog.findById(req.params.id,function(err,foundblog){
     	if(err)
     	{
     		res.redirect("/blogs");
     	}else{
             
             res.render("edit",{blog: foundblog});
     	}
     });
       
});

app.put("/blogs/:id",function(req,res){

Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
	if(err){	
		res.redirect("/blogs");
	}
	else
	{
		res.redirect("/blogs/" + req.params.id);
	}
});
});

///delete route

app.delete("/blogs/:id",function(req,res){
Blog.findByIdAndRemove(req.params.id,function(err){
	if(err){
         res.redirect("/blogs");
	}
	else{
		res.redirect("/blogs");
	}
});
});

app.listen(3000,function(){
	console.log("server has started");
})