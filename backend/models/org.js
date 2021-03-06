const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrgSchema = new Schema({
  chatRoomID: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  leader: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    username: String
  },
  creationDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  admins: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }
  ],
  members: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String,
      dues: {
        type:Number,
        default:0
      }
    }
  ],
  description: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Purdue_Boilermakers_logo.svg/1200px-Purdue_Boilermakers_logo.svg.png"
  },
  primaryAudience: {
    type: String,
    default: 'Undergraduate'
  },
  tags: String,
  events: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
      },
      name: String,
      desc: String
    }
  ]
});

const Org = (module.exports = mongoose.model("Org", OrgSchema));
