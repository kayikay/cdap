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
import T from 'i18n-react';
import ReactPaginate from 'react-paginate';
import NamespaceStore from 'services/NamespaceStore';
import SearchStore from 'components/EntityListView/SearchStore';
import SearchStoreActions from 'components/EntityListView/SearchStore/SearchStoreActions';
import {search} from 'components/EntityListView/SearchStore/ActionCreator';

require('./EntityListInfo.scss');

export default class EntityListInfo extends Component {
  constructor(props) {
    super(props);
  }
  handlePageChange(data) {
    let currentPage = data.selected + 1;
    let pageSize = SearchStore.getState().search.limit;
    let offset = data.selected * pageSize;
    SearchStore.dispatch({
      type: SearchStoreActions.SETCURRENTPAGE,
      payload: {
        currentPage,
        offset
      }
    });
    search();
  }

  showPagination() {
    let plus = this.props.allEntitiesFetched ? '' : '+';
    let entitiesLabel = T.translate('features.EntityListView.Info.entities');
    return (
      <span className="pagination">
        <span className="total-entities">
          {this.props.numberOfEntities} {plus} {entitiesLabel}
        </span>
        {
          this.props.numberOfPages > 1 ?
            (
              <ReactPaginate
                pageCount={this.props.numberOfPages}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                breakLabel={<span>...</span>}
                breakClassName={"ellipsis"}
                previousLabel={<span className="fa fa-angle-left"></span>}
                nextLabel={<span className="fa fa-angle-right"></span>}
                onPageChange={this.handlePageChange.bind(this)}
                disableInitialCallback={true}
                initialPage={this.props.currentPage-1}
                forcePage={this.props.currentPage-1}
                containerClassName={"page-list"}
                activeClassName={"current-page"}
              />
            )
          :
            null
        }
      </span>
    );
  }
  render() {
    let namespace = NamespaceStore.getState().selectedNamespace;
    let title = T.translate('features.EntityListView.Info.title', {namespace});

    return (
      <div className={this.props.className}>
        <span className="title">
          <h3 title={this.props.namespace}>
            {title}
          </h3>
        </span>
        {
          this.props.numberOfEntities ?
            this.showPagination()
          :
            null
        }
      </div>
    );
  }
}

EntityListInfo.propTypes = {
  className: PropTypes.string,
  numberOfPages: PropTypes.number,
  numberOfEntities: PropTypes.number,
  currentPage: PropTypes.number,
  allEntitiesFetched: PropTypes.bool
};

EntityListInfo.defaultProps = {
  className: '',
  numberOfPages: 1,
  numberOfEntities: 0,
  currentPage: 1,
  allEntitiesFetched: false
};
