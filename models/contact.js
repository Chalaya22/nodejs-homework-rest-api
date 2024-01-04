const { Shcema, model } = require("mongooose");

const contactShcema = new Shcema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  //   favorite: {
  //     type: Boolean,
  //     default: false,
  //   },
});
const Contact = model("contact", contactShcema);

module.exports = Contact;
