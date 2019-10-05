import React, { Component } from 'react';
import BodyItem from './BodyItem';

// import PropTypes from 'prop-types';

class BodyItems extends Component {

  render() {
    // Object.keys(this.props.bodyItems).length
    let bodyItemComponents = [];
    const bodies = this.props.bodyItems;
    const bodyKeys = Object.keys(bodies);
    for (let i = 0; i < bodyKeys.length; i += 1) {
      const key = bodyKeys[i];
      bodyItemComponents.push(
        <BodyItem
          collection={this.props.collection}
          key={`BodyItem-${key}`}
          bodyItemId={key}
          bodyItem={bodies[key]}
          modifyBodyItem={this.props.modifyBodyItem}
          moveBodyItem = {this.props.moveBodyItem}
          deleteBodyItem={this.props.deleteBodyItem}
        />
      )
    }
    return (
      <div className="bodyitems">
        {bodyItemComponents}
      </div>
    );
  }
}


export default BodyItems;
