<template>

    <div>   
        <p v-if="done" id='green'>{{stateMessage}}</p>
        <div v-if='loading' id='loading'>
            <div v-if='loading' class='preloader-wrapper big active'>
                <div v-if='!done' class="spinner-layer spinner-blue-only">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                </div><div class="gap-patch">
                    <div class="circle"></div>
                </div><div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
                </div>       
            </div><br>
            <p v-if='loading && !done'>Loading</p>
        </div>  
        
        <div v-else>
            <h1>Adding a new Task</h1>
            <div class="input-field col s6" id='name'>
            <input v-model="title" id="taskName" type="text" class="validate">
            <label for="taskName">Task Title</label>
            </div>    
            <div class="input-field col s6"  id="dateSpace">
                <label  id="taskDate" for='dateInput'>Task Date</label>
                <input id='dateInput' type="text" class="datepicker">
            </div><br>
            <a v-on:click="save()" id='save' class="waves-effect waves-light btn-large">Save</a>
        </div>
    </div>
</template>

<script>
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import 'material-design-icons/iconfont/material-icons.css'
import M from 'materialize-css'
import {DataStore} from '@aws-amplify/datastore';
import {Task} from '../models/index'
export default {
    name: "AddTask",
    data: function(){
        return{
            title: "",
            date: "",
            dateInstance: [],
            loading: false,
            stateMessage: "Completed!",
            done: false
        }
    },
    props: ["user"],
    mounted: function(){
        let elems = document.querySelectorAll('.datepicker');
        let dateOptions = {
            format: "d/m/yyyy"
        }
        this.dateInstance = M.Datepicker.init(elems, dateOptions);
    },
    methods: {
        async save(){
            this.loading = true;
            this.date = this.dateInstance[0].toString();
            try{
                await DataStore.save(
                    new Task({
                        title: this.title,
                        date: this.date,
                        status: false,
                        createdBy: this.user
                    })
                );
                this.done = true;
            }catch(error){

                this.stateMessage = "Error, try later."
            }
        }
    }
}
</script>

<style scoped>
    #loading{
        margin-top: 25%;
        font-size: 26px;
        color: #4285f4;
    }
    #green{
        margin-top: 25%;
        font-size: 26px;
        color: #4285f4;
    }
    #name{
        width: 35%;
        left: 5%;
        margin-top: 55px;
        font-size: 12px;
    }
    #name > label{
        font-size: 26px;
        margin-left: -15px;
    }
    #name > input{
        height: 50px;
        font-size: 22px;
    }
    #dateSpace{
        width: 35%;
        margin-left: 5%;
        margin-top: 35px;
    }
    #taskDate{
        text-align: left;
        float: left;
        margin-left: -15px;
        font-size: 26px;
        
    }
    #save{
        float: left;
        margin-left: 5%;
    }
    #dateInput{
        font-size: 22px;
    }
</style>