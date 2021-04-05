var mongoose
= require('mongoose');

const messageScema = mongoose.Schema({
  id: {type: String, required: true},
  subject: {type: String, required: true},
  msgText: {type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact'}
});
module.exports = mongoose.model('Message', messageScema);
