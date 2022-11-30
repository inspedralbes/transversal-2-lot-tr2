const lobby = Vue.component('quiz-lobby', {
    data: function () {
        return {
            difficulty: "",
            category: "",
            checked: false,
            playVisible:false,
            questions: {
            },
        }
    },
    methods: {
        getQuiz: function () {
            //Ruta a la API TRIVIA `https://the-trivia-api.com/api/questions?categories=${this.category}&limit=10&difficulty=${this.difficulty}`
            fetch(`https://the-trivia-api.com/api/questions?categories=${this.category}&limit=10&difficulty=${this.difficulty}`)
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
                });
        },
        startGame: function () {
            this.checked = true;
            datos = {
                difficulty: this.difficulty,
                category: this.category,
                quiz: this.questions
            }
            // fetch("../leagueOfTrivialG2/store-data")
            // .then((response) => response.json())
            // .then((data) => {
            //     console.log(data);
            // });
            fetch("../leagueOfTrivialG2/api/store-data", {
                method: 'POST',
                body: JSON.stringify(datos),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
        },
        change:function(){
            this.playVisible=true;
        }

    },
    template: `<div>
                <div v-show="!playVisible">
                    <button @click="change();">Play</button>
                </div>

                <div v-show="playVisible && !checked">
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
                    <button @click="getQuiz();startGame();">Take Quiz!</button>
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
            selectedAnswers: [],
            finished: false,
            score: 0
        }
    },
    template: `<div>
                    <div v-show="!this.finished">
                    <h1>Quiz</h1><br>
                        <div v-for="(dades,index) in quiz">
                                <h2>{{index+1}}. {{dades.question}}</h2>
                                <div v-for="respuesta in dades.answers">
                                    <b-button pill type="radio" style="width:100%" class="option" :disabled='dades.done' :class="{'false': !respuesta['estat'] & dades.done, 'correct': respuesta['estat'] & dades.done}" variant="outline-primary" @click="checkAnswer(respuesta['text'], index);">{{respuesta['text']}}</b-button>
                                </div>
                            <br><br>
                        </div>
                    </div>
                    <div v-show="this.finished">
                        <h3>YOU HAVE FINISHED THE QUIZ</h3>
                        <p>You have got {{score}} out of {{quiz.length}}</p>
                    </div>
                </div>`,

    methods: {
        checkAnswer: function (respuesta, index) {
            this.quiz[index].done = false
            if (!this.quiz[index].done) {
                this.selectedAnswers[index] = respuesta;
                this.quiz[index].done = true
                console.log("CLIC2: " + this.quiz[index].done);
                if (respuesta == this.quiz[index].correctAnswer) {
                    console.log("CORRECTA");
                    this.score++;
                    console.log(this.score);
                } else {
                    this.$forceUpdate();
                    console.log("MAL");
                }
            }
            console.log(this.quiz[index]);
            console.log(this.selectedAnswers);
            if (this.selectedAnswers.length == this.quiz.length) {
                this.finished = true;
            }
            console.log(this.finished);
        },
        // checkAnswer: function (respuesta, index) {

        // }
    }
});

const card=Vue.component('card',{
    data: function () {
        return {
            
        }
    },
    template:`<div>
                    <b-card
                        title="Card Title"
                        img-src="https://picsum.photos/600/300/?image=25"
                        img-alt="Image"
                        img-top
                        tag="article"
                        style="max-width: 20rem;"
                        class="mb-2">
                        <b-card-text>
                        Some quick example text to build on the card title and make up the bulk of the card's content.
                        </b-card-text>
                        <b-button href="#" variant="primary">Go somewhere</b-button>
                    </b-card>
                </div>`
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
