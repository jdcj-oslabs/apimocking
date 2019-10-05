import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import Button from './styledComponents/Button';

// import PropTypes from 'prop-types';

class BodyItem extends Component{

  constructor(props){
    super(props)
  }

  render () {
    const editable = this.props.modifyBodyItem;
    const styles = {
      borderRadius: '5px',
      fontFamily: '\'IBM Plex Mono\', monospace',
      fontSize: '90%',
      maxHeight: '250px',
      overflow: 'auto',
      margin: '0.75em auto',
      padding: '1em',
      border: '1px solid grey',
    };
    
    const changeObject = (src) => {
      const customResponse = JSON.stringify(src.updated_src);
      // modifyBodyItem expects an entire bodyItem
      const modifiedBodyItem = {
        ...this.props.bodyItem,
        customResponse
      }
      this.props.modifyBodyItem(modifiedBodyItem);
    };

    const saveButton = (
      <Button
        variation='positive'
        enabled
        onClick={() => { 
          this.props.moveBodyItem(bodyItem.bodyItemId, "STAGED_ITEMS");
        }}
      >
        Save
      </Button>
    )

    const addToServerButton = (
      <Button
        variation='positive'
        enabled
        onClick={()=> {
          this.props.moveBodyItem(bodyItem.bodyItemId, "HOSTED_ITEMS")
        }}
      >Add To Server</Button>
    )

    const removeFromServerButton = (
      <Button
        variation='negative'
        enabled
        onClick={()=> {
          this.props.moveBodyItem(bodyItem.bodyItemId, "STAGED_ITEMS")
        }}
      >Remove from Server

      </Button>
    )

    const bodyItem = this.props.bodyItem;
    const src = JSON.parse(bodyItem.customResponse);
    return (
      <div>
        <Button onClick={()=>{
          this.props.deleteBodyItem(bodyItem.bodyItemId);
        }}>
          <span aria-hidden="true">&times;</span>
        </Button>
        
        <ReactJson
          src={src}
          theme='shapeshifter:inverted'
          iconStyle='circle'
          style={styles}
          collapsed={2}
          onAdd={(editable) ? changeObject : false}
          onEdit={(editable) ? changeObject : changeObject}
          onDelete={(editable) ? changeObject : false}
          enableClipboard={false}
        />
        {this.props.collection === "CLONED_ITEMS" ? saveButton : null}
        {this.props.collection === "STAGED_ITEMS" ? addToServerButton : null}
        {this.props.collection === "HOSTED_ITEMS" ? removeFromServerButton : null}
      </div>
    )  
  }
};

export default BodyItem;
