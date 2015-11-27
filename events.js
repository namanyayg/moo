$(function() {

  $('.guess-computer').on('click', function() {
    $('.main-menu').slideUp();
    $('.guesses-computer').slideDown();
  })

  $('.guess-you').on('click', function() {
    $('.main-menu').slideUp();
    $('.guesses-you').slideDown();
  })

  $('.computer-guess-number').on('submit', function(e) {
    e.preventDefault();
    var val = parseFloat($('.computer-guess-number input[type="text"]').val().substr(0, 3));
    var $output = $('.guesses-computer__result');
    $output.html('');
    console.log(val);



    if ( isNaN(val) || allUniques.indexOf(val.toString()) == -1 ) {
      $output.text("Please enter a valid number")
      return false;
    }

    var num = strNumToArray(val.toString());

    playSingle(num, false, true, $output)


    return false
  })

  var ansStr = allUniques[Math.floor(Math.random()*allUniques.length)];
  var ans = strNumToArray(ansStr);

  $('.you-guess-number').on('submit', function(e) {
    e.preventDefault();
    var val = parseFloat($('.you-guess-number input[type="text"]').val().substr(0, 3));
    var $output = $('.guess-you__result');
    var showPruned = $('.you-guess-number input[type="checkbox"]').is(':checked');
    var qset = allUniques.slice();

    $output.html('');

    if ( isNaN(val) || allUniques.indexOf(val.toString()) == -1 ) {
      $output.text("Please enter a valid guess")
      return false;
    }

    if ( val == ansStr ) {
      $output.text('You got it!');
      return false;
    }

    var num = strNumToArray(val.toString());
    qset = pruneSet(qset, num, ans, false, true, $output);

    if ( showPruned )
      $output.append('<div class="pruned">' + qset.join(' ') + '</div>');
    return false
  })

});