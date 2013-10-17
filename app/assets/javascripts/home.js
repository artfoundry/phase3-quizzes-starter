var quizSuccessCallback = function(data){
  $(data.quizzes).each(makeAQuizOnThePage)
}
var failCallback = function(xhr){
  alert("Something went wrong!")
}

var questionSuccessCallback = function(data){
  var question = new Question(data)
  putQuestionOnThePage(question.question_link)
  question.appendResponsesToQuestion(data)
}

var answerSuccessCallback = function(data){
  console.log(data)
  if(data.correct){
    correct++
    $('#answer-'+data.correct_choice).addClass('correct')
  }
  else{
    incorrect++
    $('#answer-'+data.submitted_choice).addClass('incorrect')
  }
}

var answerFail = function(xhr){
  alert(xhr)
}

var test=false

$(function(){
  if (test) {
    Controller = MockController;
  }
  incorrect=0
  correct=0
  $('.container').empty()
  session = {session_key: String(parseInt(Math.random()*1000000))}
  Controller.getQuizzes(quizSuccessCallback, failCallback)
  listenForClick()
})

function Question(data){
  this.question_id = data.id
  this.question_text = data.question
  this.question_link = "<p id='question-"+this.question_id+"'>"+this.question_text+"</p>"
}

Question.prototype.appendResponsesToQuestion = function(data){
  var self = this
  $(data.choices).each(
    function(i,e){
      $('#question-'+self.question_id).append(String(i+1) + ": <a id='answer-" + e.id + "'>" + e.choice + "</a>")
    }
  )
}

function putQuestionOnThePage(link){
  $('.container').append(link)
}


var Controller = {
  getQuizzes: function(success, fail){
    $.getJSON('/quizzes.json',session).success(success).fail(fail)
  },
  getQuestions: function(idNo){
    $.getJSON('/quizzes/' + idNo + '/questions/next.json',session).success(questionSuccessCallback)
      .fail(failCallback)
  },
  postAnswers: function(question_id, answer_id){
    $.ajax({
      url: '/questions/' + question_id + '/answers.json',
      data: {session_key: session.session_key, choice_id: answer_id},
      type: 'POST'
    }).success(answerSuccessCallback).fail(answerFail)
  }
}

function listenForClick(){
  $(document).on('click',respondToClick)
}

function respondToClick(evt){
  if (evt.target.id.match(/quiz/)) {
    Controller.getQuestions(/quiz-(\d+)/.exec(evt.target.id)[1])}
  else if (evt.target.id.match(/answer/)) {
    Controller.postAnswers(/question-(\d+)/.exec($(evt.target).parent().attr('id'))[1], /answer-(\d+)/.exec(evt.target.id)[1])
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
