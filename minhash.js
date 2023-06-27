'use strict';


var Minhash = function() {

  
  this.prime = 4294967311;
  this.seed = 7;
  this.number_of_permutations = 128;
  this.max_hash_value = Math.pow(2, 32) - 1;     
  this.hashes = [];
  this.permutationX = [];
  this.permutationY = [];

  this.simple_random = function() {
    var x = Math.sin(this.seed++) * this.max_hash_value;
    return Math.floor((x - Math.floor(x)) * this.max_hash_value);
  }

  this.init_hashes = function() {
    for (var i=0; i<this.number_of_permutations; i++) {
      this.hashes.push(this.max_hash_value);
    }
  }

  this.init_permutations = function() {
    var used = {};
    for (var i=0; i<2; i++) {
      var perms = [];
      for (var j=0; j<this.number_of_permutations; j++) {
        var int = this.simple_random();
        while (used[int]) int = this.simple_random();
        perms.push(int);
        used[int] = true;
      }
      var key = ['permutationX', 'permutationY'][i];
      this[key] = perms;
    }
  }

  this.hash = function(str) {
    var hash = 0;
    if (str.length == 0) {
      return hash + this.max_hash_value;
    }
    for (var i = 0; i < str.length; i++) {
      var char = str.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash; 
    }
    return hash + this.max_hash_value;
  }

  this.update = function(str) {
    for (var i=0; i<this.hashes.length; i++) {
      var permutation_x = this.permutationX[i];
      var permutation_y = this.permutationY[i];
      var hash = (permutation_x * this.hash(str) + permutation_y) % this.prime;
      if (hash < this.hashes[i]) {
        this.hashes[i] = hash;
      }
    }
  }

  this.distance = function(other) {
    if (this.hashes.length != other.hashes.length) {
      throw new Error('length of sets is not the same!');
    } else if (this.seed != other.seed) {
      throw new Error('seeeds of sets is not the same!');
    }
    var shared = 0;
    for (var i=0; i<this.hashes.length; i++) {
      shared += this.hashes[i] == other.hashes[i];
    }
    return shared / this.hashes.length;
  }

  this.init_hashes();
  this.init_permutations();
};

if (typeof window !== 'undefined') window.Minhash = Minhash;

// if (typeof exports !== 'undefined') {
//   if (typeof module !== 'undefined' && module.exports) {
//     exports = module.exports = Minhash;
//   }
//   exports = Minhash;
// }