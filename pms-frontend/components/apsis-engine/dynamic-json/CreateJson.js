import { React, useState, useEffect } from "react";
import {
    Button,
    Form,
    Row,
    Col,
    Input,
    Checkbox,
    Radio,
    Card,
    Table,
} from "antd";
import {
    EditOutlined,
    DeleteFilled,
    ArrowsAltOutlined,
} from "@ant-design/icons";

import Select from "react-select";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { swalError, swalSuccess } from "@/apsisEngine/helpers/helperService";

const CreateJson = () => {

    const [moduleOption, setModuleOption] = useState([]);
    const [moduleName, setModule] = useState();
    const [propertyArray, setPropertyArray] = useState([]);
    const [objectArray, setObjectArray] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [align, setAlign] = useState('left');
    const { TextArea } = Input;
    useEffect(async () => {
        await fetchWrapper.get('/dynamic_json').then((res) => {
            setModuleOption(res.data);
        }).catch((err) => {
            console.log(err);
        })
    }, [propertyArray])
    const setModuleName = async (e) => {
        setModule(e.value);
        let objArray = []
        let propertyArray = [];
        const moduleName = e.value.replace(" ", '_').toLowerCase();
        await fetchWrapper.get('/dynamic_json/' + moduleName).then((res) => {
            if (res.data.length != 0 || res.data != undefined) {
                setEditMode(true);
                Object.keys(res.data).map((x) => {

                    if (typeof res.data[x] === 'object') {
                        let obj = {
                            id: Math.floor((Math.random() * 5000) + 1),
                            keyName: x,
                            properties: []
                        }
                        Object.keys(res.data[x]).map((Property) => {
                            let tempObject = {
                                key: Property,
                                value: res.data[x][Property]
                            }
                            obj.properties.push(tempObject)
                        })
                        objArray.push(obj);
                    }
                    else {
                        let propertyObj = {
                            id: Math.floor((Math.random() * 1000) + 1),
                            key: x,
                            value: res.data[x]
                        }
                        propertyArray.push(propertyObj);
                    }
                })
                setPropertyArray(propertyArray);
                setObjectArray(objArray);
            }
        }).catch((err) => {
            setPropertyArray([]);
            setObjectArray([]);
            console.log(err);
        })

    }

    const addProperty = () => {
        const array = [...propertyArray];
        const object = {
            id: Math.floor((Math.random() * 1000) + 1),
            key: '',
            value: ''
        }
        array.push(object);
        setPropertyArray(array);
    }
    const addObject = () => {
        const array = [...objectArray];
        const obj = {
            id: Math.floor((Math.random() * 5000) + 1),
            keyName: '',
            properties: []
        }
        array.push(obj);
        setObjectArray(array);
    }

    const removeProperty = (item) => {
        setPropertyArray(propertyArray.filter(x => x.id != item.id));
    }

    const addObjectProperty = (index) => {
        const array = [...objectArray];
        const object = {
            id: Math.floor((Math.random() * (20000 - 6000 + 1)) + 6000),
            key: '',
            value: ''
        }
        array[index].properties.push(object)
        setObjectArray(array);
    }

    const removeObjectProperty = (item, i, index) => {
        // console.log(item, i, index);
        const array = [...objectArray];
        const propertyArray = array[index].properties;
        const p = propertyArray.filter((x) => x.id != item.id);
        array[index].properties = p;
        // const propertyArray = [...objectArray[index].properties]
        // propertyArray.filter((x) => x.id != item.id);
        // array[index].properties = propertyArray;
        setObjectArray(array);
    }
    const removeObject = (element) => {
        const array = [...objectArray];
        setObjectArray(array.filter((x) => x.id != element.id));
    }
    const setProperty = (e, index) => {
        const { name, value } = e.target;
        if (name == 'propertyName') {
            const temp = [...propertyArray];
            temp[index].key = value;
            setPropertyArray(temp);
        }
        else {
            const temp = [...propertyArray];
            temp[index].value = value;
            setPropertyArray(temp);
        }
    }

    const setObjectProperty = (e, index, i) => {
        const { name, value } = e.target;
        const temp = [...objectArray];

        if (name == 'keyName') {
            temp[index].keyName = value;
            setObjectArray(temp);
        }
        else if (name == 'propertyKeyName') {
            temp[index].properties[i].key = value;
            setObjectArray(temp);
        }
        else if (name == 'propertyKeyValue') {
            temp[index].properties[i].value = value;
            setObjectArray(temp);
        }
    }
    const onSubmit = async () => {
        const data = {};
        data['module_name'] = moduleName;
        propertyArray.map((item) => {
            data[`${item.key}`] = item.value;
        })
        objectArray.map((element) => {
            const obj = {};
            element.properties.map((item) => {
                obj[`${item.key}`] = item.value;
            })
            data[`${element.keyName}`] = obj
        })
        await fetchWrapper.post('dynamic_json', data).then((res) => {
            if (!res.error) {
                swalSuccess(res.message);
            }
            else {
                swalError('Something Wrong!!!');
            }
        }).catch((err) => {
            console.log(err);
        })
        console.log(data);
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            console.log('I am here');
            setAlign('right');
        }
    }
    console.log(editMode);
    return (
        <div>
            <Form layout="vertical" onFinish={onSubmit} >
                <Card title='Create Json' >
                    <Row>
                        <Col span={6}>
                            <Form.Item label="Select Module" name='moduleSelect' rules={[{ required: true, message: 'Please select module!' }]}>
                                <Select
                                    className="mb-1"
                                    options={moduleOption}
                                    placeholder="Select Module"
                                    onChange={(e) =>
                                        setModuleName(e)
                                    }
                                    isSearchable
                                //menuPlacement="top"
                                />
                            </Form.Item>
                        </Col>
                        {/* <Col span={6}>
                            <Input style={{textAlign : `${align}`}} type="text" onChange={()=>setAlign('left')} onPressEnter={handleKeyDown}></Input>
                        </Col> */}
                    </Row>

                    <Col span={24}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card>
                                    <Row>
                                        {
                                            propertyArray && propertyArray.map((item, index) => {
                                                return (
                                                    <Col span={24} key={index} style={{ marginTop: '0.5rem' }}>
                                                        <Row className="card-footer">
                                                            <Col span={10}>
                                                                <Form.Item label="Key" name={item.id} rules={[{ required: true, message: 'key is required!' }]}>
                                                                    <TextArea defaultValue={item.key} name="propertyName" onChange={(e) => setProperty(e, index)} placeholder="property name"></TextArea>
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={10} style={{ marginLeft: '0.5rem' }}>
                                                                <Form.Item label="value" name={item.id + 0.1} rules={[{ required: true, message: 'value is required!' }]}>
                                                                    <TextArea defaultValue={item.value} name="propertyValue" onChange={(e) => setProperty(e, index)} placeholder="value"></TextArea>
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={2} style={{ marginLeft: '0.5rem', marginTop: '1.8rem' }}>
                                                                <Form.Item>
                                                                    <Button onClick={(e) => removeProperty(item)} type="danger"><DeleteFilled /></Button>
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    </Col>

                                                )
                                            })
                                        }
                                        <Button
                                            type="primary"
                                            size="middle"
                                            style={{ marginTop: '0.5rem' }}
                                            onClick={() => {
                                                addProperty();
                                            }}
                                        >
                                            Add Property
                                        </Button>
                                    </Row>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card>
                                    {
                                        objectArray && objectArray?.map((element, index) => {
                                            return (

                                                <Row key={index} className="card-footer" style={{ marginTop: '0.5rem' }}>
                                                    <Col span={24}>
                                                        <Row >
                                                            <Col span={10}>
                                                                <Form.Item label="Object Key" name={element.id} rules={[{ required: true, message: 'object key name required!' }]}>
                                                                    <Input defaultValue={element.keyName} onChange={(e) => setObjectProperty(e, index, 0)} name="keyName" placeholder="Object Key name"></Input>
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={4}>
                                                                <Button style={{ marginTop: '1.8rem', marginLeft: '1rem' }} type="danger" size="middle" onClick={(e) => removeObject(element)}>Remove</Button>
                                                            </Col>
                                                            <Col span={6}>
                                                                <Button onClick={(e) => addObjectProperty(index)} style={{ marginTop: '1.8rem', marginLeft: '2.3rem' }} size="middle" type="primary">Add Object Property</Button>
                                                            </Col>

                                                        </Row>
                                                    </Col>
                                                    {
                                                        element.properties && element.properties.map((item, i) => {
                                                            return (
                                                                <Col key={i} span={24} style={{ marginLeft: '2rem' }}>
                                                                    <Row>
                                                                        <Col span={10}>
                                                                            <Form.Item label="Key" name={item.id} rules={[{ required: true, message: 'key is required!' }]}>
                                                                                <TextArea defaultValue={item.key} onChange={(e) => setObjectProperty(e, index, i)} name="propertyKeyName" placeholder="property name"></TextArea>
                                                                            </Form.Item>
                                                                        </Col>
                                                                        <Col span={10} style={{ marginLeft: '0.5rem' }}>
                                                                            <Form.Item label="value" name={item.id + 0.2} rules={[{ required: true, message: 'value is required!' }]}>
                                                                                <TextArea defaultValue={item.value} onChange={(e) => setObjectProperty(e, index, i)} name="propertyKeyValue" placeholder="value"></TextArea>
                                                                            </Form.Item>
                                                                        </Col>
                                                                        <Col span={2} style={{ marginLeft: '0.5rem', marginTop: '1.8rem' }}>
                                                                            <Form.Item>
                                                                                <Button onClick={(e) => removeObjectProperty(item, i, index)} type="danger"><DeleteFilled /></Button>
                                                                            </Form.Item>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>

                                                            )
                                                        })
                                                    }
                                                </Row>
                                            )


                                        })

                                    }
                                    <Button
                                        type="primary"
                                        size="middle"
                                        style={{ marginTop: '0.5rem' }}
                                        onClick={() => {
                                            addObject();
                                        }}
                                    >
                                        Add Object
                                    </Button>
                                </Card>
                            </Col>
                        </Row>
                    </Col>

                </Card>
                <div className="section-footer mt-2">
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </div>
            </Form >
        </div >
    )
}

export default CreateJson;