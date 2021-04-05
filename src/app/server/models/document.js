
var mongoose
= require('mongoose');

const documentScema = mongoose.Schema({
  id: {type: String, required: true},
  name: {type: String, required: true},
  description: {type: String, required: true },
  url: { type: String, required: true},
  children: [{type: mongoose.Schema.Types.ObjectId, ref: 'Document'}]

});
module.exports = mongoose.model('Document', documentScema);
