import React from 'react';
import { parseString, Builder } from 'xml2js';
import HeaderBar from './HeaderBar.jsx';
import Form from './InlineForm.jsx';
import Select from './InlineSelect.jsx';
import Input from './InlineInput.jsx';
import Button from './Button.jsx';
import { TestsContext } from '../testsContext';


const RequestBar = () => {
  const {
    SourceOrDest, setData, setFetchTimes, setContentType, contentType,
  } = props;
  const [tests, setTests] = useContext(TestsContext);

  const method = (SourceOrDest === 'dest' ? 'POST' : 'GET');
  const [selected, setSelected] = useState(method);
  const [uri, setUri] = useState('');
  const [valid, setValid] = useState(false);

  //header info
  const [headerType, setHeaderType] = useState('Authorization');
  const [authType, setType] = useState('Bearer Token');
  const [headerKey, setHeaderKey] = useState('');
  let now = new Date();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'method') setSelected(value);
    else if (name === 'uri') setUri(value);
    
    // Header info
    if (name === 'Authentication') setHeaderType(value);
    if (name === 'headerKey') setHeaderKey(`Bearer ${value}`);

    setValid(e.target.parentElement.reportValidity());
  };

  const handleInvalid = (e) => {
    e.preventDefault();
  };

  //Extra fetches for performance metrics
  const fetchTimesList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  function getPerformanceMetricsData(getOrPost, sendingObj) {
    let successfulFetchesCounter = 0;

    function recordFetchTimes(i) {
      fetch(uri, sendingObj)
        .then(() => {
          fetchTimesList[i] = new Date() - now;
          successfulFetchesCounter += 1;
          now = new Date();
          if (successfulFetchesCounter === 9) {
            setFetchTimes(fetchTimesList);
          }
        });
    }

    for (let i = 1; i < 10; i += 1) recordFetchTimes(i);
  }

  const runTest = (link, sendingObj, testsClone, i) => {
    const test = testsClone;
    now = new Date();
    fetch(link, sendingObj)
      .then((response) => {
        fetchTimesList[0] = new Date() - now;
        test[i].status = response.status;
        if (i === test.length - 1) setTests(test);
        now = new Date();
      })
      .catch(error => console.log(error));

    getPerformanceMetricsData('post', sendingObj);
  };

  const parseXmlToJson = (xml) => {
    let json;
    parseString(xml, (err, result) => {
      json = result;
      return result;
    });
    return json;
  };

  const sendFetch = (e) => {
    e.preventDefault();
    if (!valid) return alert('Enter a valid URI');

    if (SourceOrDest === 'source') {
      const sendingObj = { method: selected, mode: 'cors' };
      if (headerType !== 'NONE') sendingObj.headers = { [headerType]: headerKey };

      now = new Date();
      fetch(uri, sendingObj)
        .then((res) => {
          fetchTimesList[0] = new Date() - now;
          now = new Date();
          const val = res.headers.get('content-type');
          setContentType(val);
          if (val.includes('xml')) {
            return res.text().then(xml => parseXmlToJson(xml));
          }
          return res.json();
        })
        .then((res) => {
          setTests([{
            payload: res, status: '', name: 'Test #1',
          }]);
          setData(res);
        });

      getPerformanceMetricsData('get', sendingObj);

    } else if (SourceOrDest === 'dest') {
      const testsClone = [...tests];
      const sendingObj = { method: selected, mode: 'cors' };
      sendingObj.headers = { 'Content-Type': contentType };
      if (headerType !== 'NONE') sendingObj.headers[headerType] = headerKey;

      for (let i = 0; i < testsClone.length; i += 1) {
        if (sendingObj.headers['Content-Type'].includes('xml')) {
          const jsonToXml = new Builder();
          sendingObj.body = jsonToXml.buildObject(testsClone[i].payload);
        } else {
          sendingObj.body = JSON.stringify(testsClone[i].payload);
        }
        runTest(uri, sendingObj, testsClone, i);
      }
    }
  };

  return (
    <div>
      <Form bordered>
        {
          (SourceOrDest === 'source')
          && (
            <Select
              name='method'
              // id='fetchTypeInput'
              // multiple={false}
              // value={selected}
              // onChange={handleChange}
            >
              <option value='GET'>GET</option>
            </Select>
          )
        }
        {
          // (SourceOrDest === 'dest')
          // && 
          <Select
            name='method'
            // id='fetchTypeInput'
            // multiple={false}
            // value={selected}
            // onChange={handleChange}
          >
            <option value='POST'>POST</option>
            <option value='PATCH'>PATCH</option>
            <option value='PUT'>PUT</option>
            <option value='DELETE'>DELETE</option>
          </Select>
        }
        <Input bordered />
        <Button type='submit' value='Submit' variation="positive"> Send </Button>
      </Form>
      {/* <HeaderBar header={headerType} authType={authType} handleChange={handleChange} /> */}
    </div>
  );
};

export default RequestBar;
