Animations = new Mongo.Collection("Animations");

Animations.allow({
  insert: function (userId, animation) {
    console.log("check ", userId, animation.owner);
    return userId && animation.owner === userId;
  },
  update: function (userId, animation, fields, modifier) {
    if (userId !== animation.owner && animation._id !== 'MdhAgAZ68DJ6JNJrC')
      return false;

    return true;
  },
  remove: function (userId, animation) {
    if (userId !== animation.owner)
      return false;

    return true;
  }
});


random_animation = function () {
  this.frames = [];
  this.name = "RAND" + Math.random();
  for (var j = 0; j < 7; j++) {
    this.frames.push(new empty_frame());
    for (var i = 0; i < 64; i++) {
      this.frames[j].pixels.push({value: Math.floor((Math.random() * 10)) % 2});
    }
  }
};

empty_frame = function () {
  this.duration = 500;
  this.pixels = [];
}

empty_animation = function () {
  this.frames = [];
  this.name = "Untitled Animation";
  this.public = true;
  for (var j = 0; j < 7; j++) {
    this.frames.push(new empty_frame());
      for (var i = 0; i < 64; i++) {
      this.frames[j].pixels.push({value: 0});
    }
  }
}