/* eslit-disable */
import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import ActivityDetail from '../../Component/ActivityDetail';
import UserDetail from '../../Component/UserDetail';
import Report from '../Report/report'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const Dashboard = () => {

    const [collapsed, setCollapsed] = useState(false)
    const [selectedMenuItem, setSelectedMenuItem]= useState('1');


    const onCollapse = collapsed => {
        setCollapsed(collapsed)
    };
    const componentsSwtich = (key) => {
        switch (key) {
          case '1':
            return (<Report/>);
          case '2':
            return (<UserDetail/>);
          case '3':
            return (<ActivityDetail/>);
          default:
            break;
         }
        };
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={(e) => setSelectedMenuItem(e.key)}>
                    <Menu.Item key="1" icon={<DesktopOutlined />}>
                       Dashboard
                    </Menu.Item>
                    <Menu.Item key="2" icon={<PieChartOutlined />}>
                       User
                    </Menu.Item>
                    <Menu.Item key="3" icon={<DesktopOutlined />}>
                      Activity
                    </Menu.Item>
                </Menu>
            </Sider>
            { <Layout className="site-layout"> 
                {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}
                <Content style={{ margin: '0 16px' }}>
                    {componentsSwtich(selectedMenuItem)}
                </Content>
                <Footer style={{ textAlign: 'center' }}>Activity Tracker</Footer>
            </Layout> }
        </Layout>
    );
};

export default Dashboard;