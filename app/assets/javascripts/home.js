var successCallback = function(data){
  $(data.quizzes).each(makeAQuizOnThePage)
}
var failCallback = function(xhr){
  alert("Something went wrong!")
}

var test=false

$(function(){
  if (test) {
    Controller = MockController;
  }
  $('.container').empty()
  session_key = {session_key: String(parseInt(Math.random()*1000000))}
  Controller.getQuizzes(successCallback, failCallback)
  listenForClick()
})



var Controller = {
  getQuizzes: function(success, fail){
    $.getJSON('/quizzes.json',session_key).success(success).fail(fail)
  }
}

function listenForClick(){
  $(document).on('click',respondToClick)
}

function respondToClick(evt){
  if (evt.target.id.match(/quiz/)) {
    alert('call quiz route')}
  // else if evt.target === question
  //   call question route
  // else if evt.target === answer
  //   call answer route
}

function makeAQuizOnThePage(i,e){
  $('.container').append("<a id='quiz-"+e.id+"'>" + e.id + ':' + e.name + "</a>")
}
