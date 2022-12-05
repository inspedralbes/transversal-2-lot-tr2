
var tmp = null;

Vue.component('barra-nav', {
    template: `<div class="header">
                        <div class="header_div1">
                            <b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none" no-caret>
                                <template #button-content>
                                &#x1f50d;<span class="sr-only">logo</span>
                                </template>
                                <b-dropdown-item>
                                    <router-link to="/" style="text-decoration: none;">
                                        Home
                                    </router-link>     
                                </b-dropdown-item>
                                <b-dropdown-item>
                                    <router-link to="/ranking" style="text-decoration: none;">
                                        Global Ranking
                                    </router-link>
                                </b-dropdown-item>
                                <b-dropdown-item href="#">Something else here...</b-dropdown-item>
                            </b-dropdown>
                                               
                        </div>
                        <div class="header_div2">
                                                    
                        </div>
                        <div v-show="!isLogged" class="header_div3" v-b-modal.login>
                            Login
                            <login></login>                
                        </div>
                        <div v-show="isLogged" class="header_div3">
                            <router-link to="/profile" style="text-decoration: none;color:white">
                                <span style="font-size:20px;">{{userName}}&nbsp;</span>
                                <b-avatar variant="info" src="https://placekitten.com/300/300"></b-avatar>
                            </router-link> 
                        </div> 
                </div>`,
    computed: {
        isLogged() {
            return userStore().logged;
        },
        userName() {
            return userStore().loginInfo.userName;
        }
    }
});
const ranking = Vue.component('ranking', {
    data: function () {
        return {
            ranking: []
        }
    },
    mounted() {
        fetch(`../leagueOfTrivialG2/public/api/get-rankings`)
            .then(response => response.json())
            .then(data => {
                // console.log(data)
                this.ranking = JSON.parse(data);
                for (let index = 0; index < this.ranking.length; index++) {
                    tmp = new Date(this.ranking[index].created_at);
                    this.ranking[index].date = tmp.toLocaleDateString();
                    this.ranking[index].hour = tmp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }
                console.log(this.ranking);
            });
    },
    template: `<div id="ranking-marco">
                <div id="ranking-diffSelect">
                    <div class="diff1">Global</div>
                    <div class="diff2">Lv 1</div>
                    <div class="diff3">Lv 2</div>
                    <div class="diff4">Lv 3</div>
                </div>
                <div id="ranking-fondo">
                    <table id="ranking-table">
                        <tr class="ranking-cell ranking-titulo">
                            <th class="colNum">#</th>
                            <th class="colName">USER</th>
                            <th class="colScore">SCORE</th>
                        </tr>
                            <tr class="ranking-cell" v-for="(score,index) in ranking">
                                <td>{{index+1}}</td>
                                <td>{{score.userEmail}}</td>
                                <td>{{score.puntuacio}}</td>
                            </tr>
                    </table>
                </div>
                <div id="ranking-pagina">1 / 23</div>
            </div>`
});
const home = Vue.component('portada', {
    data: function () {
        return {}
    },
    template: `<div>
                <barra-nav></barra-nav>
                <div class="titulo textoCentrado">
                    <h1>LEAGUE OF TRIVIAL</h1>
                </div>
                <div class="centerItems">
                    <button class="linkButton">
                        <router-link to="/game" style="text-decoration: none;">
                            Random Quiz
                        </router-link>
                    </button>
                    <br>
                    <button class="linkButton">
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
            fetch("../leagueOfTrivialG2/public/api/store-data", {
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

Vue.component('timer', {
    data() {
        return {
            countDown: 150
        }
    },
    template: `<div>
                {{this.countDown}}
                </div>`,
    methods: {
        countDownTimer() {
            if (this.countDown > 0) {
                setTimeout(() => {
                    this.countDown -= 1
                    this.countDownTimer()
                }, 1000)
            }
        }
    },
    created() {
        this.countDownTimer()
    }
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
                    <div v-show="!this.finished" style="text-align:center">
                    <p>Your score: {{this.score}}</p><timer class="timer"></timer>
                    <br>
                        <div v-for="(dades,index) in quiz" v-show="currentQuestion==index">
                            <card :question="dades" :number="index" @changeQuestion="changeCard" @gameStatus="saveAnswer"></card>    
                            <br><br>
                        </div>
                    </div>
                    <div v-show="this.finished">
                        <div class="textoCentrado">
                            <h2 class="textoFinQuiz">Your score was:<br>7/10 in 50 seconds<br><br><br>+ {{score}} points</h2>
                        </div>
                        <div class="centerItems" id="divXP">
                            <div class="gridDeNiveles">
                                <div class="nivelActual">Platinum</div>
                                <div class="nivelSiguiente">Master</div>
                            </div>
                                <div id="barra">
                                    <div class="progreso"></div>
                                    400 / 750
                                </div>
                            </div>
                            <button @click="reset">TORNA A L'INICI</button>
                        <div class="centerItems">
                            <div class="linkButton">Your Profile</div>
                        </div>
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
                score: this.score,
                idUser: userStore().loginInfo.id
            }

            fetch("../leagueOfTrivialG2/public/api/store-score", {
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
    },
    computed: {
        getUser() {
            return userStore().loginInfo.id;
        }
    }
});

const card = Vue.component('card', {
    props: ['question', 'number'],
    data: function () {
        return {

        }
    },
    template: `<div id="gamecard-juego">
                    <div class="pregunta">
                        <div id="num_pregunta">{{number+1}} / 10</div>
                        <div>{{question.question}}</div>
                        <div id="icona_pregunta">?</div>
                    </div>
                    <div id="gamecard-respuestas">
                        <div v-for="respuesta in question.answers">
                            <button type="radio" class="respuesta" :disabled='question.done' :class="{'false': !respuesta['estat'] & question.done, 'correct': respuesta['estat'] & question.done}" @click="checkAnswer(respuesta['text'], number);">{{respuesta['text']}}</button>
                        </div>
                        <div v-show="question.done">
                            <button class="next" @click="$emit('changeQuestion')">NEXT</button>
                        </div>
                    </div>
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
const profile = Vue.component("profile", {
    data: function () {
        return {
            user: ''
        }
    },
    template: `<div>
                    Name:{{this.user.name}}
                    Email:{{this.user.email}}
    
    </div>`,
    mounted() {
        fetch(`../leagueOfTrivialG2/public/api/user`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.user = data;
            });
    }
})
const login = Vue.component("login", {
    // alvaro.alumnes.inspedralbes.cat&username=user&pwd=1234
    props: [],
    template: `<div>
                    <b-modal id="login" title="We are happy that you are back!">
                        <div v-show="!isLogged">
                            <h3 class="app__titol">Login</h3>
                            <b-form-input id="input-2" v-model="form.email" placeholder="Write your email..." required></b-form-input><br>
                            <b-form-input id="input-3" v-model="form.password" type="password" placeholder="AÑADIR CONTRASEÑA LARAVEL..." required></b-form-input><br>
                            Don't have an account yet?<router-link to="/register" style="text-decoration: none;">
                            <h6 style="display: inline;">Join the league now!</h6>
                        </router-link> <br>
                        </div>
                            <template #modal-footer>
                                <div v-show="!isLogged">
                                    <div v-show="!processing" class="boton">
                                        <button v-b-modal.modal-close_visit class="btn btn-primary" @click="login">Login</button>      
                                    </div>
                                    <div v-show="processing" class="boton">
                                        <button v-b-modal.modal-close_visit class="btn btn-primary" disabled>
                                            <b-spinner small type="grow"></b-spinner>
                                            Loading . . .
                                        </button>  
                                    </div>
                                </div>
                            </template>
                        <div v-show="isLogged">
                            <div class="card container-profile">
                                <div class="card-body text-center">
                                    <h5 class="my-3">Welcome!</h5>
                                    <p class="text-muted mb-4">{{userName}}</p>
                                    <b-button @click="logOut" variant="primary">Logout</b-button>
                                </div>
                            </div>              
                        </div> 
                    </b-modal>
               </div>`,
    data: function () {
        return {
            //Creamos objeto para tener la informacion del usuario junta.
            processing: false,
            form: {
                email: '',
                password: ''
            },
            perfil: {}
        }
    },
    methods: {
        login: function () {
            this.processing = true;
            // fetch(`../leagueOfTrivialG2/public/api/login-get/${this.form.username}`)
            // .then(response => response.json())
            // .then(data => {
            //     console.log(data)
            //     this.processing = false;
            //     this.perfil = data;
            //     // console.log("DATA" + data)
            //     this.perfil = JSON.parse(this.perfil);
            //     // console.log("PERFIL: " + this.perfil);
            //     // console.log("THIS PERFIL:" + this.perfil[0].email)
            //     store = userStore();
            //     store.setEstado(this.perfil);
            //     store.logged = true;
            // });

            fetch("../leagueOfTrivialG2/public/api/login", {
                method: 'POST',
                body: JSON.stringify(this.form),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(response => response.json())
                .then(data => {
                    console.log(data)
                    this.processing = false;
                    this.perfil = data;
                    // console.log("DATA" + data)
                    // this.perfil = JSON.parse(this.perfil);
                    // console.log("PERFIL: " + this.perfil);
                    // console.log("THIS PERFIL:" + this.perfil[0].email)
                    store = userStore();
                    store.setEstado(this.perfil);
                    store.logged = true;
                });

        },
        logOut: function () {
            store.logged = false;
            this.form.username = '',
                this.form.password = ''
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

const register = Vue.component("register", {
    data: function () {
        return {
            //Creamos objeto para tener la informacion del usuario junta.
            processing: false,
            form: {
                name: '',
                username: '',
                email: '',
                password: ''
                // password_confirmation: ''
            },
            show: true
        }
    },
    template: `<div>
                    <b-form v-if="show">
                        <b-form-group
                            id="input-group-1"
                            label="Email address:"
                            label-for="input-1"
                            description="We'll never share your email with anyone else.">
                                <b-form-input
                                    id="input-1"
                                    v-model="form.email"
                                    type="email"
                                    placeholder="Write an email..."
                                    required
                                >
                                </b-form-input>
                        </b-form-group>

                        <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
                        <b-form-input
                            id="input-2"
                            v-model="form.name"
                            placeholder="Enter a name..."
                            required
                        ></b-form-input>
                        </b-form-group>

                        <b-form-group id="input-group-3" label="Your user name:" label-for="input-3">
                        <b-form-input
                            id="input-3"
                            v-model="form.username"
                            placeholder="Enter a usernamename..."
                            required
                        ></b-form-input>
                        </b-form-group>

                        <b-form-group
                        id="input-group-4"
                        label="Password:"
                        label-for="input-4"
                        description="Never share your password with anyone else.">
                            <b-form-input
                                id="input-4"
                                v-model="form.password"
                                type="password"
                                placeholder="Write a password..."
                                required
                            >
                            </b-form-input>
                    </b-form-group>
                        <b-button @click="send" type="button" variant="primary">Register</b-button>
                        <b-button @click="onReset" type="reset" variant="danger">Reset</b-button>
                    </b-form>
                    <b-card class="mt-3" header="Form Data Result">
                        <pre class="m-0">{{ form }}</pre>
                    </b-card>
                </div>`,
    methods: {
        send: function (event) {
            // event.preventDefault()
            // alert(JSON.stringify(this.form))
            fetch("../leagueOfTrivialG2/public/api/store-user", {
                method: 'POST',
                body: JSON.stringify(this.form),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(this.$router.push({ path: '/' }))
        },
        onReset: function (event) {
            event.preventDefault()
            // Reset our form values
            this.form.email = ''
            this.form.name = ''
            this.form.userName = null
            this.form.password = null
            // Trick to reset/clear native browser form validation state
            this.show = false
            this.$nextTick(() => {
                this.show = true
            })

        }
    }
})

// -----------------Vue Routes-----------------
const routes = [{
    path: '/game',
    component: lobby
}, {
    path: '/login',
    component: login
},
{
    path: '/register',
    component: register
}, {
    path: '/',
    component: home
}, {
    path: '/profile',
    component: profile
}, {
    path: '/ranking',
    component: ranking
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
