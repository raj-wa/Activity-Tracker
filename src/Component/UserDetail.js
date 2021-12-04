/* eslit-disable */
import React, { useState } from "react";
import 'antd/dist/antd.css';
import { Input, Button, Card, message } from 'antd';
import axios from 'axios';
import { apiKey } from "../config";

const UserDetail = () => {

    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");

    const createUser = () => {



        if (userName == undefined || userName == "") {
            message.error("Please enter user name")

            return;
        }

        if (userEmail == undefined || userEmail == "") {
            message.error("Please enter user Email")
            return;
        }



        if (userEmail != "" && userName != "") {
            const userObject = {
                "name": userName,
                "email": userEmail
            }

            axios.post(apiKey + 'user/create', userObject).then((obj) => {
                localStorage.setItem("UserUID", obj.data._id);
                localStorage.setItem("UserName", obj.data.name)
                localStorage.setItem("UserEmail", obj.data.email)
                window.location.reload();
            }).catch((err) => {
                console.error("err :: ", err)
            })
        }else{
            message.error("something want wrong")
        }
    }

    const onUserNameChange = (e) => {
        if (localStorage.getItem("UserUID") == null)
            setUserName(e.target.value);
    }

    const onUserEmailChange = (e) => {
        if (localStorage.getItem("UserUID") == null)
            setUserEmail(e.target.value);
    }

    return (
        <div style={{ marginLeft: '20px', marginTop: '20px' }}>
            <div style={{ display: 'flex' }}>
                {localStorage.getItem("UserUID") == null ? <>
                    <div style={{ marginLeft: '20px', display: 'flex', width: '30%' }}>
                        {localStorage.getItem("UserUID") != null && "User Name "}
                        <Input value={localStorage.getItem("UserUID") ? localStorage.getItem("UserName") : userName} onChange={onUserNameChange} placeholder="User Name" />
                    </div>
                    <div style={{ marginLeft: '20px', display: 'flex', width: '30%' }}>
                        {localStorage.getItem("UserUID") != null && "User Email "}
                        <Input value={localStorage.getItem("UserUID") ? localStorage.getItem("UserEmail") : userEmail} onChange={onUserEmailChange} placeholder="Email" />
                    </div>
                    <Button type="primary" onClick={createUser}>Add</Button>
                </> :
                    <Card title={localStorage.getItem("UserName")} style={{ width: 300 }}>
                        <p>{localStorage.getItem("UserEmail")}</p>
                    </Card>
                }
            </div>
        </div>
    );
};

export default UserDetail;