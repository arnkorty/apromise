'use strict';

var aPromise = function (callback) {
  this.state = 'pending';
  var that = this;
  this.id = Math.random();
  try {
    callback.call(that, function() {
      that.resolve(arguments);
    }, function(){
      that.rejected(arguments);
    })
  } catch (e) {
    that.rejected(e);
  }
  return that;
};
aPromise.resolve = function() {
  return new aPromise(function(resolve){
    resolve()
  })
}
aPromise.rejected = function() {
  return new aPromise(function(_, rejected){
    rejected()
  })
}
aPromise.prototype.queue = []
aPromise.prototype.then = function(resolve, rejected) {
  this.queue.push({fn: resolve, type: 'resolve'});
  if (rejected) {
    this.queue.push({fn: rejected, type: 'rejected'})
  }
  this.process();
  return this;
}
aPromise.prototype.catch = function(rejected) {
  this.queue.push({fn: rejected, type: 'rejected'})
  this.process();
  return this;
}
aPromise.prototype.args = [];

aPromise.prototype.process = function(rejected) {
  var callback;
  while (this.state !== 'pending' && this.queue.length > 0) {
    callback = this.queue.shift();
    try{
      if (callback.type === this.state){
        if (this.state === 'rejected') this.state = 'resolve';
        this.args = [callback.fn.apply(this, this.args)];
      }
    } catch(e) {
      this.args = [e];
      this.state = 'rejected';
      this.process();
    }
  }
  
  return this;
}
aPromise.prototype.resolve = function() {
  this.state = 'resolve';
  this.args = arguments;
  this.process();
  return this;
}
aPromise.prototype.rejected = function() {
  this.state = 'rejected';
  this.args = arguments;
  this.process();
  return this;
}

// test
function testTimeout (tm) {
  new aPromise(function(resolve){
    setTimeout(resolve, tm);
    console.log("a promise time start at:" + new Date());
  }).then(function(){
    console.log("a promise time then at: " + new Date());
  });
  console.log("sync time at:" + new Date());
}
function testRejct () {
  new aPromise(function(resolve) {
   throw new Error('try error');
  }).then(function() {
    console.log('no execute');
  }).catch(function(e) {
    console.log('execute catch promise');
    return 'run catch success';
  }).then(function(msg) {
    console.log('catch sucess then ' + msg);
  })
}
