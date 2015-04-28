Meteor.startup(function () {
  console.log("Starting up!")
  console.log("Count", Animations.find({}).count());
  //Animations.remove({});
  //if (Animations.find({}).count() === 0) {
  if (Animations.find({}).count() !== 4) {

    var baseanimations = [
      {
        frames: [{
          duration: 500,
          pixels: [
            {value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},
            {value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},
            {value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},
            {value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},
            {value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},
            {value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},
            {value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},
            {value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0},{value: 0}
          ]
        }],
        playing: false,
        activeFrame: 0,
        loop: false,
        name: "Unitled Base Animation"
      }
    ];
    console.log(baseanimations);
    for (var i = 0; i < baseanimations.length; i++) {
      //for (var j = 0, i =0; j < 5; j++) {
      console.log("inserting " + i);
      console.log(baseanimations[i]);
      Animations.insert({
        frames: baseanimations[i].frames,
        playing: baseanimations[i].playing,
        activeFrame: baseanimations[i].activeFrame,
        loop: baseanimations[i].loop,
        name: baseanimations[i].name
      });
    }
  }
});