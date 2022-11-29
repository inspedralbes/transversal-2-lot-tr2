const lobby = Vue.component('quiz-lobby', {
    data: function () {
        return {
            difficulty: "",
            category: "",
            checked: false,
            questions: {
                answers: [],
                correct: ""
            }
        }
    },
    methods: {
        getQuiz: function () {
            fetch(`https://the-trivia-api.com/api/questions?categories=${this.category}&limit=10&difficulty=${this.difficulty}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    this.questions = data;
                    for (let index = 0; index < data.length; index++) {
                        data[index].incorrectAnswers.push(data[index].correctAnswer)
                        this.questions[index].answers = data[index].incorrectAnswers;
                        this.questions[index].answers = this.questions[index].answers.sort((a, b) => 0.5 - Math.random());
                        this.questions[index].correct = data[index].correctAnswer;
                    }
                });
        },
        startGame: function () {
            this.checked = true;
        }

    },
    template: `<div>
                <div v-show="!checked">
                    <h1>League Of Trivial</h1>
                    <div>Checked names: {{ difficulty }}</div>

                    <input type="radio" id="easy" value="easy" v-model="difficulty">
                    <label for="easy">Easy</label>
                    
                    <input type="radio" id="medium" value="medium" v-model="difficulty">
                    <label for="medium">Medium</label>
                    
                    <input type="radio" id="difficult" value="hard" v-model="difficulty">
                    <label for="difficult">Diffcult</label>

                    <div>
                        Selected: {{ category }}
                        <select v-model="category">
                            <option disabled value="">Please select one...</option>
                            <option value="arts_and_literature">Arts & Literature</option>
                            <option value="film_and_tv">Film & TV</option>
                            <option value="food_and_drink">Food & Drink</option>
                            <option value="knowledge">General Knowledge</option>
                            <option value="geography">Geography</option>
                            <option value="history">History</option>
                            <option value="music">Music</option>
                            <option value="science">Science</option>
                            <option value="society_and_culture">Society & Culture</option>
                            <option value="sport_and_leisure">Sport & Leisure</option>
                        </select>
                    </div>
                    <button @click="getQuiz();startGame();">PLAY</button>
                </div>
                <div v-show="checked">
                    <quiz :quiz="questions"></quiz>
                </div>
                
              </div>`,
});

const quiz = Vue.component('quiz', {
    props: ['quiz'],
    data: function () {
        return {
            selectedAnswers: []
        }
    },
    template: `<div>
                <h1>Quiz</h1><br>
                    <div v-for="(dades,index) in quiz">
                            <h2>{{index+1}}. {{dades.question}}</h2>
                            <div v-for="respuesta in dades.answers">
                                <b-button type="radio" style="width:100%" variant="outline-primary" @click="saveAnswer(respuesta); checkAnswer(respuesta, index);">{{respuesta}}</b-button>
                            </div>
                        <br><br>
                    </div>
                </div>`,
    methods: {
        saveAnswer: function (respuesta) {
            this.selectedAnswers.push(respuesta);
            console.log(this.selectedAnswers);
        },
        checkAnswer: function (respuesta, index) {
            if (respuesta == this.quiz[index].correct) {
                console.log("CORRECTA");
            } else {
                console.log("MAL");
            }
        }
    }
});

const routes = [{
    path: '/',
    component: lobby
}, {
    path: '/play',
    component: quiz
}]

const router = new VueRouter({
    routes // short for `routes: routes`
})

var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!'
    }
})
