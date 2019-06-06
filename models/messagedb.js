
//default schema for Machine platform
const uuidv4 =    require('uuid/v4');
const message =   require('./message')
const mongoose =  require('mongoose')
  
const Schema = mongoose.Schema;

// create a schema
const msgSchema = new Schema({
    MsgId: String,
    OwnerId: String,
    PlatformId: String,
    TemplateId: String,
    Experiences: Array,
    Configs: Array,
    Channels: Array,
    Content: Array,  
    ApiVersion: String,
    Ip: String,    
    Token: String    
  });

// middleware -----
// set defaults
eventSchema.pre('save', function(next) {
  this.MsgId = genId();
  this.OwnerId = genId()
  this.PlatformId = genId()
  this.TemplateId = genId()
  this.ApiVersion = 'v1'
  this.Ip = "127.0.0..0"
  this.Token = genId()
  next();
});

// create the model
const msgModel = mongoose.model('Message', msgSchema);

// export the model
module.exports = msgModel;

function genId() {
    return uuidv4()
}

/*
// function to slugify a name
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}
*/