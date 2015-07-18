Meteor.startup(function () {
  console.log("Starting up!")
  console.log("Count", Animations.find({}).count());
  //Animations.remove({});
  if (Animations.find({}).count() === 0) {
  //if (Animations.find({}).count() < 25) {
    var baseanimations = [];
    //for (var i = 0; i < 3; i++) {
      baseanimations.push(new random_animation());
    //}
    console.log(baseanimations);
    for (var i = 0; i < baseanimations.length; i++) {
      console.log("inserting " + i);
      Animations.insert({
        _id: "MdhAgAZ68DJ6JNJrC",
        frames: baseanimations[i].frames,
        loop: baseanimations[i].loop,
        name: "Free for all",
        owner: "BwmodBt28MM54Z9Ad",
        nickname: "Demo User",
        public: true
      });
    }
  }
});