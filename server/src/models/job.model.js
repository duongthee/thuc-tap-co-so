import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    jobName : {type : String , required : true},
    note : {type : String , required : true},
    employees : [
        {
            employeeId : {type : mongoose.Schema.Types.ObjectId, ref : 'Employee'},
            salary : {type : Number , default : 0},
        }
    ],
    dayStart : {type : Date , required : true},
    dayEnd : {type : Date , required : true},
    startTime : {type : String , required : true},
    endTime : {type : String , required : true},
    place : {type : String , required : true},
    status : {type : String , enum : ['Chưa hoàn thành', 'Đã hoàn thành'] , default : 'Chưa hoàn thành'},
}, {timestamps : true});
const Job = mongoose.model('Job', jobSchema);
export default Job;

