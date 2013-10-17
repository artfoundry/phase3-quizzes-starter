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
  this.question_link = "<p id='question-"+this.question_id+"'>"+this.question_text+"</p>"
  this.appendResponsesToQuestion(data)
}

Question.prototype.appendResponsesToQuestion = function(data){
  var self = this
  $(data.choices).each(
    function(key,value){
      debugger
      $('#question-'+self.question_id).append("<a id='answer-" + key + "'>" + value + "</a>")
    }
  )
}

function putQuestionOnThePage(link){
  $('.container').append(link)
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
  else if (evt.target.id.match(/answer/)) {
    alert('call answer route')

  }
}

function makeAQuizOnThePage(i,e){
  var this_quiz = new Quiz(e)
  $('.container').append(this_quiz.quiz_link)
}

function Quiz(quiz_object){
  this.quiz_link = "<a id='quiz-"+quiz_object.id+"'>" + quiz_object.id + ':' + quiz_object.name + "</a><div id='qz-"+quiz_object.id+"-questions'></div>"
  this.quiz_id = quiz_object.id
}
