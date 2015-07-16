Meteor.publish("animations", function publishFunction() {
  return Animations.find({
    $or:[
      {$and:[
        {"public": true},
        {"public": {$exists: true}}
      ]},
      {$and:[
        {owner: this.userId},
        {owner: {$exists: true}}
      ]}
    ]});
});

Meteor.methods({
  forkAnimation: function (animationId) {
    // Check argument types
    check(animationId, String);

    if (! this.userId) {
      throw new Meteor.Error("not-logged-in",
          "You must be logged in to fork");
    }
    var forkAnim = Animations.findOne({_id: animationId});

    var cloneAnim = {};
    cloneAnim.frames = [];
    cloneAnim.name = forkAnim.name+" (fork)";
    cloneAnim.public = true;
    for (var j = 0; j < forkAnim.frames.length; j++) {
      cloneAnim.frames.push(forkAnim.frames[j]);
    }
    cloneAnim.owner = this.userId;
    cloneAnim.nickname = Meteor.user().username;
    return Animations.insert(cloneAnim);
  }
});