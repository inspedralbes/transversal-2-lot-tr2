
Vue.component('barra-nav', {
    template: `<div class="inicio">
                    <b-nav pills>
                        <b-nav-item style="flex: 1">
                            <router-link to="/login" style="text-decoration: none; color:white">
                                <h4>Login</h4>
                            </router-link>                        
                        </b-nav-item>
                        <b-nav-item>
                            <router-link to="/ranking" style="text-decoration: none;color:white">
                                <h4>Global Ranking</h4>
                            </router-link>                        
                        </b-nav-item>
                    </b-nav>
                </div>`,
});
const home = Vue.component('portada', {
    data: function () {
        return {}
    },
    template: `<div>
                <barra-nav></barra-nav>
                    <div class="inici">
                        <h1>LEAGUE OF TRIVIAL</h1>
                        <button>
                            <router-link to="/game" style="text-decoration: none;">
                                Random Quiz
                            </router-link>
                        </button>
                        <br>
                        <button>
                            <router-link to="/daily" style="text-decoration: none;">
                                Daily Quiz
                            </router-link>
                        </button>
                    </div>
                </div>`
});
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
            const datos = {
                difficulty: this.gameType.difficulty,
                category: this.gameType.category,
                quiz: this.questions
            }
            console.log(datos);
            // fetch("../leagueOfTrivialG2/public/api/store-data", {
            fetch("http://localhost/transversal-2-lot-tr2/web/leagueOfTrivialG2/public/api/store-data", {
                method: 'POST',
                body: JSON.stringify(datos),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
        },
        resetGame: function () {
            this.checked = false;
        }

    },
    template: `<div>
                <barra-nav></barra-nav>
                

                <div v-show="!checked">
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
            const params = {
                score: this.score
            }
            fetch("http://localhost/transversal-2-lot-tr2/web/leagueOfTrivialG2/public/api/store-score", {
                method: 'POST',
                body: JSON.stringify(params),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
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

const login = Vue.component("login", {
    // alvaro.alumnes.inspedralbes.cat&username=user&pwd=1234
    props: [],
    template: `<div>
                    <div style="width:15%; margin:auto;">
                        <h1 class="app__titol">Login</h1>
                        <b-form-input id="input-2" v-model="form.username" placeholder="Write your username..." required></b-form-input><br>
                        <b-form-input id="input-2" v-model="form.password" type="password" placeholder="AÑADIR CONTRASEÑA LARAVEL..." required></b-form-input><br>
                        <div v-show="processing" class="boton">
                            <b-button variant="primary" disabled>
                                <b-spinner small type="grow"></b-spinner>
                                Loading . . .
                            </b-button>  
                        </div>
                        <div v-show="!processing" class="boton">
                            Don't have an account yet?<a href="/register">Join the league now!</a> <br>
                            <b-button @click="login" variant="primary">Login</b-button>              
                        </div>
                    </div>
                    <div v-show="isLogged">
                        <div class="card container-profile">
                            <div class="card-body text-center">
                                <h5 class="my-3">Welcome!</h5>
                                <p class="text-muted mb-4">{{userName}}</p>
                            </div>
                        </div>              
                    </div> 
               </div>`,
    data: function () {
        return {
            //Creamos objeto para tener la informacion del usuario junta.
            processing: false,
            form: {
                username: '',
                password: ''
            },
            perfil: {}
        }
    },
    methods: {
        login: function () {
            this.processing = true;
            fetch(`http://localhost/transversal-2-lot-tr2/web/leagueOfTrivialG2/public/api/login-get/${this.form.username}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    this.processing = false;
                    this.perfil = data;
                    console.log("DATA" + data)
                    this.perfil = JSON.parse(this.perfil);
                    console.log("PERFIL: " + this.perfil);
                    // console.log("THIS PERFIL:" + this.perfil[0].email)
                    store = userStore();
                    store.setEstado(this.perfil);
                    store.logged = true;
                });
        }
    },
    computed: {
        isLogged() {
            return userStore().logged;
        },
        userName() {
            return userStore().loginInfo.name;
        }
    }

});

// -----------------Vue Routes-----------------
const routes = [{
    path: '/game',
    component: lobby
}, {
    path: '/login',
    component: login
}, {
    path: '/',
    component: home
}]

const router = new VueRouter({
    routes // short for `routes: routes`
})


// -----------------Vue Pinia-----------------
Vue.use(Pinia.PiniaVuePlugin);
const pinia = Pinia.createPinia();

const userStore = Pinia.defineStore('usuario', {
    state() {
        return {
            logged: false,
            loginInfo: {
                success: true,
                name: 'Nombre del almacen',
                image: '',
                idUser: ''
            }
        }
    },
    actions: {
        setEstado(i) {
            this.loginInfo = i
        }
    }
})

// -----------------Vue App-----------------
var app = new Vue({
    el: '#app',
    router,
    pinia,
    data: {

    },
    computed: {
        ...Pinia.mapState(userStore, ['loginInfo', 'logged'])
    },
    methods: {
        ...Pinia.mapActions(userStore, ['setEstado'])
    }
})
