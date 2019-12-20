import React from 'react';
import Button from './styledComponents/Button';
import Form from './styledComponents/Form';
import Input from './styledComponents/Input';
import Select from './styledComponents/Select';

let url = '';
let XMLorJSON = '';
const RequestBar = ({createBodyFromSource}) => {

    const handleChange = (e) => {
        url = e.target.value;
    }

    const parseXmlToJson = (xml) => {
        let json;
        parseString(xml, (err, result) => {
          json = result;
          return result;
        });
        return json;
    };

    const fetchData = (e) => {
        e.preventDefault();
        fetch(url)
        .then(res => {
            const val = res.headers.get('content-type');
            if (val.includes('xml')) {
                XMLorJSON = 'XML';
                return res.text().then(xml => parseXmlToJson(xml));
            }
            XMLorJSON = 'JSON';
            return res.json();
        })
        .then(data => {
            const stringifiedData = JSON.stringify(data);
            const newBodyItem = {
                sourceRoute: url,
                sourceMethod: 'GET',
                sourceResponse: stringifiedData,
                sourceResponseType: XMLorJSON,
                customRoute: '/',
                customMethod: 'GET',
                customResponse: stringifiedData,
                customResponseType: XMLorJSON,
                collection: 'CLONED_ITEMS',
            }
            createBodyFromSource(newBodyItem);
        });
    }

    return (
        <Form onSubmit={fetchData}>
            <Select>
                <option value='GET'> GET </option>
            </Select>
            <Input
            onChange={handleChange}
            />
            <Button type='submit' value='Submit' variation="positive"> Send </Button>
        </Form>
    )
}

export default RequestBar;
