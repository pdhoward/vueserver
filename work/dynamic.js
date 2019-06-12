// dynamic rendering of paths in express
// content driven

pagesfromdb = {
    home = {
        paths = ['/','/home','/koti'],
        render = 'home.ejs',
        fi_FI = {html='<h1>Hei maailma!</h1>'},
        en_US = {html='<h1>Hello World!</h1>'}
    },
    about = {
        paths = ['/about','/tietoja'],
        render = 'general.ejs',
        fi_FI = {html='Tietoja'},
        en_US = {html='About Us'}
    }
}

// alternative 1 create routes when server starts
Object.keys(pagesfromdb).forEach(function(key) {
    var page = pagesfromdb[key];
    app.get(page.global.paths,function(req, res){
         res.render(page.render, page[language]);
    });
});

// alternative 2 - look up routes on every http call
app.get('/*', function (req, res) {
   db.findPage({ slug: req.url}, function (err, pageData) {
       res.render('page-template', {
           pageContent: pageData.content,
           pageTitle: pageData.title
       });
   });
});


