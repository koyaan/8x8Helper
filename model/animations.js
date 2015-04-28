Animations = new Mongo.Collection("Animations");

random_animation = function () {
  this.frames = [];
  console.log(this.frames);
  this.playing = false;
  this.activeFrame = 0;
  this.loop = false;
  this.name = "RAND" + Math.random();
  for (var j = 0; j < 23; j++) {
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

}