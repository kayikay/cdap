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
import HomeListView from 'components/EntityListView/ListView';
require('./EntityListView.scss');
import isNil from 'lodash/isNil';
import classNames from 'classNames';
import EntityListHeader from 'components/EntityListView/EntityListHeader';
import EntityListInfo from 'components/EntityListView/EntityListInfo';
import NamespaceStore from 'services/NamespaceStore';
import SearchStoreActions from 'components/EntityListView/SearchStore/SearchStoreActions';
import {DEFAULT_SEARCH_PAGE_SIZE} from 'components/EntityListView/SearchStore/SearchConstants';
import globalEvents from 'services/global-events';
import ee from 'event-emitter';
import ExploreTablesStore from 'services/ExploreTables/ExploreTablesStore';
import {fetchTables} from 'services/ExploreTables/ActionCreator';
import PageErrorMessage from 'components/EntityListView/ErrorMessage/PageErrorMessage';
import HomeErrorMessage from 'components/EntityListView/ErrorMessage';
import Overview from 'components/Overview';
export default class EntityListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entities: [],
      loading: false,
      limit: DEFAULT_SEARCH_PAGE_SIZE,
      total: 0,
      overview: false
    };
    this.eventEmitter = ee(ee);
    // Maintaining a retryCounter outside the state as it doesn't affect the state/view directly.
    // We just need to retry for 5 times exponentially and then stop with a message.
    this.retryCounter = 0;
    this.refreshSearchByCreationTime = this.refreshSearchByCreationTime.bind(this);
    this.eventEmitter.on(globalEvents.APPUPLOAD, this.refreshSearchByCreationTime);
    this.eventEmitter.on(globalEvents.STREAMCREATE, this.refreshSearchByCreationTime);
    this.eventEmitter.on(globalEvents.PUBLISHPIPELINE, this.refreshSearchByCreationTime);
    this.eventEmitter.on(globalEvents.ARTIFACTUPLOAD, this.refreshSearchByCreationTime);
  }
  componentDidMount() {
    this.searchStoreSubscription = SearchStore.subscribe(() => {
      let {results:entities, loading, limit, total, overviewEntity} = SearchStore.getState().search;
      this.setState({
        entities,
        loading,
        limit,
        total,
        overview: !isNil(overviewEntity)
      });
    });
    SearchStore.dispatch({
      type: SearchStoreActions.SETPAGESIZE,
      payload: {
        element: document.getElementsByClassName('entity-list-view')
      }
    });
    search();
  }
  componentWillUnmount() {
    if (this.searchStoreSubscription) {
      this.searchStoreSubscription();
    }
    this.eventEmitter.off(globalEvents.APPUPLOAD, this.refreshSearchByCreationTime);
    this.eventEmitter.off(globalEvents.STREAMCREATE, this.refreshSearchByCreationTime);
    this.eventEmitter.off(globalEvents.PUBLISHPIPELINE, this.refreshSearchByCreationTime);
    this.eventEmitter.off(globalEvents.ARTIFACTUPLOAD, this.refreshSearchByCreationTime);
  }
  refreshSearchByCreationTime() {
    let namespace = NamespaceStore.getState().selectedNamespace;
    ExploreTablesStore.dispatch(
     fetchTables(namespace)
   );
   SearchStore.dispatch({
     type: SearchStoreActions.SETACTIVESORT,
     payload: {
       activeSort: SearchStore.getState().search.sort[4]
     }
   });
   search();
  }
  retrySearch() {
    this.retryCounter += 1;
    search();
  }
  onOverviewCloseAndRefresh() {
    this.setState({
      overview: false
    });
    SearchStore.dispatch({
      type: SearchStoreActions.RESETOVERVIEWENTITY
    });
    search();
  }
  render() {
    let namespace = NamespaceStore.getState().selectedNamespace;
    let searchState = SearchStore.getState();
    let currentPage = searchState.search.currentPage;
    let query = searchState.search.query;
    let searchText = searchState.search.query;
    let {statusCode:errorStatusCode, message:errorMessage } = searchState.search.error;
    let errorContent;
    if (!isNil(errorStatusCode)) {
      if (errorStatusCode === 'PAGE_NOT_FOUND') {
        errorContent = (
          <PageErrorMessage
            pageNum={currentPage}
            query={query}
          />
        );
      } else {
        errorContent = (
          <HomeErrorMessage
            errorMessage={errorMessage}
            errorStatusCode={errorStatusCode}
            onRetry={this.retrySearch.bind(this)}
            retryCounter={this.retryCounter}
          />
        );
      }
    }

    return (
      <div>
        <EntityListHeader />
        <div className="entity-list-view">
          <EntityListInfo
            className="entity-list-info"
            namespace={namespace}
            numberOfEntities={this.state.total}
            numberOfPages={this.state.total / this.state.limit}
            currentPage={1}
          />
          <div className="entities-container">
            {
              !isNil(errorContent) ?
                errorContent
              :
                <HomeListView
                  loading={this.state.loading}
                  className={classNames("home-list-view-container", {"show-overview-main-container": this.state.overview})}
                  list={this.state.entities}
                  pageSize={this.state.limit}
                  showJustAddedSection={searchText.length}
                  onFastActionSuccess={search}
                />
            }
            <Overview
              onCloseAndRefresh={this.onOverviewCloseAndRefresh.bind(this)}
            />
          </div>
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
