//New FrameWork For DP Portal

var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var pagination = require('pagination');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());




app.enable('view cache');

app.set('partials',{header:"header",footer:"footer",leftnav:"leftnav"});	
app.set('views', __dirname + '/public/templates');
app.set('view engine','hjs');

app.engine('hjs', require('hogan-express'));


app.use(express.static(__dirname + '/public'));

//base

app.all('/',function(req, res, next) {
	console.log('Loading Front Page');	
	res.render('front');
	
});
app.all('/BD',function(req, res, next) {
	console.log('Loading Front Page');	
	//res.ghfasghfh();
	res.render('businessdevelopment');
	
	
});

app.all('/listServices/serviceId/:serviceid/categoryId/:categoryid',function(req, res, next) {
	console.log('all Category page');	
	//res.ghfasghfh();
	
	var serviceid=req.params.serviceid;
	var categoryid=req.params.categoryid;
	console.log('Service Id'+serviceid+' AND category ID'+categoryid);
	
	res.locals = {
			name: 'Andrew',
			"serviceId":serviceid,
			"categoryId":categoryid
	};
	//Do the processing to assign html data for the links
	res.render('showAllDocTypes');
});



//Coding all paths here

var connection=require('./model/dbConnection');
var configuration=require('./configs/config')();
var dateFormat = require('dateformat');

console.log('The Configuration');
console.log(configuration);

app.all('/listDocuments/serviceId/:serviceid/categoryId/:categoryid/docTypeId/:docTypeId',function(req, res, next) {
	console.log('Showing Paginated Docs');	
	//res.ghfasghfh();
	
	var serviceid=req.params.serviceid;
	var categoryid=req.params.categoryid;
	var docTypeId=req.params.docTypeId
	console.log('Service Id'+serviceid+' AND category ID'+categoryid);
	
	var pageSelected=req.query.page;
	
	
	
	var startPoint= pageSelected-1;
	var LimitEnd= pageSelected*configuration.paginationCount;
	
	var LimitStart=startPoint*configuration.paginationCount;
	
	console.log('start Point'+LimitStart+'End Point'+LimitEnd);
	
	
	//For pagination Firts get the count
	 var Query='select count(id) as count from document where '
	 
	  Query=Query+' service_id ='+serviceid+' AND category_id='+categoryid+' AND doc_type_id = '+docTypeId;
	 
   
   

    console.log( Query);

    // connection.connect();
    var query = connection.query( Query, function(err, result) {
        // Neat!
        if(err)
        {
			//Log error
           	//Force Error
			res.XYZ();
		}
        else
        {
		console.log(result[0].count);		
           var paginator = new pagination.SearchPaginator({prelink:'/listDocuments/'+serviceid+'/categoryid/'+categoryid+'/docTypeId/'+docTypeId+'', current:pageSelected , rowsPerPage: configuration.paginationCount, totalResult: result[0].count});
			console.log(paginator.render());
			//For pagination Firts get the count
			var QueryGetAllDocuments='select filename,type, concat(fname," ",lname) as name,d.created_date from document d join file_type_master fm  on fm.id= d.extn  join user u on u.u_id= d.created_by where '
			var QueryGetAllDocuments='select filename,type, concat(fname," ",lname) as name,d.created_date from document d join file_type_master fm  on fm.id= d.extn  join user u on u.u_id= d.created_by where '
	 
	  QueryGetAllDocuments=QueryGetAllDocuments+' service_id ='+serviceid+' AND category_id='+categoryid+' AND doc_type_id = '+docTypeId+' order by d.id desc LIMIT '+LimitStart+','+configuration.paginationCount;
			var query = connection.query( QueryGetAllDocuments, function(err,data) {
				  if(err)
				  {
						//Log error
						//Force Error
						//res.XYZ();
					}
					else
					{
						
							//Forming the result array...
						
							
							
						
						
						
						var DisplayData='';
						var howMany=1;
						
						//Get the Doc type
						var docType='CASE STUDIES';
						DisplayData=DisplayData+'<div class="row"><div class="col-sm-12 col-md-12">	<h3 class="subheader">'+docType+'</h3></div></div><div class="row"><div class="col-sm-12 col-md-12"><!-- Spacer --></div></div>';
		
						for(i=0;i<data.length;i++)
						{
								//Have to display 3 rows at a time
							   
							    if(howMany==1)
								{
									console.log('In here');
									DisplayData=DisplayData+'<div class="row">'	;
									
								}
								console.log(data[i]);
								if(howMany<=4)
								{
									//var uploadeddate=dateFormat(data[i].created_date, "yyyy-mm-dd h:MM:ss");
									var uploadeddate=dateFormat(data[i].created_date, "dS, mmmm  yyyy");
									DisplayData=DisplayData+'<div class="col-sm-3 col-md-3"><div class="thumbnail"><a href="/downloads/'+data[i].filename+'"><img src="/images/'+data[i].type+'.jpg" alt="Download Doc"></a><div class="caption"><p>Uploaded By:</p><p>'+data[i].name+' On '+uploadeddate+'</p><p><a href="/downloads/'+data[i].filename+'"  class="btn btn-primary" role="button">Download</a> </p></div></div></div>';
									if(howMany==4)
									{
										howMany=1;
										DisplayData=DisplayData+'</div>';
									}
									else{
										howMany=howMany+1;
									}
								}
								
								
							
							
						}
						
						//if if how many was not reset this means that the data was not proper
						if(howMany!=1)
							//DisplayData=DisplayData+'</div>';
				
						
						//If pagination and all.. End 2:30
						DisplayData=DisplayData+'<div class="row"><div class="col-sm-12 col-md-12"><!-- Spacer --></div></div>';
						
						if(result[0].count>configuration.paginationCount)
					{
						var pagedata=paginator.render();
						DisplayData=DisplayData+'<div class="row"><div class="col-sm-12 col-md-12"><div style="text-align:center;">'+pagedata+'</div></div></div>';
					}
  
			 	DisplayData=DisplayData+'<div class="row"><div class="col-sm-12 col-md-12"><!-- Spacer --></div></div>';
				DisplayData=DisplayData+'<div class="row"><div class="col-sm-12 col-md-12"><!-- Spacer --></div></div>';
  

  
  
//DisplayData=DisplayData+'</div></div></div></div>';
						
						
						
						
						console.log(DisplayData);
						
						
						
						//Creating Pagination
							console.log(data);
							res.locals = {
									"DisplayData":DisplayData,
							};
							//Do the processing to assign html data for the links
							res.render('listDocuments');
											}
				
			});
	 
   


        }
        console.log(query.sql);

    });
	
	
	
	

});




// Handle 404
 app.use(function(req, res) {
     res.status(400);
     console.log('Loading 404');	
	res.render('fof');
  });
  
  // Handle 500
  app.use(function(error, req, res, next) {
      res.status(400);
     console.log('Loading 404');	
	res.render('err');
  });



/*var routers = require('./server/routes/routes');
routers.set(app);*/


//Defining Home... // 404 and 500
var port = process.env.PORT || 8080;        // set our port


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);