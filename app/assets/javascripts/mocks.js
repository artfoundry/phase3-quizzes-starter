var MockController = {
  getQuizzes: function(success, fail) {
    success({
      quizzes: [
        { id: 1, name: "Yo mamma" },{ id:2, name:"Second quiz"}
      ]
    })
  }

};