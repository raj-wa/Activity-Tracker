import React, { useEffect, useRef, useState } from "react";
import DonutChart from './donutchart';
import axios from "axios";
import moment from "moment";
import { apiKey } from "../../config";
import './report.css'


const Report = () => {
    const [activityData, setActivityData] = useState([]);
    const [chartData, setChartData] = useState([])
    const [currentWeek, setCurrentWeek] = useState({});
    const [currentDate, setCurrentDate] = useState();
    const [week, setWeek] = useState(0);

    const activityArray = []

    useEffect(() => {
        getUsetActivity();
        getCurrentWeek();
        setCurrentDate(moment().startOf('day').valueOf())
    }, [])
    useEffect(() => {
        getCurrentWeek()
    }, [week])


    useEffect(() => {
        createObjectForChart();
    }, [activityData, currentWeek])

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

    const getUsetActivity = () => {

        const activityObj = {
            "userId": localStorage.getItem("UserUID")
        }

        axios.post(apiKey + 'activity', activityObj).then((res) => {
            setActivityData(res.data);
            console.log("res.data :: ", res.data)

            let tmpValue = 10;

            res.data.map((item) => {
                tmpValue = tmpValue + 5
                activityArray.push({
                    name: item.title,
                    value: tmpValue
                })
            })
            console.log('activty arrat', activityArray);
            setChartData(activityArray)
        }).catch((err) => {
            console.error("err :: ", err)
        })
    }

    let matchedData = []

    const createObjectForChart = () => {

        let finalArray = []
        let tmpObject = {}

        if (activityData.length > 0) {
            activityData.map((activityDataObj, index) => {

                if (currentWeek.length > 0 && activityDataObj.activity.length > 0) {

                    currentWeek.map((currentWeekObj, currentWeekIndex) => {
                        matchedData = activityDataObj.activity.filter((activityObj, activityIndex) => activityObj.date == currentWeekObj.timeStamp.toString() && activityObj.isTrue);
                        if (matchedData.length > 0) {

                            if (finalArray.filter((finalArrayObj) => finalArrayObj.name == activityDataObj.title).length > 0) {
                                finalArray.map((finalArrayObj) => {
                                    if (finalArrayObj.name == activityDataObj.title) {
                                        finalArrayObj.value = finalArrayObj.value + 1;
                                    }
                                })

                            } else {
                                tmpObject = {
                                    name: activityDataObj.title,
                                    value: 1
                                }
                                finalArray.push(tmpObject)
                            }



                        }
                    })

                }
            })

        }
        setChartData(finalArray)
        console.log("finalArray :: ", finalArray)
    }


    return (
        <div className="dashboard-report">
            {chartData.length > 0 &&
                <DonutChart data={chartData} />
            }
        </div>
    );
};

export default Report;