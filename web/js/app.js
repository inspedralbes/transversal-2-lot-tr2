var tmp2 = null;
Vue.component('barra-nav', {
    async mounted() {
        await fetch(`../leagueOfTrivialG2/public/api/check-user`)
            .then(response => response.json())
            .then(data => {
                console.log("check user: ", data);
                tmp2 = data;
                if (data.userName) {
                    store = userStore();
                    store.setEstado(data);
                    store.logged = true;
                }
            });
    },
    template: `<div class="header1">
                        <div class="header1_div1">
                            <b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none" no-caret>
                                <template #button-content>
                                    <span class="header1_div1-element sr-only"><img src="../img/logo-sm.png" width="80px"></span>
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
            if (this.$router.history.current.path != '/') {
                this.$router.push({ path: '/' })
            }
        },
        goHome: function () {
            this.$router.push({ path: '/' })

        }
    }
});
Vue.component('foter', {
    template: `<div>
            <footer>
                <div class="footer-copyright">
                    <p>League Of Trivial @2022 made by: Mario Benavente, Sergi Cantero and Yolanda Moreno.</p><br>
                    <p>All questions and categories are the work of the creators of <em>The Trivia Api</em>. For any question about the rights click <a class="link-license" href="https://the-trivia-api.com/license/">here</a>.</p>
                </div>
            </footer>
    </div>`
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
                console.log(this.gameType);
            })
    },
    template: `<div>
                    <div v-show="!ready">
                        <div class="centerChallenge">
                            <div class="challenge__title">You are about to get into a challenge</div>
                            <div class="challenge">
                                <div class="challenge__challenger">
                                    <div class="perfilAvatar"
                                        :style="{backgroundImage: 'url('+this.infoChallenge.challengersImage+')'}"></div>
                                    {{this.infoChallenge.challengersName}} <br>
                                    no points yet
                                </div>
                                VS
                                <div class="challenge__challenged">
                                    <div class="perfilAvatar"
                                        :style="{backgroundImage: 'url('+this.infoChallenge.challengedsImage+')'}"></div>
                                    {{this.infoChallenge.challengedsName}} <br>
                                    {{this.infoChallenge.challengedsScore}} points
                                </div>
                            </div>
                            <div class="challenge__title">Are you sure about that?</div>
                            <button class="linkButton--small linkButton_goBack">
                                <router-link :to="{path: '/profile/' + this.infoChallenge.idChallenged}">Nevermind</router-link>
                            </button>
                            <button @click="ready=true" class="linkButton--small linkButton_startChallenge">Let's go</button>
                        </div>
                    </div>
                    <div v-show="ready">
                        <quiz :quiz="questions" :gameConfig="gameType" :challengeInfo="infoChallenge"></quiz>
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
                <div class="textoCentrado">
                    <img class="titulo" src="../img/fina.gif">
                </div>
                <div class="portada-principal" v-show="isLogged">
                    <div class="centerItems_portada">
                        <router-link class="linkButton_normal linkButton" to="/game/0">Random Quiz</router-link>
                        <br>
                        <router-link v-show="!dailyIsPlayed" class="linkButton_daily linkButton"to="/game/1">Daily Quiz</router-link>
                    </div>
                </div>
                <div class="portada-demo" v-show="!isLogged">
                    <div class="centerItems">
                        <router-link class="linkButton_demo linkButton" to="/game/2">Play Demo</router-link>
                    </div>
                </div>
                <foter></foter>
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
    mounted() {
        fetch(`https://the-trivia-api.com/api/categories`)
            .then((response) => response.json())
            .then((data) => {
                this.categories.key = Object.keys(data);
                this.categories.value = Object.values(data);
                this.categories.value[0].splice(0, 2);
                this.categories.value[1].splice(0, 2);
                this.categories.value[2].splice(this.categories.value[2].length - 2, 2);
                this.categories.value[8].splice(this.categories.value[8].length - 2, 2);
                this.categories.value[9].splice(this.categories.value[9].length - 2, 2);
                console.log(this.categories.value);
            });
        if (this.mode == 1) {
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
        }
        if (this.mode == 2) {
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
        }

    },
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
            categories: {
                key: "",
                value: ""
            }
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

    },
    template: `<div>
                <barra-nav></barra-nav>
                <div v-show="mode==0">
                    <div class="centerItems quiz-lobby" v-show="!checked">
                        <div class="quiz-lobby__titulo">Choose difficulty {{ gameType.difficulty }}</div>
                        <div class="input-container">
                            <div>
                                <input type="radio" id="easy" value="easy" v-model="gameType.difficulty">
                                <label class="easy-difficulty" for="easy">Easy</label>
                            </div>
                            <div v-if="getRupees>300">
                                <input type="radio" id="medium" value="medium" v-model="gameType.difficulty">
                                <label class="medium-difficulty" for="medium">Medium</label>

                            </div>
                            <div v-if="getRupees<=300">
                                <input type="radio" id="medium" value="medium">
                                <label class="medium-difficulty disabled">Medium</label>
                                <p class="alert-message">You need minimum 300 <span><img src="../img/rupia.png" width="10px"></span></p>
                            </div>
                            <div v-if="getRupees>600">
                                <input type="radio" id="hard" value="hard" v-model="gameType.difficulty">
                                <label class="hard-difficulty" for="hard">Hard</label>
                            </div>
                            <div v-if="getRupees<=600">
                                <input type="radio" id="hard" value="hard" v-model="gameType.difficulty">
                                <label class="hard-difficulty disabled" for="hard">Hard</label>
                                <p class="alert-message">You need minimum 600 <span><img src="../img/rupia.png" width="10px"></span></p>
                            </div>
                        </div>
                        <div class="quiz-lobby__titulo">Choose category {{ gameType.category }}</div>
                        <div class="input-container-categories">
                            <div v-for="(gameCategory,index) in categories.key">
                                <input type="radio" :id="categories.value[index]" :value="categories.value[index].join()" v-model="gameType.category">
                                <label :for="categories.value[index]" :style="{ 'background-image': 'url(../img/' + categories.value[index] + '.png)' }"></label>
                                {{gameCategory}}
                            </div>
                        </div>
                        <button class="quiz-lobby__button" @click="getQuiz();">Take Quiz!</button>
                    </div>
                    <div v-show="checked">
                        <quiz :quiz="questions" :gameConfig="gameType"></quiz>
                    </div>
                </div>
                <div v-show="mode==1">
                    <quiz :quiz="questions" :gameConfig="gameType"></quiz>
                </div>
                <div v-show="mode==2">
                    <quiz :quiz="questions" :gameConfig="gameType"></quiz>
                </div>
              </div>`,
    computed: {
        getRupees() {
            return userStore().loginInfo.rupees;
        }
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
            nCorrect: 0,
            counter: 150,
            countdown: null,
            tip: "",
            pointsUp: false
        }
    },
    created() {
        this.countdown = setInterval(this.decrementSeconds, 1000)
    },
    template: `<div>
                    <div v-show="!this.finished" style="text-align:center">
                        <p v-show="this.gameConfig.type!='demo'">Your score: {{this.score}}</p>
                        {{timeLeft}}<br>
                        <div v-for="(dades,index) in quiz" v-show="currentQuestion==index">
                            <p v-if="pointsUp" class="tips plustip">{{tip}}&nbsp<span><img src="../img/rupia.png" width="10px"></span></p>
                            <card :question="dades" :number="index" @changeQuestion="changeCard" @gameStatus="saveAnswer"></card>    
                            <br><br>
                        </div>
                    </div>
                    <div v-show="this.finished && this.gameConfig.type=='normal' || this.finished && this.gameConfig.type=='daily'" >
                        <div class="textoCentrado">
                            <h2 class="textoFinQuiz">Your score was:<br>{{nCorrect}}/10 in {{timeLeft}} seconds<br><br><br>+ {{score}} points</h2>
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
                        <button><router-link :to="{ name: 'answers', params: { quizQuestions: this.quiz } }">See answers</router-link></button>
                        <button @click="finishGame" class="button-home">Home</button>
                        <div class="centerItems">
                            <div class="linkButton">Your Profile</div>
                        </div>
                    </div>
                    <div v-show="this.finished && this.gameConfig.type=='demo'">
                        <div class="textoCentrado">
                            <h2 class="textoFinQuiz">Your score was:<br>{{nCorrect}}/10 in {{timeLeft}} seconds</h2>
                        </div>
                        <div class="centerItems">
                            <h4>Would you like to see more? <router-link to="/register" style="text-decoration: none;">JOIN THE LEAGUE NOW!</router-link></h4>
                            <button @click="finishGame" class="button-home">Home</button>
                        </div>
                    </div>
                    <div v-if="this.finished && this.gameConfig.type=='challenge'">
                        <div class="textoCentrado">
                            <h2 class="textoFinQuiz">You've finished the challenge!</h2>
                        </div>
                        <div class="centerItems">
                            <h4>The results are ...</h4>
                                <div class="centerChallenge">
                                        <div class="challenge">
                                            <div class="challenge__challenger">
                                                <i v-if="winner==this.challengeInfo.idChallenger" class="bi bi-trophy-fill trophy"></i>
                                                <div v-else class="challenge__challenger__loser"></div>
                                                <div class="perfilAvatar" :style="{backgroundImage: 'url('+this.challengeInfo.challengersImage+')'}"></div>
                                                {{this.challengeInfo.challengersName}} <br>
                                                {{score}} points
                                            </div>
                                            <div style="font-size: 30px">VS</div>
                                            <div class="challenge__challenged">
                                                <i v-if="winner==this.challengeInfo.idChallenged" class="bi bi-trophy-fill trophy"></i> 
                                                <div v-else class="challenge__challenger__loser"></div>
                                                <div class="perfilAvatar" :style="{backgroundImage: 'url('+this.challengeInfo.challengedsImage+')'}"></div>
                                                {{this.challengeInfo.challengedsName}} <br>
                                                {{this.challengeInfo.challengedsScore}} points
                                            </div>
                                        </div>
                                        <br>
                                        <div v-show="winner==this.challengeInfo.idChallenger" class="challenge__title">Congrats, you've won <i class="bi bi-emoji-sunglasses-fill" style="color:white"></i></div>
                                        <div v-show="winner==this.challengeInfo.idChallenged" class="challenge__title">Oh, no... You've lost <i class="bi bi-emoji-frown-fill" style="color:white"></i></div>
                                        <div v-show="winner==0" class="challenge__title">IT'S A TIE <i class="bi bi-emoji-dizzy-fill" style="color:white"></i></div>
                                    </div>
                                </div> 
                            <button @click="finishGame" class="button-home">Home</button>
                        </div>
                    </div>
                </div>`,
    methods: {
        decrementSeconds: function () {
            if (this.counter > 0) {
                this.counter--
                return
            }
            if (this.counter === 0) {
                this.finished = true;
                clearInterval(this.countdown)
            }
        },
        saveAnswer: function (respuesta, index) {
            console.log(this.challengeInfo);
            this.selectedAnswers[index] = respuesta;
            if (respuesta == this.quiz[index].correctAnswer) {
                this.nCorrect++;
                if (this.gameConfig.type == "normal" || this.gameConfig.type == "challenge") {
                    console.log("CORRECTA");
                    switch (this.gameConfig.difficulty) {
                        case "easy": this.score += 100;
                            this.pointsUp = true;
                            this.tip = "+100";
                            console.log("easy score: " + this.score)
                            break;
                        case "medium": this.score += 200;
                            this.pointsUp = true;
                            this.tip = "+200";

                            console.log("medium score: " + this.score)
                            break;
                        case "hard": this.score += 300;
                            this.pointsUp = true;
                            this.tip = "+300";
                            console.log("hard score: " + this.score)
                            break;
                    }
                } else if (this.gameConfig.type == "daily") {
                    this.score += 10;
                    this.tip = "+10";
                    this.pointsUp = true;
                }
            } else {
                console.log("MAL");
            }
        },
        changeCard: function () {
            this.currentQuestion++;
            this.pointsUp = false;
            console.log(this.selectedAnswers);
            if (this.selectedAnswers.length == this.quiz.length) {
                if (this.gameConfig.type == "challenge") {
                    if (this.score > this.challengeInfo.challengedsScore) {
                        this.winner = this.challengeInfo.idChallenger;
                    } else if (this.score < this.challengeInfo.challengedsScore) {
                        this.winner = this.challengeInfo.idChallenged;
                    } else {
                        this.winner = 0;
                    }
                }
                this.finished = true;
                clearInterval(this.countdown)

            }
            console.log(this.finished);
            if (this.finished) {
                this.saveGame();
            }
        },
        saveGame: function () {
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
                userStore().loginInfo.rupees += this.score;
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
        },
        finishGame() {
            this.finished = false;
            this.$router.push({ path: '/' })
        }
    },
    computed: {
        getUser() {
            return userStore().loginInfo.id;
        },
        timeLeft() {
            return this.counter;
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
                @click="checkAnswer(respuesta['text'], number, index);">{{respuesta['text']}}</button>
        </div>
        <div v-show="question.done">
            <b-button class="next" @click="$emit('changeQuestion')">NEXT<span class="arrow"></span></b-button>
        </div>
    </div>
</div>`,
    methods: {
        checkAnswer: function (respuesta, index, numResposta) {
            this.question.done = false
            this.activeButton = numResposta;
            if (!this.question.done) {
                this.question.done = true;
                this.$forceUpdate();
                this.$emit('gameStatus', respuesta, index);
            }
            console.log("LA RESPOSTA ES : " + numResposta);
        },
    }
})
const answers = Vue.component('answers', {
    props: ['quizQuestions'],
    mounted() {
        console.log(this.quizQuestions);
    },
    template: `<div>
                    <h1>QUIZ SOLUTIONS</h1>
                    <div v-for="(question, index) in quizQuestions">
                        <h3>{{index+1}}. {{question.question}}</h3>
                        <ul v-for="(respuesta,num) in question.answers">
                            <li :class="{'wrongAnswer': !respuesta['estat'], 'correctAnswer': respuesta['estat']}">{{respuesta['text']}}</li>
                        </ul>
                        <br>
                    </div>
                    <button class="button-home"><router-link to="/">Home</router-link></button>
                </div>`
});
const profile = Vue.component("profile", {
    props: ['idUser'],
    data: function () {
        return {
            user: '',
            loadedData: false,
            infoChallenge: [],
            alert: false,
            change: false,
            message: '',
            categories: [],
            edit: false,
            categoriesTag: [],
            quant: []
        }
    },
    template: `<div>
                    <barra-nav></barra-nav>
                    <div v-if="idUser==getUser" class="header2" id="profile_Header">
                        <div class="header2_div2">
                        <b-button @click="editProfile">Edit Profile</b-button>
                        </div>
                    </div>
                    <div v-if="loadedData">
                        <div class="centerItems" id="gridPerfil">
                            <div class="perfilAvatar" :style="{backgroundImage: 'url('+this.user.info[0].imageUrl+')'}"></div>
                            <div v-if="idUser==getUser">
                                <button @click="changeAvatar">Change Avatar</button>
                                <p v-if="alert">Remember to save your changes</p>
                                <p v-if="change">{{this.message}}</p>
                                <button @click="save">SAVE</button>
                            </div>
                            <div>{{this.user.info[0].rupees}} <span><img src="../img/rupia.png" width="10px"></span></div>
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
                                {{this.user.info[0].rupees}} / 750
                            </div>
                            <div class="gridDeNiveles">
                                <div class="nivelActual">Platinum</div>
                                <div class="nivelSiguiente">Master</div>
                            </div>
                            <div class="categoriesPlayed">
                                <div v-for="(category,index) in user.quantCateg" class="categories-container" :style="{ 'background-image': 'url(../img/' + category.category + '.png)' }"><p>{{categoriesTag[index]}}<br>{{category.quant}}</p></div>
                            </div>
                            <div class="lastPlayed">
                                <p>Last Played</p><br>
                                <table>
                                    <tr v-for="(game,index) in user.historic">
                                        <td>{{game.date}}</td>
                                        <td>{{game.category}}</td>
                                        <td>{{game.difficulty}}</td>
                                        <td>{{game.puntuacio}}</td>
                                        <td v-if="idUser!=getUser && isLogged"><img src="../img/challenge.png" width="20px" @click="startChallenge(index)"></td>
                                    </tr>
                                </table>
                            </div>
                            <div class="chart">
                                <canvas id="myChart"></canvas>
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
            console.log(this.user)


            for (let i = 0; i < this.user.quantCateg.length; i++) {
                this.categoriesTag[i] = this.user.quantCateg[i].category
                this.quant[i] = this.user.quantCateg[i].quant
                switch (this.categoriesTag[i]) {
                    case "arts_and_literature": this.categoriesTag[i] = "Arts & Literature"
                        break;
                    case "film_and_tv": this.categoriesTag[i] = "Film & TV"
                        break;
                    case "food_and_drink": this.categoriesTag[i] == "Food & Drink"
                        break
                    case "general_knowledge": this.categoriesTag[i] = "General Knowledge"
                        break
                    case "geography": this.categoriesTag[i] = "Geography"
                        break
                    case "history": this.categoriesTag[i] = "History"
                        break
                    case "music": this.categoriesTag[i] = "Music"
                        break
                    case "science": this.categoriesTag[i] = "Science"
                        break
                    case "society_and_culture": this.categoriesTag[i] = "Culture"
                        break
                    case "sport_and_leisure": this.categoriesTag[i] = "Sport & Leisure"
                }
            }

            setTimeout(() => {
                ctx = document.getElementById('myChart');
                console.log("CHART IS: " + ctx)
                tmp_chart = new Chart(ctx, {
                    //tmp_chart = new Chart("#myChart", {
                    type: 'pie',
                    data: {
                        labels: this.categoriesTag,
                        datasets: [{
                            label: 'Times played',
                            data: this.quant,
                            borderWidth: 3
                        }],
                    },
                });
            }, 100);
        });
    },
    methods: {
        startChallenge(idGame) {
            this.infoChallenge.idChallenger = userStore().loginInfo.id;
            this.infoChallenge.challengersName = userStore().loginInfo.userName;
            this.infoChallenge.challengersImage = userStore().loginInfo.imageUrl;
            this.infoChallenge.idChallenged = this.idUser;
            this.infoChallenge.challengedsName = this.user.info[0].userName;
            this.infoChallenge.challengedsImage = this.user.info[0].imageUrl;
            this.infoChallenge.challengedsScore = this.user.historic[idGame].puntuacio;
            this.infoChallenge.idGame = this.user.historic[idGame].idGame;
            this.infoChallenge.category = this.user.historic[idGame].category;
            this.infoChallenge.difficulty = this.user.historic[idGame].difficulty;
            console.log(this.infoChallenge);
            this.$router.push({ name: 'challenge', params: { infoChallenge: this.infoChallenge } })
        },
        changeAvatar: function () {
            let num = 0;
            userAvatar = '';
            this.alert = true;
            this.change = false;
            type = ["bottts", "croodles", "micah"];
            num = Math.floor(Math.random() * 1000000);
            console.log("el numero random es " + num)
            userAvatar = type[Math.floor(Math.random() * 3)];
            console.log("el usuario és: " + userAvatar)
            this.user.info[0].imageUrl = "https://avatars.dicebear.com/api/" + userAvatar + "/" + num + ".svg?"
        },
        editProfile: function () {
            console.log("VOY A EDITAR");
            this.edit = true;
        },
        save: function () {
            let form = {
                idUser: this.idUser,
                imageUrl: this.user.info[0].imageUrl
            }
            fetch(`../leagueOfTrivialG2/public/api/update-picture`, {
                method: 'POST',
                body: JSON.stringify(form),
                headers: {
                    "Content-type": "application/json;charset=UTF-8"
                }
            }).then(response => response.json())
                .then(data => {
                    console.log(data)
                    this.message = data;
                    this.alert = false;
                    this.change = true;
                    userStore().loginInfo.imageUrl = this.user.info[0].imageUrl
                });
        }
    },
    computed: {
        getUser() {
            return userStore().loginInfo.id;
        },
        isLogged() {
            return userStore().logged;
        }
    }
})
const login = Vue.component("login", {
    // alvaro.alumnes.inspedralbes.cat&username=user&pwd=1234
    props: [],
    data: function () {
        return {
            //Creamos objeto para tener la informacion del usuario junta.
            processing: false,
            form: {
                email: '',
                password: ''
            },
            perfil: {},
            errors: [],
            visibility: false,
            inputType: "password"
        }
    },
    template: `<div>
                <b-modal class="screen" id="login" title="We are happy that you are back!">
                <div v-show="!isLogged" @keyup.enter="login">
                    <div class="login__field">
                        <i class="login__icon bi bi-person-fill"></i>
                        <b-form-input id="input-2" class="login__input" v-model="form.email"
                            placeholder="Write your email..." required>
                        </b-form-input>
                    </div>
                    <div class="login__field">
                        <i class="login__icon bi bi-lock-fill"></i>
                        <b-form-input id="input-3" class="login__input"  v-model="form.password" :type="this.inputType"
                            placeholder="Write your password..." required></b-form-input>
                            <i class="login__icon--hide bi bi-eye" @click="hide"></i>
                    </div>
                    <span class="error_login">{{this.errors['error']}}</span><br>
                    <br>
                    Don't have an account yet?<router-link to="/register" style="text-decoration: none;">
                        <p class="link-register"> Join the league now!</p>
                    </router-link> <br>
                </div>
                <template #modal-footer>
                    <div v-show="!isLogged">
                        <div v-show="!processing" class="boton">
                            <button v-b-modal.modal-close_visit class="login-button" @click="login">Login</button>
                        </div>
                        <div v-show="processing" class="boton">
                        <button v-b-modal.modal-close_visit class="login-button" disabled>
                                <b-spinner small type="grow"></b-spinner>
                                Loading...
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
                            <form class="login" @keyup.enter="send">
                                <div class="login__title">JOIN THE LEAGUE!</div>
                                <span>{{this.errors['errors']}}</span>
                                <div class="register__form">
                                    <div class="login__field">
                                        <i class="login__icon bi bi-info-circle-fill"></i>
                                        <input type="text" class="login__input" v-model="form.name" @keyup="validarName"
                                            placeholder="Name">
                                        <div v-if="validName && form.name.length>0" class="box">
                                            <p style="color:green;">Valid name :)</p>
                                        </div>
                                        <div v-if="!validName && form.name.length>0" class="box">
                                            <p style="color:red;">Name must contain at least 3 characters.</p>
                                        </div>
                                    </div>
                                    <div class="login__field">
                                        <i class="login__icon bi bi-envelope-fill"></i>
                                        <input type="email" class="login__input" v-model="form.email" @keyup="validar"
                                            placeholder="Email">
                                        <div v-show="validEmail && form.email.length>0">
                                            <p style="color:green;">Valid email :)</p>
                                        </div>
                                        <div v-show="!validEmail && form.email.length>0">
                                            <p style="color:red;">Invalid Email :(</p>
                                        </div>
                                    </div>
                                    <div class="login__field">
                                        <i class="login__icon bi bi-person-fill"></i>
                                        <input type="text" class="login__input" v-model="form.username" @keyup="validarUserName"
                                            placeholder="Username">
                                        <div v-show="validUserName && form.username.length>0">
                                            <p style="color:green;">Valid user name :)</p>
                                        </div>
                                        <div v-show="!validUserName && form.username.length>0">
                                            <p style="color:red;">Name can only contain alphanumeric characters.</p>
                                        </div>
                                    </div>
                                    <div class="login__field">
                                        <i class="login__icon bi bi-lock-fill"></i>
                                        <input :type="this.inputType" class="login__input" v-model="form.password" @keyup="validarPass"
                                            placeholder="Password here">
                                        <i class="login__icon--hide bi bi-eye" @click="hide"></i>

                                        <div v-show="validPass && form.password.length>0">
                                            <p style="color:green;">Valid Password :)</p>
                                        </div>
                                        <div v-show="!validPass && form.password.length>0">
                                            <p style="color:red;">Password requires minimum eight characters, at least one letter and
                                                one
                                                number.</p>
                                        </div>
                                    </div>
                                </div>
                                <b-button class="login-button" @click="send">Sign Up</b-button>
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
        path: '/answers',
        name: 'answers',
        component: answers,
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
    },

    created() {
        window.addEventListener('beforeunload', function (event) {
            event.preventDefault();
            event.returnValue = "Don't leave!";
            return "Don't leave!";
        });

    },
})
