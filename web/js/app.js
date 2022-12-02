const lobby = Vue.component('quiz-lobby', {
    data: function () {
        return {
            gameType: {
                difficulty: "",
                category: ""
            },

            checked: false,
            playVisible: false,
            questions: {
            },
        }
    },
    methods: {
        getQuiz: function () {
            //Ruta a la API TRIVIA `https://the-trivia-api.com/api/questions?categories=${this.category}&limit=10&difficulty=${this.difficulty}`
            fetch(`https://the-trivia-api.com/api/questions?categories=${this.gameType.category}&limit=10&difficulty=${this.gameType.difficulty}`)
                .then((response) => response.json())
                .then((data) => {
                    this.questions = data;

                    for (let index = 0; index < this.questions.length; index++) {
                        this.questions[index].done = false;
                        this.questions[index].answers = [];
                        this.questions[index].answers.push({ "text": data[index].correctAnswer, "estat": true });
                        this.questions[index].answers.push({ "text": data[index].incorrectAnswers[0], "estat": false });
                        this.questions[index].answers.push({ "text": data[index].incorrectAnswers[1], "estat": false });
                        this.questions[index].answers.push({ "text": data[index].incorrectAnswers[2], "estat": false });
                        this.questions[index].answers = this.questions[index].answers.sort((a, b) => 0.5 - Math.random());
                    }
                    console.log(this.questions);
                    this.startGame();
                });

        },
        startGame: function () {
            this.checked = true;
            /****INSERT EN BD LLAMANDO A LA API DE LARAVEL*****/
            // const datos = {
            //     difficulty: this.gameType.difficulty,
            //     category: this.gameType.category,
            //     quiz: this.questions
            // }
            // console.log(datos);
            // fetch("../leagueOfTrivialG2/public/api/store-data", {
            //     method: 'POST',
            //     body: JSON.stringify(datos),
            //     headers: {
            //         "Content-type": "application/json; charset=UTF-8"
            //     }
            // })
        },
        change: function () {
            this.playVisible = true;
        },
        resetGame: function () {
            this.playVisible = false;
            this.checked = false;
        }

    },
    template: `<div>
                <div v-show="!playVisible">
                    <button @click="change();">Play</button>
                </div>

                <div v-show="playVisible && !checked">
                    <div>Checked names: {{ gameType.difficulty }}</div>

                    <input type="radio" id="easy" value="easy" v-model="gameType.difficulty">
                    <label for="easy">Easy</label>
                    
                    <input type="radio" id="medium" value="medium" v-model="gameType.difficulty">
                    <label for="medium">Medium</label>
                    
                    <input type="radio" id="hard" value="hard" v-model="gameType.difficulty">
                    <label for="difficult">Hard</label>

                    <div>
                        Selected: {{ gameType.category }}
                        <select v-model="gameType.category">
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
                    <button @click="getQuiz();">Take Quiz!</button>
                </div>
                <div v-show="checked">
                    <quiz :quiz="questions" :gameConfig="gameType" @reset="resetGame"></quiz>
                </div>
                
              </div>`,
});

const quiz = Vue.component('quiz', {
    props: ['quiz', 'gameConfig'],
    data: function () {
        return {
            selectedAnswers: [],
            finished: false,
            score: 0,
            currentQuestion: 0
        }
    },
    template: `<div>
                    <div v-show="!this.finished">
                    <h1>Quiz</h1><br>
                        <div v-for="(dades,index) in quiz" v-show="currentQuestion==index">
                            <card :question="dades" :number="index" @changeQuestion="changeCard" @gameStatus="saveAnswer"></card>    
                            <br><br>
                        </div>
                    </div>
                    <div v-show="this.finished">
                        <h3>YOU HAVE FINISHED THE QUIZ</h3>
                        <p>You have gained {{score}} legendary points!!</p>
                        <button  @click="reset">PLAY AGAIN!</button>
                    </div>
                </div>`,

    methods: {
        saveAnswer: function (respuesta, index) {
            this.selectedAnswers[index] = respuesta;
            if (respuesta == this.quiz[index].correctAnswer) {
                console.log("CORRECTA");
                switch (this.gameConfig.difficulty) {
                    case "easy": this.score += 100;
                        console.log("easy score: " + this.score)
                        break;
                    case "medium": this.score += 200;
                        console.log("medium score: " + this.score)

                        break;
                    case "hard": this.score += 300;
                        console.log("hard score: " + this.score)

                        break;
                }
            } else {
                console.log("MAL");
            }


        },
        changeCard: function () {
            this.currentQuestion++;
            console.log(this.selectedAnswers);
            if (this.selectedAnswers.length == this.quiz.length) {
                this.finished = true;
            }
            console.log(this.finished);

        },
        reset: function () {
            this.finished = false;
            this.score = 0;
            this.currentQuestion = 0;
            this.selectedAnswers = [];
            this.$emit('reset');

        }
    }
});

const card = Vue.component('card', {
    props: ['question', 'number'],
    data: function () {
        return {

        }
    },
    template: `<div>
                    <b-card
                        :title="question.question"
                        style="max-width: 50rem;"
                        class="mb-2">
                        <b-card-text>
                            <div v-for="respuesta in question.answers">
                                <b-button pill type="radio" style="width:100%" class="option" :disabled='question.done' :class="{'false': !respuesta['estat'] & question.done, 'correct': respuesta['estat'] & question.done}" variant="outline-primary" @click="checkAnswer(respuesta['text'], number);">{{respuesta['text']}}</b-button>
                            </div>                        
                        </b-card-text>
                        <b-button href="#" variant="primary" @click="$emit('changeQuestion')">NEXT</b-button>
                    </b-card>
                </div>`,
    methods: {
        checkAnswer: function (respuesta, index) {
            this.question.done = false
            if (!this.question.done) {
                this.question.done = true;
                this.$forceUpdate();
                this.$emit('gameStatus', respuesta, index);
            }
        },
    }
})

const routes = [{
    path: '/game',
    component: lobby
}]

const router = new VueRouter({
    routes // short for `routes: routes`
})

var app = new Vue({
    el: '#app',
    router,
    data: {
        message: 'Hello Vue!'
    }
})
