/*
 * Copyright © 2017 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import React, {PropTypes, Component} from 'react';
import AppOverview from 'components/Overview/AppOverview';
import DatasetOverview from 'components/Overview/DatasetOverview';
import StreamOverview from 'components/Overview/StreamOverview';
import {objectQuery} from 'services/helpers';
import isNil from 'lodash/isNil';
import classnames from 'classnames';
import SearchStore from 'components/EntityListView/SearchStore';
import SearchStoreActions from 'components/EntityListView/SearchStore/SearchStoreActions';
require('./Overview.scss');

export default class Overview extends Component {
  constructor(props) {
    super(props);
    let {overviewEntity} = SearchStore.getState().search;
    this.state = {
      tag: null,
      entity: overviewEntity,
      showOverview: false
    };
    this.typeToComponentMap = {
      'application': AppOverview,
      'datasetinstance': DatasetOverview,
      'stream': StreamOverview
    };
  }
  componentWillMount() {
    SearchStore.subscribe(() => {
      let searchState = SearchStore.getState().search;
      let overviewEntity = searchState.overviewEntity;
      if (!isNil(overviewEntity) && overviewEntity.id !== objectQuery(this.state, 'entity', 'id')) {
        this.setState({
          entity: overviewEntity,
          showOverview: true,
          tag: this.typeToComponentMap[objectQuery(overviewEntity, 'type')]
        });
      }
    });
  }
  componentDidUpdate() {
    if (this.state.entity) {
      let el = document.getElementById(this.state.entity.uniqueId);
      let paginationContainer = document.querySelector('.entity-list-view');
      el.scrollIntoView();
      paginationContainer.scrollTop -= 63;
    }
  }
  hideOverview() {
    this.setState({
      showOverview: false
    });
    SearchStore.dispatch({
      type: SearchStoreActions.RESETOVERVIEWENTITY
    });
  }
  closeAndRefresh(action) {
    this.hideOverview();
    if (action === 'delete') {
      if (this.props.onCloseAndRefresh) {
        this.props.onCloseAndRefresh();
      }
    }
  }
  render() {
    let Tag = this.state.tag || 'div';
    return (
      <div className={classnames("overview-container", {"show-overview": this.state.showOverview })}>
        <div className="overview-wrapper" >
          {
            React.createElement(
              Tag,
              {
                entity: this.state.entity,
                onClose: this.hideOverview.bind(this),
                onCloseAndRefresh: this.closeAndRefresh.bind(this)
              }
            )
          }
        </div>
      </div>
    );
  }
}

Overview.propTypes = {
  onCloseAndRefresh: PropTypes.func
};
