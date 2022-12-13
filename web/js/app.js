var tmp = null;
Vue.component('barra-nav', {
    template: `<div class="header1">
                        <div class="header1_div1">
                            <b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none" no-caret>
                                <template #button-content>
                                    <span class="header1_div1-element sr-only">League Of Trivial</span>
                                </template>
                                <b-dropdown-item @click="goHome">Home</b-dropdown-item>
                                <b-dropdown-item>
                                    <router-link to="/ranking" style="text-decoration: none; color:black">
                                        Global Ranking
                                    </router-link>
                                </b-dropdown-item>
                                <b-dropdown-item href="#">Something else here...</b-dropdown-item>
                            </b-dropdown>                  
                        </div>
                        <div v-show="!isLogged" class="header1_div2" v-b-modal.login>
                            <router-link to="/login" class="header1_div2-element">
                                <span>Login</span>
                            </router-link>
                            <router-view></router-view>              
                        </div>
                        <div v-show="isLogged" class="header1_div2">
                            <b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none" no-caret style="background-color:white">
                                <template #button-content>
                                    <span style="font-size:20px;">{{userName}}&nbsp;</span>
                                    <b-avatar variant="info" :src="avatar"></b-avatar>
                                </template>
                                <b-dropdown-item href="#">
                                    <router-link :to="{path: '/profile/' + idUser}" style="text-decoration: none; color:black;">Profile</router-link> 
                                </b-dropdown-item>
                                <b-dropdown-item href="#" @click="logOut" style="text-decoration: none;">Logout</b-dropdown-item>
                                <b-dropdown-item href="#" style="text-decoration: none;">
                                    <router-link to="/ranking" style="text-decoration: none; color:black;">My Rankings</router-link> 
                                </b-dropdown-item>
                            </b-dropdown>
                        </div> 
                </div>`,
    computed: {
        isLogged() {
            return userStore().logged;
        },
        avatar() {
            return userStore().loginInfo.imageUrl;
        },
        userName() {
            return userStore().loginInfo.userName;
        },
        idUser() {
            return userStore().loginInfo.id;
        }
    },
    methods: {
        logOut: function () {
            store.logged = false;
            store.loginInfo = {};
            fetch("../leagueOfTrivialG2/public/api/logout", {
                method: 'POST',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            this.$router.push({ path: '/' })
        },
        goHome: function () {
            this.$router.push({ path: '/' })

        }
    }
});
const ranking = Vue.component('ranking', {
    data: function () {
        return {
            ranking: [],
            daily: false,
            global: false,
            infoChallenge: [],
            userData: []
        }
    },
    mounted() {
        fetch(`../leagueOfTrivialG2/public/api/get-rankings`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.ranking = data;
                // for (let index = 0; index < this.ranking.length; index++) {
                //     tmp = new Date(this.ranking[index].created_at);
                //     this.ranking[index].date = tmp.toLocaleDateString();
                //     this.ranking[index].hour = tmp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                // }
                // console.log(this.ranking);
            });
    },
    methods: {
        dailyRank: function () {

            fetch(`../leagueOfTrivialG2/public/api/get-dailyRankings`)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    this.ranking = data;
                    this.daily = true;
                    this.global = false
                });
        },
        globalRank: function () {
            fetch(`../leagueOfTrivialG2/public/api/get-rankings`)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    this.ranking = data;
                    this.global = true;
                    this.daily = false;
                });
        },
        userProfile: function (id) {
            this.idUser = this.ranking[id].idUser;
            console.log(this.idUser);
            this.$router.push({ name: 'profile', params: { idUser: this.idUser } })
        }
    },
    template: `<div>
                <barra-nav></barra-nav>
                    <div id="ranking-marco">
                        <div id="ranking-diffSelect">
                            <div class="diff1"><button @click="globalRank">Global</button></div>
                            <div class="diff2"><button @click="dailyRank">Daily</button></div>
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
                                        <td v-show="isLogged"><router-link :to="{path: '/profile/' + score.idUser}">{{score.userName}}</router-link></td>
                                        <td v-show="!isLogged">{{score.userName}}</td>
                                        <td>{{score.score}}</td>
                                    </tr>
                            </table>
                        </div>
                    </div>
                </div>`,
    computed: {
        isLogged() {
            return userStore().logged;
        }
    }
});
const challenge = Vue.component('challenge', {
    data: function () {
        return {
            questions: [],
            gameType: [],
            ready: false,
            info: []
        }
    },
    props: ['infoChallenge'],
    mounted() {
        params = {
            idGame: this.infoChallenge.idGame
        }
        fetch("../leagueOfTrivialG2/public/api/get-challenge", {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(response => response.json())
            .then(data => {
                this.questions = JSON.parse(data);
                console.log(this.questions);
                for (let index = 0; index < this.questions.length; index++) {
                    this.questions[index].done = false;
                    this.questions[index].answers = [];
                    this.questions[index].answers.push({ "text": this.questions[index].correctAnswer, "estat": true });
                    this.questions[index].answers.push({ "text": this.questions[index].incorrectAnswers[0], "estat": false });
                    this.questions[index].answers.push({ "text": this.questions[index].incorrectAnswers[1], "estat": false });
                    this.questions[index].answers.push({ "text": this.questions[index].incorrectAnswers[2], "estat": false });
                    this.questions[index].answers = this.questions[index].answers.sort((a, b) => 0.5 - Math.random());
                }
                this.gameType.difficulty = this.infoChallenge.difficulty;
                this.gameType.category = this.infoChallenge.category;
                this.gameType.type = "challenge";
                this.info.idChallenged = this.infoChallenge.idChallenged;
                this.info.idChallenger = this.infoChallenge.idChallenger;
                this.info.idGame = this.infoChallenge.idGame;
                this.info.initialScore = this.infoChallenge.challengedsScore;
                console.log(this.gameType);
            })
    },
    template: `<div>
                    <div style="color:white" v-show="!ready">
                        YOU ARE ABOUT TO CHALLENGE {{this.infoChallenge.challengedsName}} <br>
                        WHO GOT {{this.infoChallenge.challengedsScore}} POINTS

                        ARE YOU SURE?<br>
                        <button @click="ready=true">LET'S GO</button>
                        <button><router-link :to="{path: '/profile/' + this.infoChallenge.idChallenged}">I changed my mind..</router-link></button>
                    </div>
                    <div v-show="ready">
                        <quiz :quiz="questions" :gameConfig="gameType" :challengeInfo="info"></quiz>
                    </div>
                </div>`
});
const home = Vue.component('portada', {
    data: function () {
        return {
            dailyPlayed: false
        }
    },
    template: `<div>
                <barra-nav></barra-nav>
                <div class="titulo textoCentrado">
                    <h1>LEAGUE OF TRIVIAL</h1>
                </div>
                <div v-show="isLogged">
                    <div class="centerItems">
                        <button class="linkButton">
                            <router-link to="/game/0" style="text-decoration: none;">
                                Random Quiz
                            </router-link>
                        </button>
                        <br>
                        <button class="linkButton" v-show="!dailyIsPlayed">
                            <router-link to="/game/1" style="text-decoration: none;">
                                Daily Quiz
                            </router-link>
                            
                        </button>
                    </div>
                </div>
                <div v-show="!isLogged">
                    <div class="centerItems">
                        <button class="linkButton">
                            <router-link to="/game/2" style="text-decoration: none;">
                                Play Demo
                            </router-link>
                        </button>
                    </div>
                </div>
            </div>`,

    computed: {
        isLogged() {
            return userStore().logged;
        },
        dailyIsPlayed() {
            return userStore().loginInfo.dailyPlayed;
        }
    },
    methods: {
        checkDaily() {
            //CHECKS IF USER HAS PLAYED DAILY QUIZ TODAY
            dades = {
                idUser: userStore().loginInfo.id
            }

            fetch("../leagueOfTrivialG2/public/api/checkDaily", {
                method: 'POST',
                body: JSON.stringify(dades),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(response => response.json())
                .then(data => {
                    console.log(data[0].timesPlayed);
                    if (data[0].timesPlayed == 1) {
                        this.dailyPlayed = true;
                        console.log("YA HAS JUGADO LA DIARIA");
                    } else {
                        this.dailyPlayed = false;
                        console.log("AUN NO HAS JUGADO LA DIARIA");
                    }

                })
        }
    }

});
const lobby = Vue.component('quiz-lobby', {
    props: {
        mode: {
            type: String,
            default: '0'
        }
    },
    data: function () {
        return {
            gameType: {
                difficulty: "",
                category: "",
                type: "",
            },
            checked: false,
            dailyChecked: false,
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
        dailyQuiz: function () {
            fetch(` ../leagueOfTrivialG2/public/api/get-daily`)
                .then((response) => response.json())
                .then((data) => {
                    this.questions = JSON.parse(data);
                    console.log(this.questions);
                    for (let index = 0; index < this.questions.length; index++) {
                        this.questions[index].done = false;
                        this.questions[index].answers = [];
                        this.questions[index].answers.push({ "text": this.questions[index].correctAnswer, "estat": true });
                        this.questions[index].answers.push({ "text": this.questions[index].incorrectAnswers[0], "estat": false });
                        this.questions[index].answers.push({ "text": this.questions[index].incorrectAnswers[1], "estat": false });
                        this.questions[index].answers.push({ "text": this.questions[index].incorrectAnswers[2], "estat": false });
                        this.questions[index].answers = this.questions[index].answers.sort((a, b) => 0.5 - Math.random());
                    }
                    this.startGame();
                });
        },
        demoQuiz: function () {
            fetch(` ../leagueOfTrivialG2/public/api/get-demo`)
                .then((response) => response.json())
                .then((data) => {
                    this.questions = JSON.parse(data);
                    console.log(this.questions);
                    for (let index = 0; index < this.questions.length; index++) {
                        this.questions[index].done = false;
                        this.questions[index].answers = [];
                        this.questions[index].answers.push({ "text": this.questions[index].correctAnswer, "estat": true });
                        this.questions[index].answers.push({ "text": this.questions[index].incorrectAnswers[0], "estat": false });
                        this.questions[index].answers.push({ "text": this.questions[index].incorrectAnswers[1], "estat": false });
                        this.questions[index].answers.push({ "text": this.questions[index].incorrectAnswers[2], "estat": false });
                        this.questions[index].answers = this.questions[index].answers.sort((a, b) => 0.5 - Math.random());
                    }
                    this.startGame();
                });
        },
        startGame: function () {
            const datos = {
                difficulty: null,
                category: null,
                quiz: null
            }
            if (this.mode == 0) {
                datos.difficulty = this.gameType.difficulty;
                datos.category = this.gameType.category;
                datos.quiz = this.questions;
                this.gameType.type = "normal";
                fetch("../leagueOfTrivialG2/public/api/store-data", {
                    method: 'POST',
                    body: JSON.stringify(datos),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })

            } if (this.mode == 1) {
                datos.difficulty = null;
                datos.category = null;
                datos.quiz = this.questions;
                this.gameType.type = "daily";
            }
            if (this.mode == 2) {
                datos.difficulty = null;
                datos.category = null;
                datos.quiz = this.questions;
                this.gameType.type = "demo";
            }
            console.log(datos);
            // fetch("../leagueOfTrivialG2/public/api/store-data", {
            this.checked = true;
        }
        // resetGame: function () {
        //     this.checked = false;
        // }

    },
    template: `<div>
                <barra-nav></barra-nav>
                MODO: {{mode}}
                <div v-show="mode==0">
                    <div v-show="!checked">
                        <div>Checked names: {{ gameType.difficulty }}</div>
                        <div class="input-container">
                            <div class="input-container-easy">
                                <input type="radio" id="easy" value="easy" v-model="gameType.difficulty">
                                <label for="easy"><i class="bi bi-fire"></i><br>Easy</label>
                            </div>
                            <div class="input-container-medium">
                                <input type="radio" id="medium" value="medium" v-model="gameType.difficulty">
                                <label for="medium"><i class="bi bi-fire"></i><i class="bi bi-fire"></i><br>Medium</label>
                            </div>
                            <div class="input-container-hard">
                                <input type="radio" id="hard" value="hard" v-model="gameType.difficulty">
                                <label for="hard"><i class="bi bi-fire"></i><i class="bi bi-fire"></i><i class="bi bi-fire"></i><br>Hard</label>
                            </div>
                        </div>
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
                        <quiz :quiz="questions" :gameConfig="gameType"></quiz>
                    </div>
                </div>
                <div v-show="mode==1">
                    <div v-show="!checked">
                        <div>You are going to play toda's quiz, you can only do one attempt per day.</div>
                        <button @click="dailyQuiz">PLAY DAILY</button>
                    </div>
                    <div v-show="checked">
                        <quiz :quiz="questions" :gameConfig="gameType"></quiz>
                    </div>
                </div>
                <div v-show="mode==2">
                    <div v-show="!checked">
                        <p>You are going to play a demo.</p>
                        <button @click="demoQuiz">PLAY DEMO</button>
                    </div>
                    <div v-show="checked">
                        <quiz :quiz="questions" :gameConfig="gameType"></quiz>
                    </div>
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
    props: ['quiz', 'gameConfig', 'challengeInfo'],
    data: function () {
        return {
            selectedAnswers: [],
            finished: false,
            score: 0,
            currentQuestion: 0,
            winner: 0,
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
                    <div v-show="this.finished && this.gameConfig.type=='normal' || this.finished && this.gameConfig.type=='daily'" >
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
                            <button @click="reset">HOME</button>
                        <div class="centerItems">
                            <div class="linkButton">Your Profile</div>
                        </div>
                    </div>
                    <div v-show="this.finished && this.gameConfig.type=='demo'">
                        <div class="textoCentrado">
                            <h2 class="textoFinQuiz">Your score was:<br>7/10 in 50 seconds</h2>
                        </div>
                        <div class="centerItems">
                            <h4>Would you like to see more? <router-link to="/register" style="text-decoration: none;">JOIN THE LEAGUE NOW!</router-link></h4>
                            <button @click="reset">HOME</button>
                        </div>
                    </div>
                    <div v-if="this.finished && this.gameConfig.type=='challenge'">
                        <div class="textoCentrado">
                            <h2 class="textoFinQuiz">You've finished the challenge!</h2>
                        </div>
                        <div class="centerItems">
                            <h4>The results are ...</h4>
                            <div v-if="winner==0">
                                IT'S A TIE!!! 
                            </div>
                            <div v-if="winner==this.challengeInfo.idChallenger">
                                CONGRATS, YOU'VE WON!! 
                            </div>
                            <div v-if="winner==this.challengeInfo.idChallenged">
                                Oh, no... You've lost :(
                            </div>
                            <button @click="reset">HOME</button>
                        </div>
                    </div>
                </div>`,
    methods: {
        saveAnswer: function (respuesta, index) {
            console.log(this.challengeInfo);
            this.selectedAnswers[index] = respuesta;
            if (respuesta == this.quiz[index].correctAnswer) {
                if (this.gameConfig.type == "normal" || this.gameConfig.type == "challenge") {
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
                } else if (this.gameConfig.type == "daily") {
                    this.score += 10;
                }
            } else {
                console.log("MAL");
            }
        },
        changeCard: function () {
            this.currentQuestion++;
            console.log(this.selectedAnswers);
            if (this.selectedAnswers.length == this.quiz.length) {
                if (this.gameConfig.type == "challenge") {
                    if (this.score > this.challengeInfo.initialScore) {
                        this.winner = this.challengeInfo.idChallenger;
                    } else if (this.score < this.challengeInfo.initialScore) {
                        this.winner = this.challengeInfo.idChallenged;
                    } else {
                        this.winner = 0;
                    }
                }
                this.finished = true;

            }
            console.log(this.finished);
        },
        reset: function () {
            const params = {
                score: this.score,
                idUser: userStore().loginInfo.id
            }
            console.log(params);
            if (this.gameConfig.type == "normal") {
                fetch("../leagueOfTrivialG2/public/api/store-score", {
                    method: 'POST',
                    body: JSON.stringify(params),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
            }
            if (this.gameConfig.type == "daily") {
                fetch("../leagueOfTrivialG2/public/api/store-dailyScore", {
                    method: 'POST',
                    body: JSON.stringify(params),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
                fetch("../leagueOfTrivialG2/public/api/dailyPlayed", {
                    method: 'POST',
                    body: JSON.stringify(params),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
                userStore().loginInfo.dailyPlayed = 1;

            }
            if (this.gameConfig.type == "challenge") {
                challengeParams = {
                    idChallenger: this.challengeInfo.idChallenger,
                    idChallenged: this.challengeInfo.idChallenged,
                    winner: this.winner,
                    idGame: this.challengeInfo.idGame,
                }
                console.log(challengeParams);
                fetch("../leagueOfTrivialG2/public/api/store-challenge", {
                    method: 'POST',
                    body: JSON.stringify(challengeParams),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
            }

            this.finished = false;
            this.score = 0;
            this.currentQuestion = 0;
            this.selectedAnswers = [];
            // this.$emit('reset');
            this.$router.push({ path: '/' })
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
            activeButton: ''
        }
    },
    template: `<div id="gamecard-juego">
    <div class="pregunta">
        <div id="num_pregunta">{{number+1}} / 10</div>
        <div>{{question.question}}</div>
    </div>
    <div id="gamecard-respuestas">
        <div v-for="(respuesta,index) in question.answers">
            <button type="radio" class="respuesta" :disabled='question.done'
                :class="{'false': !respuesta['estat'] & question.done, 'correct': respuesta['estat'] & question.done, 'selected': activeButton === index ? 'notSelected' : ''}"
                @click="checkAnswer(respuesta['text'], number);">{{respuesta['text']}}</button>
        </div>
        <div v-show="question.done">
            <b-button class="next" @click="$emit('changeQuestion')">NEXT<span class="arrow"></span></b-button>
        </div>
    </div>
</div>`,
    methods: {
        checkAnswer: function (respuesta, index) {
            this.question.done = false
            this.activeButton = index;
            if (!this.question.done) {
                this.question.done = true;
                this.$forceUpdate();
                this.$emit('gameStatus', respuesta, index);
            }
        },
    }
})
const profile = Vue.component("profile", {
    props: ['idUser'],
    data: function () {
        return {
            user: '',
            loadedData: false,
            infoChallenge: [],
            alert: false
        }
    },
    template: `<div>
                    <barra-nav></barra-nav>
                    <div v-if="idUser==getUser" class="header2" id="profile_Header">
                        <div class="header2_div2">Edit Profile</div>
                    </div>
                    <div v-if="loadedData">
                        <div class="centerItems" id="gridPerfil">
                            <div class="perfilAvatar" :style="{backgroundImage: 'url('+this.user.info[0].imageUrl+')'}"></div>
                            <div v-if="idUser==getUser">
                                <button @click="change">Change Avatar</button>
                                <p v-if="alert">Remember to save your changes</p>
                                <button @click="save">SAVE</button>

                            </div>
                            <div class="perfilNombre">{{this.user.info[0].name}}</div>
                            <div class="perfilInfo">{{this.user.info[0].userName}}</div>
                            <div class="perfilInfo">{{this.user.info[0].email}}</div>
                            <div v-if="this.user.info[0].status==null" class="profileStatus">
                                Tell everyone something about you!
                            </div>
                            <div v-if="this.user.info[0].status!=null" class="profileStatus">
                                "{{this.user.info[0].status}}"
                            </div>
                            <br>
                            <div id="barra">
                                <div class="progreso"></div>
                                {{this.user.xp[0].xp}} / 750
                            </div>
                            <div class="gridDeNiveles">
                                <div class="nivelActual">Platinum</div>
                                <div class="nivelSiguiente">Master</div>
                            </div>
                            
                            <div class="lastPlayed">
                                <p>Last Played</p>
                                <table>
                                    <tr v-for="(game,index) in user.historic">
                                        <td>{{game.date}}</td>
                                        <td>{{game.category}}</td>
                                        <td>{{game.difficulty}}</td>
                                        <td>{{game.puntuacio}}</td>
                                        <td v-if="idUser!=getUser"><img src="../img/challenge.png" width="20px" @click="startChallenge(index)"></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>`,
    mounted() {
        params = {
            idUser: this.idUser
        }
        console.log("EL ID DEL USUARIO ES " + this.idUser);
        fetch("../leagueOfTrivialG2/public/api/get-userRanking", {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                "Content-type": "application/json;charset=UTF-8"
            }
        }).then(response => {
            return response.json()
        }).then(data => {
            console.log(data)
            this.user = data;
            this.loadedData = true;
        });

    },
    methods: {
        startChallenge(idGame) {
            this.infoChallenge.idChallenger = userStore().loginInfo.id;
            this.infoChallenge.challengersName = userStore().loginInfo.userName;
            this.infoChallenge.idChallenged = this.idUser;
            this.infoChallenge.challengedsName = this.user.info[0].userName;
            this.infoChallenge.challengedsScore = this.user.historic[idGame].puntuacio;
            this.infoChallenge.idGame = this.user.historic[idGame].idGame;
            this.infoChallenge.category = this.user.historic[idGame].category;
            this.infoChallenge.difficulty = this.user.historic[idGame].difficulty;
            console.log(this.infoChallenge);
            this.$router.push({ name: 'challenge', params: { infoChallenge: this.infoChallenge } })
        },
        change: function () {
            let num = 0;
            userAvatar = '';
            this.alert = true;
            type = ["bottts", "croodles", "micah"];
            num = Math.floor(Math.random() * 1000000);
            console.log("el numero random es " + num)
            userAvatar = type[Math.floor(Math.random() * 3)];
            console.log("el usuario és: " + userAvatar)
            this.user.info[0].imageUrl = "https://avatars.dicebear.com/api/" + userAvatar + "/" + num + ".svg?"
        },
        save: function () {

        }
    },
    computed: {
        getUser() {
            return userStore().loginInfo.id;
        }
    }
})
const login = Vue.component("login", {
    // alvaro.alumnes.inspedralbes.cat&username=user&pwd=1234
    props: [],
    template: `<div>
    <b-modal class="screen" id="login" title="We are happy that you are back!">

    <div v-show="!isLogged">
        <div class="login__title">Login</div>
        <span>{{this.errors['error']}}</span>

        <div class="login__field">
            <i class="login__icon bi bi-person-fill"></i>
            <b-form-input id="input-2" class="login__input" v-model="form.email"
                placeholder="Write your email..." required>
            </b-form-input>
        </div>
        <div class="login__field">
            <i class="login__icon bi bi-lock-fill"></i>
            <b-form-input id="input-3" class="login__input" v-model="form.password" type="password"
                placeholder="AÑADIR CONTRASEÑA LARAVEL..." required></b-form-input>
        </div>
        <br>
        Don't have an account yet?<router-link to="/register" style="text-decoration: none;">
            <h6 style="display: inline;">Join the league now!</h6>
        </router-link> <br>
    </div>
    <template #modal-footer>
        <div v-show="!isLogged">
            <div v-show="!processing" class="boton">
                <button v-b-modal.modal-close_visit class="button login__submit" @click="login">Login</button>
            </div>
            <div v-show="processing" class="boton">
                <button v-b-modal.modal-close_visit class="button login__submit" disabled>
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
            perfil: {},
            errors: []
        }
    },
    methods: {
        login: async function () {
            this.processing = true;
            try {
                await fetch("../leagueOfTrivialG2/public/api/login", {
                    method: 'POST',
                    body: JSON.stringify(this.form),
                    headers: {
                        "Content-type": "application/json;charset=UTF-8"
                    }
                }).then(response => {
                    console.log(response);
                    return response.json()
                })
                    .then(data => {
                        console.log(data)
                        this.processing = false;
                        this.errors = data;
                        if (this.errors['code'] == 401) {
                            console.log("NO AUTORITZAT");
                        } else if (this.errors['code'] == 400) {
                            console.log("CAMPS VUITS");
                        } else {
                            this.perfil = data;
                            store = userStore();
                            store.setEstado(this.perfil);
                            store.logged = true;
                            this.perfil = {};
                            this.form.email = '';
                            this.form.password = '';
                            this.$router.push({ path: '/' });

                        }

                    }).catch(err => { console.log(err); });
            } catch (error) {
                console.log(error);
            }

        },
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
                password: '',
                avatar: ''
                // password_confirmation: ''
            },
            numRandom: 0,
            userAvatarType: '',
            type: ["bottts", "croodles", "micah"],
            validEmail: false,
            validName: false,
            validUserName: false,
            validPass: false,
            errors: [],
            visibility: false,
            inputType: "password"
        }
    },
    template: `<div>
                <barra-nav></barra-nav>
                <div class="login-container">
                    <div class="screen">
                        <div class="screen__content">
                            <form class="login">
                                <div class="login__title">JOIN THE LEAGUE!</div>
                                <!-- <span>{{this.errors['errors']}}</span> -->
                                <div class="login__field">
                                    <!-- <i class="login__icon bi bi-person-fill"></i> -->
                                    <i class="login__icon bi bi-info-circle-fill"></i>
                                    <input type="text" class="login__input" v-model="form.name" @keyup="validarName"
                                        placeholder="Name">
                                    <!-- <div v-if="validName && form.name.length>0" class="box">
                                        <p style="color:green;">Correct name</p>
                                    </div>
                                    <div v-if="!validName && form.name.length>0" class="box">
                                        <p style="color:red;">Incorrect name. Must contain at least 3 characters</p>
                                    </div> -->
                                </div>
                                <div class="login__field">
                                    <i class="login__icon bi bi-envelope-fill"></i>
                                    <input type="email" class="login__input" v-model="form.email" @keyup="validar"
                                        placeholder="Email">
                                    <!-- <div v-show="validEmail && form.email.length>0">
                                        <p style="color:green;">Correct email</p>
                                    </div>
                                    <div v-show="!validEmail && form.email.length>0">
                                        <p style="color:red;">Invalid Email </p>
                                    </div> -->
                                </div>
                                <div class="login__field">
                                    <i class="login__icon bi bi-person-fill"></i>
                                    <input type="text" class="login__input" v-model="form.username" @keyup="validarUserName"
                                        placeholder="Username">
                                    <!-- <div v-show="validUserName && form.username.length>0">
                                        <p style="color:green;">Correct user name</p>
                                    </div>
                                    <div v-show="!validUserName && form.username.length>0">
                                        <p style="color:red;">User name can only contain alphanumeric characters.</p>
                                    </div> -->
                                </div>
                                <div class="login__field">
                                    <i class="login__icon bi bi-lock-fill"></i>
                                    <input :type="this.inputType" class="login__input" v-model="form.password" @keyup="validarPass"
                                        placeholder="Password here">
                                    <i class="login__icon--hide bi bi-eye" @click="hide"></i>

                                    <!-- <div v-show="validPass && form.password.length>0">
                                        <p style="color:green;">Name correct</p>
                                    </div>
                                    <div v-show="!validPass && form.password.length>0">
                                        <p style="color:red;">Password requires minimum eight characters, at least one letter and
                                            one
                                            number.</p>
                                    </div> -->
                                </div>
                                <button class="button login__submit">
                                    <div class="input_box button">
                                        <input class="button__text" @click="send" type="button" value="SIGN UP"></input>
                                        <i class="button__icon bi bi-chevron-right"></i>
                                    </div>
                                </button>
                            </form>
                        </div>
                    </div>
                  </div>
                </div>`,

    methods: {
        validar: function () {
            //https://regexr.com/3e48o
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.form.email)) {
                this.validEmail = true;
            } else if (this.form.email.length > 0) {
                this.validEmail = false;
            }

        },
        validarName: function () {
            //Minimum 3 characters, max 20 characters and characters a-z/A-Z
            if (/^[a-zA-Z]{3,20}$/.test(this.form.name)) {
                this.validName = true;

            } else if (this.form.name.length > 0) {
                this.validName = false;
            }
        },
        validarUserName: function () {
            // username is 8-20 characters long --- no _ or . at the beginning ---  no __ or _. or ._ or .. inside --- allowed characters --- no _ or . at the end
            if (/^[a-zA-Z0-9]{3,20}$/.test(this.form.username)) {
                this.validUserName = true;

            } else if (this.form.username.length > 0) {
                this.validUserName = false;
            }
        },
        validarPass: function () {
            //Minimum eight characters, at least one letter and one number:
            if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(this.form.password)) {
                this.validPass = true;

            } else if (this.form.password.length > 0) {
                this.validPass = false;
            }
        },
        send: function (event) {
            this.numRandom = Math.floor(Math.random() * 1000000);
            console.log("el numero random es " + this.numRandom)
            this.userAvatarType = this.type[Math.floor(Math.random() * 3)];
            console.log("el usuario és: " + this.userAvatarType)
            this.form.avatar = "https://avatars.dicebear.com/api/" + this.userAvatarType + "/" + this.numRandom + ".svg?"

            // event.preventDefault()
            // alert(JSON.stringify(this.form))
            fetch("../leagueOfTrivialG2/public/api/store-user", {
                method: 'POST',
                body: JSON.stringify(this.form),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(response => response.json())
                .then(data => {
                    console.log(data)
                    this.errors = data;
                    if (this.errors['name']) {
                        this.$router.push({ path: '/' });
                    }
                });
        },
        hide: function () {
            console.log("click");
            if (!this.visibility) {
                this.inputType = "text";
                this.visibility = true;
            } else {
                this.inputType = "password";
                this.visibility = false;
            }
        }
    }
})

// -----------------Vue Routes-----------------
const routes = [
    {
        path: '/game/:mode',
        component: lobby,
        props: true
    },
    {
        path: '/register',
        component: register
    }, {
        path: '/',
        component: home,
        children: [
            {
                path: '/login',
                component: login,
                name: 'modalLogin'
            }
        ]
    }, {
        path: '/profile/:idUser',
        name: 'profile',
        component: profile,
        props: true
    }, {
        path: '/ranking',
        component: ranking
    }, {
        path: '/challenge',
        name: 'challenge',
        component: challenge,
        props: true
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
