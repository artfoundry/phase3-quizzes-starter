var quizSuccessCallback = function(data){
  $(data.quizzes).each(makeAQuizOnThePage)
}
var failCallback = function(xhr){
  alert("Something went wrong!")
}

var questionSuccessCallback = function(data){
  var question = new Question(data)
  putQuestionOnThePage(question.question_link)
}

var test=false

$(function(){
  if (test) {
    Controller = MockController;
  }
  $('.container').empty()
  session_key = {session_key: String(parseInt(Math.random()*1000000))}
  Controller.getQuizzes(quizSuccessCallback, failCallback)
  listenForClick()
})

function Question(data){
  this.question_id = data.id
  this.question_text = data.question
}

Question.prototype.appendResponsesToQuestion = function(data){
  $(data.choices).each(
    function(key,value){

    }
  )
}


var Controller = {
  getQuizzes: function(success, fail){
    $.getJSON('/quizzes.json',session_key).success(success).fail(fail)
  },
  getQuestions: function(idNo){
    $.getJSON('/quizzes/' + idNo + '/questions/next.json',session_key).success(questionSuccessCallback)
      .fail(failCallback)
  }
}

function listenForClick(){
  $(document).on('click',respondToClick)
}

function respondToClick(evt){
  if (evt.target.id.match(/quiz/)) {
    Controller.getQuestions(/quiz-(\d+)/.exec(evt.target.id)[1])}
  else if (evt.target.id.match(/question/)) {
    alert('call question route')

  }
  // else if evt.target === answer
  //   call answer route
}

function makeAQuizOnThePage(i,e){
  var this_quiz = new Quiz(e)
  $('.container').append(this_quiz.quiz_link)
}

function Quiz(quiz_object){
  this.quiz_link = "<a id='quiz-"+quiz_object.id+"'>" + quiz_object.id + ':' + quiz_object.name + "</a>"
  this.quiz_id = quiz_object.id
}
