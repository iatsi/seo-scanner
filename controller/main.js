let request = require('request');

exports.decodeHTML = async function(req,res){
     try{

        let url = req.query.url;
        console.log(url, req.query);
        let responseObject = await requester(url);

        let htmlLook = responseObject.body;
        let metasTags = getMetas(htmlLook); 
        let metasContentObject = getMetasContentObject(metasTags);
        let title = getPageTitle(htmlLook);
        let headings = getHeadings(htmlLook);

        res.send({request:validifyUrls(url), statusCode:responseObject.response.statusCode, metasTags, metasContentObject, title, headings});
        // res.send(responseObject.body)
     }
     catch(e){
         console.log(e);
         res.json({error:e});
     }
}


exports.landingPage = async function(req,res){
    let content = ` <html><body>  
       <p style="text-align:center; font-size:25px">Thank you! I hope you find a correct <b>path</b></p> .

    </body></html>`
    res.send(content);
}

function validifyUrls(url = ''){
    return url.split(' ').join('+');
}

function requester(url){
  url = validifyUrls(url); 
  console.log('url',url)
  return new Promise(function(resolve,reject){
    request(url,function(err,response,body){
        if(err){
            resolve(err);
        } else {
            resolve({response,body});
        }
        
    })
 
  })
}

function getMetas(body){
    let toParse = body;
    var metas = (toParse.match(/<meta(.*?)>/g)).map(element => element);
    console.log('Metas',metas);
    return metas;
}

function getMetasContentObject(body){
    let metasWithNameObject = {};
    let metasWithPropertyObject = {};
    let toParse = body;
    var metas = (toParse.map(element => element.match(/([\w\-.:]+)\s*=\s*("[^"]*"|'[^']*'|[\w\-.:]+)/g)));
    metas = metas.filter(element => (Array.isArray(element) && element.length > 1));
    metas.forEach(element => {
        if(element[0].startsWith('name=')){
            metasWithNameObject[element[0].replace('name=','').replace(/"|'/g,"")] = element[1].replace('content=','').replace(/"|'/g,"");
        }
        if(element[1].startsWith('name=')){
            metasWithNameObject[element[1].replace('name=','').replace(/"|'/g,"")] = element[0].replace('content=','').replace(/"|'/g,"");
        }

    });

    metas.forEach(element => {
        if(element[0].startsWith('property=')){
            metasWithPropertyObject[element[0].replace('property=','').replace(/"|'/g,"")] = element[1].replace('content=','').replace(/"|'/g,"");
        }
    });
    
    console.log('Metas Content Objects',metasWithNameObject);
    // metas contains meta arrays
    return {  metasWithNameObject, metasWithPropertyObject } ;
}

function getPageTitle(body){
    let toParse = body;
    var title = (toParse.match(/<title(.*?)<\/title>/g) ? toParse.match(/<title(.*?)<\/title>/g) : []).map(element => element.replace(/<title(.*?)>|<\/title>|'|"/g,''));
    console.log('Titles',title);
    return title;
}

function getHeadings(body){
    //       Original Regex
    //       /<h[0-9]+(.*?)(>\s*(?=[a-zA-Z"']))|<\/(.*?)>/g
    let toParse = body;
    let h1s = ((toParse.match(/<h1(.*?)<\/h1>/g))?(toParse.match(/<h1(.*?)<\/h1>/g)):[]).map(element => element.replace(/<h1(.*?)(>\s*(?=[a-zA-Z"'0-9]))|<\/(.*?)>|<[a-zA-Z]*(.*?)>/g,''));
    let h2s = ((toParse.match(/<h2(.*?)<\/h2>/g))?(toParse.match(/<h2(.*?)<\/h2>/g)):[]).map(element => element.replace(/<h2(.*?)(>\s*(?=[a-zA-Z"'0-9]))|<\/(.*?)>|<[a-zA-Z]*(.*?)>/g,''));
    let h3s = ((toParse.match(/<h3(.*?)<\/h3>/g))?(toParse.match(/<h3(.*?)<\/h3>/g)):[]).map(element => element.replace(/<h3(.*?)(>\s*(?=[a-zA-Z"'0-9]))|<\/(.*?)>|<[a-zA-Z]*(.*?)>/g,''));
    let h4s = ((toParse.match(/<h4(.*?)<\/h4>/g))?(toParse.match(/<h4(.*?)<\/h4>/g)):[]).map(element => element.replace(/<h4(.*?)(>\s*(?=[a-zA-Z"'0-9]))|<\/(.*?)>|<[a-zA-Z]*(.*?)>/g,''));
    let h5s = ((toParse.match(/<h5(.*?)<\/h5>/g))?(toParse.match(/<h5(.*?)<\/h5>/g)):[]).map(element => element.replace(/<h5(.*?)(>\s*(?=[a-zA-Z"'0-9]))|<\/(.*?)>|<[a-zA-Z]*(.*?)>/g,''));
    let h6s = ((toParse.match(/<h6(.*?)<\/h6>/g))?(toParse.match(/<h6(.*?)<\/h6>/g)):[]).map(element => element.replace(/<h6(.*?)(>\s*(?=[a-zA-Z"'0-9]))|<\/(.*?)>|<[a-zA-Z]*(.*?)>/g,''));

    // console.log('headings',headings);
    return {h1s,h2s,h3s,h4s,h5s,h6s};
}