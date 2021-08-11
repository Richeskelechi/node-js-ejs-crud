const express = require('express');
const mongoose = require('mongoose');
const Item = require('./models/items');
const currencyFormatter = require('currency-formatter');
const app = express();
app.use(express.urlencoded({extended:true}));
const mongodb = 'mongodb+srv://riches22:biro123save@cluster0.41mur.mongodb.net/item-database?retryWrites=true&w=majority';
mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Database Connected'),
        app.listen(3005, (()=>{
            console.log('http://localhost:3005');
        })))
        .catch(err => console.log(err));
app.set('view engine', 'ejs');

app.get('/', ((req, res)=>{
    Item.find().then(result =>{
        res.render('index', { name:'Riches Website', record:result, page:'Home Page', currencyFormatter });
    }).catch(err => console.log(err))
}));

app.get('/add-item', ((req, res)=>{
    res.render('addItem', { name:'Riches Website', page:'Add Item Page' });
}));

app.get('/one-item/:id', (req, res) =>{
    const id = req.params.id
    Item.findById(id).then(result => {
        res.render('details', {item:result,  name:'Riches Website', page:'Single Item Page', currencyFormatter})
    }).catch(err => console.log('Item Not Found'))
});
app.get('/delete/:id', (req, res) =>{
    const id = req.params.id
    Item.findByIdAndDelete(id).then(() => {
        res.redirect('/');
    }).catch(err => console.log('Item Not Found'))
});

app.put('/items/:id', (req, res) =>{
    const id = req.params.id
    Item.findByIdAndUpdate(id, req.body).then(result => {
        res.json({msg:'Item Updated Successfully'})
    }).catch(err => console.log('Item Not Found'))
});

app.post('/items', ((req, res) =>{
    const item = new Item({
        name:req.body.name,
        price:req.body.price
    });
    item.save().then(() => {
        res.redirect('/');
    }).catch(err=>console.log(err));
}));

app.use((req,res) =>{
    res.render('404', { name:'Riches Website', page:'404 Page' });
});
