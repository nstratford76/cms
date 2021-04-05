var mongoose
= require('mongoose');

const sequenceScema = mongoose.Schema({
  maxDocumentId: {type: Number, required: true },
  maxMessageId: {type: Number, required: true},
  maxContactId: {type: Number, required: true}
});
module.exports = mongoose.model('Sequence', sequenceScema);
