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
import EntityCard from 'components/EntityCard';
import classnames from 'classnames';
import {objectQuery} from 'services/helpers';
import JustAddedSection from 'components/EntityListView/JustAddedSection';
import NoEntitiesMessage from 'components/EntityListView/NoEntitiesMessage';

export default class HomeListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: this.props.loading || false,
      list: this.props.list || [],
      selectedEntity: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      list: nextProps.list,
      loading: nextProps.loading,
      animationDirection: nextProps.animationDirection,
      activeEntity: nextProps.activeEntity,
      errorMessage: nextProps.errorMessage,
      errorStatusCode: nextProps.errorStatusCode,
      retryCounter: nextProps.retryCounter
    });
  }

  onClick(entity) {
    let activeEntity = this.state.list.filter(e => e.id === entity.id);
    if (activeEntity.length) {
      this.setState({
        activeEntity: activeEntity[0]
      });
    }
    if (this.props.onEntityClick) {
      this.props.onEntityClick(entity);
    }
  }
  render() {
    let content;
    if (this.state.loading) {
      content = (
        <h3 className="text-xs-center">
          <span className="fa fa-spinner fa-spin fa-2x loading-spinner"></span>
        </h3>
      );
    }

    if (!this.state.loading && !this.state.list.length) {
      content = <NoEntitiesMessage
                  searchText={this.props.searchText}
                  filtersAreApplied={this.filtersAreApplied.bind(this)}
                  clearSearchAndFilters={this.clearSearchAndFilters.bind(this)}
                />;

    }
    if (!this.state.loading && this.state.list.length) {
      content = this.state.list.map(entity => {
        return (
          <EntityCard
            className={
              classnames('entity-card-container',
                { active: entity.uniqueId === objectQuery(this.state, 'activeEntity', 'uniqueId') }
              )
            }
            id={entity.uniqueId}
            key={entity.uniqueId}
            onClick={this.onClick.bind(this, entity)}
            entity={entity}
            onFastActionSuccess={this.props.onFastActionSuccess}
            onUpdate={this.props.onUpdate}
          />
        );
      });
    }

    return (
      <div className={this.props.className}>
        {
          !this.props.showJustAddedSection ?
            null
          :
            (<JustAddedSection
              clickHandler={this.onClick.bind(this)}
              onFastActionSuccess={this.props.onFastActionSuccess}
              onUpdate={this.props.onUpdate}
              activeEntity={this.props.activeEntity}
              currentPage={this.props.currentPage}
              limit={this.props.numColumns}
            />)
        }
        <div className="entities-all-list-container">
          {content}
        </div>
      </div>
    );
  }
}

HomeListView.propTypes = {
  list: PropTypes.array,
  loading: PropTypes.bool,
  onEntityClick: PropTypes.func,
  onUpdate: PropTypes.func,
  onFastActionSuccess: PropTypes.func, // FIXME: This is not right. I don't think onFastActionSuccess is being used correct here. Not able to reason.
  className: PropTypes.string,
  activeEntity: PropTypes.object,
  currentPage: PropTypes.number,
  numColumns: PropTypes.number,
  showJustAddedSection: PropTypes.bool
};
