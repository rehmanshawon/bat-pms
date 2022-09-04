import { InboxOutlined, DownloadOutlined,UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Col,
  Form,
  InputNumber,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Switch,
  Upload,
  Input,
  message
} from 'antd';
import React,{useState} from 'react';
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 8,
  },
};

const normFile = (e) => {
  console.log('Upload event:', e);

  if (Array.isArray(e)) {
    return e;
  }

  return e?.fileList;
};

const SetTeamTargetForm = () => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };
  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file);
    });
    setUploading(true); // You can use any AJAX library you like

    fetch('https://www.mocky.io/v2/5cc8019d300000980a055e76', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        setFileList([]);
        message.success('upload successfully.');
      })
      .catch(() => {
        message.error('upload failed.');
      })
      .finally(() => {
        setUploading(false);
      });
  };
  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };
  return (
    <Form
      name="validate_other"
      {...formItemLayout}
      onFinish={onFinish}
      initialValues={{
        // 'inputnumber': 3,
        // 'checkbox-group': ['A', 'B'],
        // rate: 3.5,
      }}
      labelAlign={'left'}
      style={{
        //position: 'absolute',
        //width: '1572px',
        alignContent:'start',
        height: '554px',
        left: '324px',
        top: '131px',
        background: '#FFFFFF',
        /* shadow 2 */
        boxShadow: '0px 7px 14px rgba(0, 0, 0, 0.1)',
      }}
    >   
      
      <Form.Item
        name="Download"
        label="Download Sample Targer File"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        //extra="longgggggggggggggggggggggggggggggggggg"
        style={{
          marginLeft:50,
        //width: '223px',
        height: '20px',
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '20px',       
        color: '#444444',
        flex: 'none',
        order: 0,
        flexGrow: 0,
        }}
      >
        <Upload name="logo" action="/Download.do" listType="picture">
          <Button style={{
            // display: 'flex',
            //flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '13px 16px',
            gap: '10px',            
            width: '262px',
            height: '46px',            
            /* orange */            
            background: '#EF7D00',           
           // flex: 'none',
           // order: 1,
           // flexGrow: 0,
          }} icon={<DownloadOutlined />}><span style={{
            //width: '223px',
            height: '20px',
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: '20px',
            textTransform: 'uppercase',      
            color: '#ffffff',
            flex: 'none',
            order: 0,
            flexGrow: 0,
            }} >DOWNLOAD TARGET FILE </span></Button>
        </Upload>
      </Form.Item>
      <Form.Item label="Upload Target File (by Module)" colon={false} style={{
        marginTop:50,
        marginLeft:50,
        // width: '232px',
          height: '19px',
          left: '20px',
          top: '198.5px',        
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '20px',       
        color: '#444444',
        }}>
        
      </Form.Item>
      <Form.Item
        name="select"
        label=''        
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please select target year!',
          },
        ]}
        style={{         
          marginLeft:50,
          marginBottom:50,
          // width: '232px',
            height: '19px',
            left: '20px',
            top: '198.5px',        
          fontFamily: 'Inter',
          fontStyle: 'normal',
          fontWeight: 500,
          fontSize: '16px',
          lineHeight: '20px',       
          color: '#444444',
          }}
      >
        <Select placeholder="Please select target year">
          <Option value="2021">2021</Option>
          <Option value="2022">2022</Option>
        </Select>
      </Form.Item>

      <Form.Item>
      <Upload   {...props}>
        <Button icon={<UploadOutlined />} style={{marginLeft:50,marginBottom:10}} >Select File</Button>
        </Upload>  
        <Input style={{marginLeft:50}} />
        <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{
          marginTop: 16,
          marginLeft:50,
        }}
      >
        {uploading ? 'Uploading' : 'Start Upload'}
      </Button>
      </Form.Item>
      
      
      <Form.Item label="Dragger">
        <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
          <Upload.Dragger name="files" action="/upload.do">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Support for a single or bulk upload.</p>
          </Upload.Dragger>
        </Form.Item>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          span: 12,
          offset: 6,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SetTeamTargetForm;