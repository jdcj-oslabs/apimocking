import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import StyledPanel from './StyledPanel.jsx';
import { TestsContext } from '../testsContext';
import Button from '../components/Button.jsx';
import DataTree from '../components/DataTree.jsx';
// import NameForm from '../components/NameForm.jsx';
import Mockup from '../components/Mockup.jsx';


// will need to get data from the get request to pass to the formatted view
const MockupsPanel = (props) => {
  const {
    active, datacanvas, data, onClickFunction,
  } = props;

  const [tests, setTests] = useContext(TestsContext);
  const [testsListCounter, setTestsListCounter] = useState(0);

  const saveUpdatedTree = (newData, arrayPosition, newValue, name, namespace) => {
    // Update tests
    const testsClone = [...tests];
    testsClone[arrayPosition].payload = newData;
    // for deletion—find better syntax
    if (!testsClone[arrayPosition].diff[namespace]) {
      testsClone[arrayPosition].diff[namespace] = {};
    }
    testsClone[arrayPosition].diff[namespace][name] = newValue;
    setTests(testsClone);
  };

  const mockupsListDisplay = [];
  let i = 0;
  tests.forEach((test, index) => {
    const { name } = test;

    mockupsListDisplay.push(
      // Creates a component for each test to display name and data
      <Mockup key={index} test={test} index={index} saveUpdatedTree={saveUpdatedTree} />,
    );
    i += 1;
  });

  const createNewTest = () => {
    const testsClone = [...tests];
    testsClone.push({
      payload: data, status: '', name: '', diff: {},
    });

    // the ID of the test will be the same as the position in the array
    setTestsListCounter(testsListCounter + 1);
    setTests(testsClone);
  };

  if (active) {
    return (
        <StyledPanel active={active} style={{ cursor: 'default' }}>
          <div>
            {data && <h3>Server Response</h3>}
            {datacanvas}
            {data && <Button enabled={true} onClick={createNewTest}>New Test</Button>}
          </div>
          {mockupsListDisplay}
        </StyledPanel>
    );
  }

  return (
    <StyledPanel
      onClick={onClickFunction}
      active={active}
      style={{ cursor: 'pointer' }} >
      <h1>Test</h1>
    </StyledPanel>
  );
};

export default MockupsPanel;
