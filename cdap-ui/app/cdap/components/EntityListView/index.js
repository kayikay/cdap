/*
 * Copyright © 2016-2017 Cask Data, Inc.
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

import React, {Component, PropTypes} from 'react';
import SearchStore from 'components/EntityListView/SearchStore';
import {search} from 'components/EntityListView/SearchStore/ActionCreator';
import ListViewHeader from 'components/EntityListView/ListViewHeader';
import HomeListView from 'components/EntityListView/ListView';
require('./EntityListView.scss');
import isNil from 'lodash/isNil';
import classNames from 'classNames';
import EntityListHeader from 'components/EntityListView/EntityListHeader';
import EntityListInfo from 'components/EntityListView/EntityListInfo';
import NamespaceStore from 'services/NamespaceStore';

export default class EntityListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entities: [],
      loading: false
    };
  }
  componentDidMount() {
    this.searchStoreSubscription = SearchStore.subscribe(() => {
      let searchState = SearchStore.getState();
      let entities = searchState.search.results;
      let loading = searchState.search.loading;
      this.setState({
        entities,
        loading
      });
    });
    search();
  }
  componentWillUnmount() {
    if (this.searchStoreSubscription) {
      this.searchStoreSubscription();
    }
  }
  render() {
    let namespace = NamespaceStore.getState().selectedNamespace;
    return (
      <div className="entity-list-view">
        <EntityListHeader />
        <EntityListInfo
          className="entity-list-info"
          namespace={namespace}
          numberOfEntities={this.state.total}
          numberOfPages={1}
          currentPage={1}
          onPageChange={() => console.log('On Page change')}
        />
        <ListViewHeader/>
        <div className="entities-container">
          <HomeListView
            loading={this.state.loading}
            className={classNames("home-list-view-container", {"show-overview-main-container": !isNil(this.state.selectedEntity)})}
            list={this.state.entities}
          />
        </div>
      </div>
    );
  }
}

EntityListView.propTypes = {
  params: PropTypes.shape({
    namespace : PropTypes.string
  }),
  location: PropTypes.object,
  history: PropTypes.object,
  pathname: PropTypes.string
};
