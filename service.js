
const todoOperations = {
    

    
    tasks:[], 
    getTasks(){
return this.tasks;
    },
    getTotal(){
        return this.tasks.length;
    },
    addTask(task){
        task.isMarked = false;
        this.tasks.push(task);
    },
    toggleTask(id){
       const taskObject =  this.tasks.find(task=>task.id == id);
       taskObject.isMarked = !taskObject.isMarked;
    },
    markCount(){
           return this.tasks.filter(task=>task.isMarked).length; 
    },
    unmarkCount(){
        return this.tasks.length - this.markCount();
    },

    removeTask(){
        this.tasks = this.tasks.filter(task=>!task.isMarked);
    },
    searchTask(id){
        return this.tasks.find(task => task.id == id)

    },
    clearAllTasks(){
this.tasks = [];
    },
    updateTask(){


    },
    sortTask(){

    }
}
export default todoOperations;