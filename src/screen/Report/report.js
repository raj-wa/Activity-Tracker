import React, { useEffect, useRef,useState } from "react";
import * as d3 from 'd3'
import DonutChart from './donutchart';
import axios from "axios";
import moment from "moment";
import { apiKey } from "../../config";




const donutData = [
    {name: "<5", value: 19},
    {name: "5-9", value: 20},
    {name: "10-14", value: 19},
    {name: "15-19", value: 24},
    {name: "20-24", value: 22},
    {name: "25-29", value: 29},
    {name: "30-34", value: 22},
    {name: "35-39", value: 18},
    {name: "40-44", value: 23},
    {name: "45-49", value: 19},
    {name: "50-54", value: 16},
    {name: "55-59", value: 19},
    {name: "60-64", value: 28},
    {name: "65-69", value: 17},
    {name: "70-74", value: 20},
    {name: "75-79", value: 17},
    {name: "80-84", value: 18},
    {name: "≥85", value: 21}
   ]

const Report = () => {
    const [currentWeek, setCurrentWeek] = useState({});
    const [currentDate, setCurrentDate] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [activityData, setActivityData] = useState([]);
    const [activityName, setActivityName] = useState();
    const [week, setWeek] = useState(0);

    useEffect(() => {
        getUsetActivity();
        getCurrentWeek();
        setCurrentDate(moment().startOf('day').valueOf())
    }, [])

    useEffect(() => {
        getCurrentWeek()
    }, [week])

    const getUsetActivity = () => {

        const activityObj = {
            "userId": localStorage.getItem("UserUID")
        }

        axios.post(apiKey + 'activity', activityObj).then((res) => {
            setActivityData(res.data);
        }).catch((err) => {
            console.error("err :: ", err)
        })
    }

    const getCurrentWeek = () => {
        var currentDate = moment();

        var weekStart = currentDate.clone().startOf('isoWeek').subtract((week * 7), 'days');

        var days = [];

        let dayObj = {}

        for (var i = 0; i <= 6; i++) {
            dayObj = {
                dateOfDay: moment(weekStart).add(i, 'days').format("YYYY MMMM Do,dddd"),
                timeStamp: moment(weekStart).add(i, 'days').valueOf()
            }
            days.push(dayObj);
        }
        setCurrentWeek(days);
    }

  
    return (
        <div>
          <DonutChart data={donutData}  />
        </div>
    );
};

export default Report;