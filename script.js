
var user;
var $nowDeck;
var $firstDeck;
var $secondDeck;
var choice;
var pause = false;

window.onload = function(){
	user = prompt("Enter name: ");





	//setting the default user's name
	if (user == '')
		user = 'player';
	info = {'username' : user};
	//ajax call to get the information of the deck of cards
	$.ajax({
		method: "POST",
		url: "/memory/intro",
		data: JSON.stringify(info),
		success: displayGame,
		dataType: 'json'
	});
};

//Purpose: oPEN and display game board for user
var displayGame = function(data){
	var currentUser = data[user];
	var currentBoard = currentUser['board'];



	//ensure display of an empty gameboard
	$('#gameboard').empty();

	$board = $("<tr></tr>");


	for (i in currentBoard)
	{

  ///display the board first in empty position


		for (j in currentBoard[i])
		{
			$element = $("<div class='card' data-indexi='"+i+"' data-indexj='"+j+"'></div>");

			$element.click(activeDeck);


			$element.addClass('unmatch');


			$board.append($element);
		}
		$board.append("<br/>")
	}
	$('#gameboard').append($board);
	choice = 0;
};

//Purpose: getting the matching pair of cards
var activeDeck = function(){
	var checkOpen = document.getElementsByClassName('open');

	if (!($(this).hasClass('open')) && !($(this).hasClass('match')) && !pause)
	{
		if (checkOpen.length == 0)
		{
			$firstDeck = $(this);
			$nowDeck = $firstDeck;


			checkMatchingDecks($firstDeck);


			$firstDeck.addClass('open');
			$firstDeck.removeClass('unmatch');
		}
		else
		{

			//if it is the first card to be opened
			if (!$(this).is($firstDeck))
			{
				$secondDeck = $(this);
				$nowDeck = $secondDeck;
				checkMatchingDecks($secondDeck);
				$secondDeck.addClass('open');
				$secondDeck.removeClass('unmatch');
				//deal with unmatch

				if ($secondDeck.find("span").html() === $firstDeck.find("span").html())
				{
			$secondDeck.addClass('match');
			$secondDeck.removeClass('open');

			//check for matching cards
		$firstDeck.addClass('match');
			$firstDeck.removeClass('open');
				}
				else
				{
					pause = true;

					//set time out before second pair to be checked
					setTimeout(function(){
		$secondDeck.addClass('unmatch');

	    $secondDeck.removeClass('open');
		$secondDeck.empty();


		$firstDeck.addClass('unmatch');
		$firstDeck.removeClass('open');
		$firstDeck.empty();
		pause = false;
					}, 1000);
				}
				checkIfGameWon();
				choice++;
			}
		}
	}
};

var setText = function(data){
	$nowDeck.append('<span>' + data + '</span>');
}

//Purpose: get deck number from the server
var checkMatchingDecks = function($selectedCard){
	var indexi = $selectedCard.data("indexi");


	var indexj = $selectedCard.data("indexj");
	//getting ajax method to get card info
	var info =
	$.ajax({
		method: "GET",
		url: "/memory/card",
		data: {	"name" : user,
				"indexi" : indexi,
				"indexj" : indexj },
		success: setText,
		async : false,
		dataType: 'json'
	});
};

//Purpose: check if game is complete and print end of game within guesses
//Input/Output: -
var checkIfGameWon = function(){
	var checkIfUnmatch = document.getElementsByClassName('unmatch');
	if (checkIfUnmatch.length == 0)
	{
		alert("Yuhu you won the game with " + choice + " guesses!");
	}
};
