import React, { useState, useLayoutEffect } from 'react';
import { Flex, Menu } from 'antd';
import { FaLeaf } from 'react-icons/fa6';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selected, setSelected] = useState('1');

    useLayoutEffect(() => {
        const path = location.pathname;
        if (path.startsWith('/admin/category')) {
            setSelected('1');
        } else if (path.startsWith('/admin/ingredients')) {
            setSelected('2');
        } else if (path.startsWith('/admin/posts')) {
            setSelected('3');
        }
    }, [location.pathname]);

    const handleMenuItemClick = (key) => {
        setSelected(key);
        switch (key) {
            case '1':
                navigate('/admin/category');
                break;
            case '2':
                navigate('/admin/ingredients');
                break;
            case '3':
                navigate('/admin/posts');
                break;
            default:
                break;
        }
    };

    return (
        <>
            <Flex align='center' justify='center'>
                <div className='logo'>
                    <FaLeaf />
                </div>
            </Flex>

            <Menu
                mode='inline'
                selectedKeys={[selected]}
                className='menu-bar'
                onSelect={({ key }) => handleMenuItemClick(key)}
                items={[
                    {
                        key: '1',
                        icon: <FaLeaf />,
                        label: 'Category',
                    },
                    {
                        key: '2',
                        icon: <FaLeaf />,
                        label: 'Ingredients',
                    },
                    {
                        key: '3',
                        icon: <FaLeaf />,
                        label: 'Posts',
                    },
                ]}
            />
        </>
    );
};

export default Sidebar;