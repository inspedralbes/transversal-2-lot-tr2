import './bootstrap';

Vue.component('quiz-button', {
    data: function () {
        return {
            preguntes: [],
            partida: {
                nRespostes: 0,
                respostes: [],
            },
            correctes: []
        }
    },
    mounted() {
        fetch('https://the-trivia-api.com/api/questions?categories=film_and_tv&limit=10&difficulty=easy')
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                this.preguntes = data;
            });
    },
    template: `<div>
                <h1>Quiz</h1><br>
                    <div v-for="(dades,index) in preguntes">
                            <h2> {{dades.question}}</h2>
                            <div v-for="respuesta in dades.incorrectAnswers">
                                <b-button style="width:100%" variant="outline-primary">{{respuesta}}</b-button>
                            </div>
                            <b-button style="width:100%" variant="outline-primary">{{dades.correctAnswer}}</b-button>
                        <br><br>
                    </div>
                </div>`,
});

var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!'
    }
})
