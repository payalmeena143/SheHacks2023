var express = require('express');
var router = express.Router();
const path = require('path');
var brand= require('../models/brandsdb');
var review= require('../models/reviews');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/company', function(req, res, next) {
  res.render('company');
});

router.get('/brands', async(req, res)=> {
  let menuresult= await brand.find({}).sort({rating:-1}).then((menudata)=>{
    res.render('brands',{data:menudata,search:''});
  });
});

router.post('/searching',async(req,res)=>{
  let q=req.body.searchInput;
  let menudata=null;
  let qry={"$or":[
    {itemtype:{$regex:'^'+q,$options:'i'}},
    {name:{$regex:'^'+q,$options:'i'}}]
  };
  if(q!=null){
    let menuresult = await brand.find(qry).sort({rating:-1}).then((docs)=>{
      menudata=docs;
    });
  }else{
    q='Search';
    let menuresult = await brand.find({}).sort({rating:-1}).then((docs)=>{
      menudata=docs;
    });
  }
  res.render('brands',{data:menudata,search:q});
});

/*router.get('/comments/:id',async(req,res)=>{
  let brandid=req.params.id;
  let qry={_id:brandid};
  let menuresult= await review.find({brand:brandid}).then(async(menudata)=>{
    let brandresult = await brand.findOne(qry).then((item)=>{
      res.render('comments',{data:menudata,brand:item});
    });    
  });
});

router.post('/putcomment/:id',async(req,res)=>{
  let commname = req.body.menuName;
  let comments = req.body.menuIcon;
  let brandid=req.params.id;
  let newMenu = new review({
    user: commname,
    comment:comments,
    brand: brandid
  });

  let saveMenu = await newMenu.save();
  let qry={_id:brandid};
  let menuresult= await review.find({brand:brandid}).then(async(menudata)=>{
    let brandresult = await brand.findOne(qry).then((item)=>{
      res.render('comments',{data:menudata,brand:item});
    });    
  });
});*/

router.get('/comments/:name&:id',async(req,res)=>{
  let br=req.params.name;
  let brands={
    $regex:br
  };
  let brandid=req.params.id;
  let qry={_id:brandid};
  let menuresult= await review.find({brand:brands}).then(async(menudata)=>{
    let brandresult = await brand.findOne(qry).then((item)=>{
      res.render('comments',{data:menudata,brand:item});
    });    
  });
});

router.post('/putcomment/:brand&:id',async(req,res)=>{
  let commname = req.body.menuName;
  let comments = req.body.menuIcon;
  let brands=req.params.brand;
  let rating=req.body.rating;
  let newMenu = new review({
    user: commname,
    comment:comments,
    brand: brands
  });

  let saveMenu = await newMenu.save();
  let brurl={
    $regex:brands
  };
  let brandid=req.params.id;
  let qry={_id:brandid};
  if(rating==='YES'||rating==='yes'||rating==='Yes'){
  let updaterate = await brand.findOneAndUpdate(
    {_id:brandid},
    {$inc:{rating:1}},
  );
  }

  let menuresult= await review.find({brand:brurl}).then(async(menudata)=>{
    let brandresult = await brand.findOne(qry).then((item)=>{
      res.render('comments',{data:menudata,brand:item});
    });    
  });
});

router.post('/joincompany',async(req,res)=>{
  let name = req.body.name;
  let desc = req.body.description;
  let url = req.body.url;
  let itemtype = req.body.itemtype;
  let img=req.body.image;
  let qry = {name:name};
  let searchResults = await brand.findOne(qry).then( async(userData) => {
      if (!userData) {
          // ok to add menu
          let newbrand = new brand({
              name: name,
              description: desc,
              url: url,
              itemtype:itemtype,
              status:img,
              rating:0
          });

          let saveMenu = await newbrand.save();
      }
  });
  res.redirect('/');
});


module.exports = router;
