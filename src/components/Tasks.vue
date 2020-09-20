<template>
  <div>
        <div v-if='loading' id='loading'>
            <div class='preloader-wrapper big active'>
                <div class="spinner-layer spinner-blue-only">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                </div><div class="gap-patch">
                    <div class="circle"></div>
                </div><div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
                </div>       
            </div><br>
            <p v-if='loading'>Loading</p>
        </div>       
        <div v-else>
            <p class='title'>For today</p>
            <div class='task' v-for="task in today" :key="task.id">
                <button v-if="!task.status" class='actionBtn blueColor' v-on:click="completeTask(task)"><i class="medium material-icons">check_box_outline_blank</i></button>
                <button v-else class='actionBtn blueColor'  v-on:click="decompleteTask(task)"><i class="medium material-icons">check_box</i></button>
                <p class='taskName ' v-if="!task.status">{{task.title}}</p>
                <p class='taskName completed' v-else>{{task.title}}</p>
                <button class='actionBtn redColor' v-on:click="deleteTask(task)">  <i class="medium material-icons">delete_forever</i></button>
            </div>
            <p class='title'>For later</p>
            <div class='task' v-for="task in later" :key="task.id">
                <button v-if="!task.status" class='actionBtn blueColor' v-on:click="completeTask(task)"><i class="medium material-icons">check_box_outline_blank</i></button>
                <button v-else class='actionBtn blueColor' v-on:click="decompleteTask(task)"><i class="medium material-icons">check_box</i></button>
                <p class='taskName ' v-if="!task.status">{{task.title}}</p>
                <p class='taskName completed' v-else>{{task.title}}</p>
                <button class='actionBtn redColor' v-on:click="deleteTask(task)">  <i class="medium material-icons">delete_forever</i></button>
            </div>
        </div>
  </div>
</template>

<script>
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import 'material-design-icons/iconfont/material-icons.css'
import {DataStore} from '@aws-amplify/datastore';
import {Task} from '../models/index'

export default {
    name: "Tasks",
    props: ["user", "date"],
    mounted(){
        this.getTasksDatabase(this.user, this.date);
    },
    data: function(){
        return {
            loading: true,
            today: [],
            later: []
        }
    },
    methods: {
        async getTasksDatabase(user, date) {
            this.today = [];
            this.later = [];
            try{
                let dividedActualDate = date.split("/");
                const tasks = await DataStore.query(Task, task => task.createdBy("eq", user));
                console.log(tasks);
                for(let i = 0 ; i < tasks.length ; i++){
                    let temporalDate = tasks[i].date;
                    let temporalDateDivide = temporalDate.split("/");
                    if(tasks[i].date == date){
                        this.today.push(tasks[i]);
                    }else if((Number(temporalDateDivide[0])>Number(dividedActualDate[0]))||(Number(temporalDateDivide[1])>Number(dividedActualDate[1]))||(Number(temporalDateDivide[2])>Number(dividedActualDate[2]))){
                        this.later.push(tasks[i]);
                    }
                }
                this.loading = false;
            }catch(error){
                console.log(error);
            }
        },
        async deleteTask(task){
            await DataStore.delete(task);
            this.getTasksDatabase(this.user,this.date);
        },
        async completeTask(task){
            await DataStore.save(Task.copyOf(task, updated => {
                updated.status = true;
            }));
            this.getTasksDatabase(this.user, this.date);
        },
        async decompleteTask(task){
            await DataStore.save(Task.copyOf(task, updated => {
                updated.status = false;
            }));
            this.getTasksDatabase(this.user, this.date);
        },
    },  
}
</script>

<style>
    #loading{
        margin-top: 25%;
        font-size: 26px;
        color: #4285f4;
    }
    .title{
        text-align: left;
        margin-left: 5%;
        margin-top: 50px;
        font-size: 36px;
        font-weight: bold;
    }
    .task{
        margin-top: 15px;
        width: 90%;
        z-index: 100;
        display: grid;
        grid-template-columns: 1fr 6fr 1fr;
        background: white;
        box-shadow:  5px 5px 10px #615e5d, 
             -5px -5px 10px #ffffff;
        margin-left: 5%;
        height: 110px;
        font-size: 36px;
    }
    .taskName{
        text-align: left;
        margin-left: 15px;
        font-weight: 600;
        margin-top: 25px;
    }
    .actionBtn{
        height: 110px;
        background: transparent;
        border: none;
        cursor: pointer;
    }
    .actionBtn:focus{
        background-color: transparent;
    }
    .redColor{
        color: rgb(85, 0, 0);
    }
    .blueColor{
        font-size: 16px!important;
        color: #12286A;
    }
    .completed{
        text-decoration: line-through;
        opacity: 0.3;
    }
</style>