// All numbers to be stored as arrays, shown as numbers.
// Represent as position:number

var N = 3;

function genAll (n) {
  var set = [];
  var max = parseFloat(new Array(n+1).join('9'));
  var num;
  var isUnique;
  for ( var i = 0; i <= max; i++ ) {
    num = ('0000000000' + i).slice(-n);
    isUnique = true;
    for ( var j = 0; j < n-1; j++ ) {
      for ( var k = j+1; k < n; k++ ) {
        if ( num[j] == num[k] ) isUnique = false;
      }
    }
    if ( isUnique )
      set.push(num);
  }

  return set;
}

function searchInHash (hash, pos, val) {
  var hashLen = hash.length;
  for ( var i = 0; i < hashLen; i++ )  
    if ( hash[i].pos == pos && hash[i].val == val )
      return hash[i]

  return undefined;
}

function getHashTable (s) {
  var hash = [];
  s.forEach(function(num) {
    for ( var i = 0; i < 3; i++ ) {
      // { pos: i, val: num[i], count: 0 }
      var res = searchInHash(hash, i, num[i])
      if ( res ) res.count++
      else hash.push({ pos: i, val: num[i], count: 1 })
    }
  });

  hash.sort(function(a, b) {
    if ( a.count > b.count ) return 1
    if ( a.count < b.count ) return -1
    return 0;
  })

  return hash;
}

function printHash (hash) {
  var res = '';
  hash.forEach(function(h) {
    res += JSON.stringify(h) + '\n';
  })
  console.log(res);
}

function makeGuess (s, repeats) {
  if ( s.length == 1 )
    return s;

  if ( s.length < 100 ) {
    var uniq = findUniqueGuess(s)
    if ( uniq && uniq.length ) {
      return uniq[0];
    }
  }

  var sortedHash = getHashTable(s);
  var num = [];

  var i = 0;
  if ( repeats ) i++;

  while ( num.length !== N ) {
    if ( num.indexOf(sortedHash[i].val) == -1 )
      num.push(sortedHash[i].val)
    i++;
  }

  return num;
}


function respondToNum(num, guess) {
  var response = { bulls: 0, cows: 0 };
  guess.forEach(function(dig, i) {
    dig = parseFloat(dig)
    if ( num.indexOf(dig) !== -1 ) {
      if ( num.indexOf(dig) == i )
        response.bulls++
      else 
        response.cows++
    }
  });

  return response;
}

function pruneSet(set, guess, ans, debug) {
  var response = respondToNum(ans, guess);
  if ( debug ) console.log(response);
  var pruned = [];
  set.forEach(function(num, pos) {
    var numRes = respondToNum(num, guess)
    if ( numRes.bulls == response.bulls && numRes.cows == response.cows ) {
      pruned.push(num)
    }
  });
  return pruned;
}

function findUniqueGuess (set) {
  if ( set.length == 0 ) return set[0];

  var responses = [];
  var uniques = [];

  allUniques.forEach(function(number) {
    var num = number.split('');

    set.forEach(function(n) {
      var res = respondToNum(n, num);
      var resStr = 'b' + res.bulls + 'c' + res.cows;
      responses.push(resStr);
    });


    var matches = -responses.length;
    responses.forEach(function(res) {
      responses.forEach(function(r) {
        if ( res == r ) matches++
      });
    })
    if ( matches == 0 ) {
      uniques.push(num);
      return uniques;
    }

    responses = [];
  });
  return uniques;
}

function strNumToArray (number) {
  var num = [];
  number.split('').forEach(function(n) {
    num.push( parseInt(n, 10) )
  });
  return num
}


var allUniques = genAll(N);

function checkAll () {
  var num, times;
  var histogram = {};
  allUniques.forEach(function(number) {
    num = strNumToArray(number);
    times = playSingle(num)

    histogram[times] = histogram[times] ? histogram[times] + 1 : 1;
  })
  console.log(histogram);
}

function playSingle (ans, debug) {
  var set2 = allUniques.slice();
  var playedTimes = 0; // Computer repeats the last guess
  var guess;
  var guesses = [];
  do {
    guess = makeGuess(set2);
    if ( guesses.indexOf(guess.join('')) !== -1 ) {
      console.log(true);
      guess = makeGuess(set2, true);
    }
    guesses.push(guess.join(''));
    if ( debug ) console.log('guess - ', guess.join(''));
    set2 = pruneSet(set2, guess, ans, debug);
    if ( debug ) console.log('set - ', set2.join(' '));
    playedTimes++;
  } while ( ( set2.join('') !== guess.join('') && set2.length ) && playedTimes < 50 )


  console.log(playedTimes + ' guesses for ' + ans.join(''));
  return playedTimes;
}

/*var set1 = allUniques.slice();

set1 = pruneSet(set1, [9, 0], [5, 7], true);
console.log('set - ', set1.join(' '));

set1 = pruneSet(set1, [8, 1], [5, 7], true);
console.log('set - ', set1.join(' '));

set1 = pruneSet(set1, [2, 3], [5, 7], true);
console.log('set - ', set1.join(' '));

set1 = pruneSet(set1, [4, 5], [5, 7], true);
console.log('set - ', set1.join(' '));

set1 = pruneSet(set1, [5, 7], [5, 7], true);
console.log('set - ', set1.join(' '));


console.log();
console.log();
console.log('---');
console.log();*/

// playSingle([0, 2, 6], true)
// checkAll()

// console.log(findUniqueGuess([243, 342, 432, 425, 142, 153]));