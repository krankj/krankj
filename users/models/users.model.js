const mongoose = require("../../common/services/mongoose.service").mongoose;

let { Schema } = mongoose;
const opts = { toJSON: { virtuals: true } }; // ensure virtual fields are serialized
let userSchema = new Schema(
  {
    email: String,
    name: String,
    message: String,
  },
  opts
);

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.findById = function (cb) {
  return this.model("Users").find({ id: this.id }, cb);
};

let User = mongoose.model("User", userSchema);

exports.findByEmail = (email) => {
  return User.find({ email: email });
};
exports.findById = (id) => {
  return User.findById(id).then((result) => {
    result = result.toJSON();
    delete result._id;
    delete result.__v;
    return result;
  });
};

exports.createUser = (userData) => {
  const user = new User(userData);
  return user.save();
};

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    User.find()
      .limit(perPage)
      .skip(perPage * page)
      .exec(function (err, users) {
        if (err) {
          reject(err);
        } else {
          resolve(users);
        }
      });
  });
};

exports.patchUser = (id, userData) => {
  return User.findOneAndUpdate(
    {
      _id: id,
    },
    userData
  );
};

exports.removeById = (userId) => {
  return new Promise((resolve, reject) => {
    User.deleteMany({ _id: userId }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
};