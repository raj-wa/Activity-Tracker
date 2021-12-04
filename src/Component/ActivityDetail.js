/* eslit-disable */
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Input, Button, Modal, message, Layout, Menu, Table } from 'antd';
import moment from "moment";
import './ActivityDetail.css';
import axios from "axios";
import { apiKey } from "../config";
import { CheckCircleTwoTone, EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import { Bar } from "react-chartjs-2";
import { PoweroffOutlined } from '@ant-design/icons'



const ActivityDetail = () => {


    const [focusActivity, setFocusActivity] = useState(-1);
    const [isEditData, setIsEditData] = useState(false);
    const [isDeleteData, setIsDeleteData] = useState(false);

    const [userData, setUserData] = useState();
    const [currentWeek, setCurrentWeek] = useState({});
    const [currentDate, setCurrentDate] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [activityData, setActivityData] = useState([]);
    const [activityName, setActivityName] = useState();
    const [week, setWeek] = useState(0);



    const [activityEditData, setActivityEditData] = useState({});

    useEffect(() => {
        getUsetActivity();
        getCurrentWeek();
        setCurrentDate(moment().startOf('day').valueOf())

        setUserData(localStorage.getItem("UserUID"))
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
                dateOfDay: moment(weekStart).add(i, 'days').format("DD-MM-YYYY,dddd"),
                timeStamp: moment(weekStart).add(i, 'days').valueOf()
            }
            days.push(dayObj);
        }
        setCurrentWeek(days);
    }


    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        if (!activityName || activityName === "") {
            message.error("Please enter activity name")
            return;
        }

        const handelSave = {
            "userId": localStorage.getItem("UserUID"),
            "title": activityName,
        }

        axios.post(apiKey + 'activity/create', handelSave).then((res) => {
            if (res.data.error) {
                if (res.data.error == "User Not Found") {
                    localStorage.removeItem("UserUID");
                    localStorage.removeItem("UserName");
                    localStorage.removeItem("UserEmail");
                    setUserData("");
                    message.error(res.data.error)
                } else {
                    message.error(res.data.error)
                }
            }
            else {
                const tmpObj = activityData;
                tmpObj.push(res.data)
                setActivityData(tmpObj);
                setIsModalVisible(false);
                setActivityName("");
            }
        }).catch((err) => {
            console.error("err :: ", err)
        })
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onChangeActivityName = (e) => {
        setActivityName(e.target.value);
    }


    const updateActivity = (currDate, activityId) => {

        if (currDate.timeStamp > currentDate) {
            message.warning("You can not add that track before that day");
            return;
        } else {

            let singleActivity = activityData.filter((obj) => obj._id == activityId)

            let activityDetailId = singleActivity[0].activity.filter((obj) => obj.date == currDate.timeStamp)

            const sendDataService = {
                "activityId": activityId,
                "activityDetailId": activityDetailId.length > 0 ? activityDetailId[0]._id : "",
                "date": currDate.timeStamp,
                "isTitleUpdate": false,
                "isTitleName": ""
            }

            axios.put(apiKey + "activity/update", sendDataService).then(res => {
                getUsetActivity();
            }).catch(err => {
                console.error(err);
            })
        }
    }
    const weekChange = (valueRef) => {

        if (valueRef == "decress") {
            setWeek(week + 1)
        }

        if (valueRef == "incress") {
            setWeek(week - 1)
        }

        if (valueRef == "Equal") {
            setWeek(0)
        }

    }

    const editbuttonShow = (activityIndex, activityObj) => {
        console.log(activityObj.title)
        setFocusActivity(activityObj._id);
    }

    const onEditButtonClick = (activiyData) => {
        setActivityEditData(activiyData);
        setActivityName(activiyData.title);
        setIsEditData(!isEditData);
    }

    const onDeleteButtonClicl = (activiyData) => {
        setActivityEditData(activiyData);
        setIsDeleteData(!isEditData);
    }

    const handleEditCancel = () => {
        setActivityName("");
        setIsEditData(false);
    }
    const handleEditOk = () => {


        if (activityName != activityEditData.title) {
            const sendDataService = {
                "activityId": activityEditData._id,
                "isTitleUpdate": true,
                "isTitleName": activityName
            }

            axios.put(apiKey + "activity/update", sendDataService).then((res) => {
                getUsetActivity();
                setActivityName("");
                setIsEditData(false);
            }).catch((err) => {
                console.error("Err :: ", err)
            })
        } else {
            message.warning("Activity Name Not change");
        }


    }
    const handleDeleteOk = () => {

        const sendDataService = {
            "activityId": activityEditData._id,
        }
        axios.delete(apiKey + "activity/" + activityEditData._id).then((res) => {
            getUsetActivity();
            setActivityName("");
            setIsEditData(false);
        }).catch((err) => {
            console.error("Err :: ", err)
        })


        setIsDeleteData(false);
    }

    const handleDeleteCancel = () => {
        setIsDeleteData(false);
    }

    return (
        <>
            <div className="head_name">
                <h2 className="head_title">
                    Activity Details
                </h2>
            </div>

            <div className="pagination_section">
                <div>
                    {userData &&
                        <Button type="primary" style={{ background: '#152b40' }} onClick={showModal} >Add</Button>
                    }
                </div>
                <div>
                    <Button type="primary" style={{ background: '#152b40' }} onClick={() => weekChange("decress")} >Previous</Button>
                    <Button type="primary" style={{ background: '#152b40' }} onClick={() => weekChange("Equal")} >Current Date</Button>
                    <Button type="primary" style={{ background: '#152b40' }} onClick={() => weekChange("incress")} >Next</Button>
                </div>

            </div>
            <div className="activity_list_section" >
                {
                    <Row gutter={16} style={{ fontSize: '20px', fontWeight: 'bold' }} >
                        <Col className="gutter-row" span={3}>
                        </Col>
                        {currentWeek.length > 0 && currentWeek.map((weekObj, index) => {
                            return (
                                <Col className="gutter-row" span={3}>
                                    <div className={`cus_main ${weekObj.timeStamp == currentDate ? 'border' : null}`}>
                                        {weekObj.dateOfDay}
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>
                }

                <div>
                    {activityData.length > 0 && activityData.map((activityObj, activityIndex) => {
                        return (
                            <Row gutter={16}>
                                <Col className="gutter-row cus_mg" span={3} onMouseEnter={() => editbuttonShow(activityIndex, activityObj)} onMouseLeave={() => {
                                    setFocusActivity(-1);
                                }}>
                                    <div className="inn_mg">
                                        {activityObj._id === focusActivity &&
                                            <Button type="primary" icon={<EditOutlined style={{ height: '30px' }} />} style={{ height: '20px', width: '20px' }} onClick={() => onEditButtonClick(activityObj)} />
                                        }
                                        {activityObj._id === focusActivity &&
                                            <Button danger icon={<DeleteOutlined height={20} width={20} />} style={{ height: '20px', width: '20px', marginLeft: '5px' }} onClick={() => onDeleteButtonClicl(activityObj)} />
                                        }
                                        {activityObj.title}
                                    </div>
                                </Col>
                                {currentWeek.length > 0 && currentWeek.map((weekObj, index) => {
                                    return (
                                        <Col className="gutter-row" span={3}>
                                            <div className={`
                                    ${activityObj.activity &&
                                                    activityObj.activity.filter((obj) => obj.isTrue && obj.date == weekObj.timeStamp).length > 0 ? 'check_open' : ''}`}
                                                id="check_bg" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                                <CheckCircleTwoTone twoToneColor={`${activityObj.activity && activityObj.activity.filter((obj) => obj.isTrue && obj.date == weekObj.timeStamp).length > 0 ? '#52c41a' : '#808080'}`} onClick={() => updateActivity(weekObj, activityObj._id)} style={{ fontSize: 28, marginTop: 6, marginBottom: 6 }}></CheckCircleTwoTone>
                                            </div>
                                        </Col>
                                    )
                                })}
                            </Row>
                        )
                    })}
                </div>

                <Modal title="Add Activity" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <Input value={activityName} onChange={onChangeActivityName} placeholder="Activity Name" />
                </Modal>

                <Modal title="Edit Activity" visible={isEditData} onOk={handleEditOk} onCancel={handleEditCancel}>
                    <Input value={activityName} onChange={onChangeActivityName} placeholder="Activity Name" />
                </Modal>

                <Modal title="Delete Activity" visible={isDeleteData} onOk={handleDeleteOk} onCancel={handleDeleteCancel}>
                    Are you sure You want to remove  <b>{activityName}</b> Activity?
                </Modal>
            </div>
        </>
    );
};

export default ActivityDetail;