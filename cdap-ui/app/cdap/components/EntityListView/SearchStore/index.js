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

import {combineReducers, createStore} from 'redux';
import SearchStoreActions from 'components/EntityListView/SearchStore/SearchStoreActions';
import {DEFAULT_SEARCH_QUERY, DEFAULT_SEARCH_FILTER_OPTIONS, DEFAULT_SEARCH_FILTERS, DEFAULT_SEARCH_SORT, DEFAULT_SEARCH_SORT_OPTIONS} from 'components/EntityListView/SearchStore/SearchConstants';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

const defaultAction = {
  type: {},
  payload: {}
};

const defaultSearchState = {
  filters: DEFAULT_SEARCH_FILTER_OPTIONS,
  activeFilters: DEFAULT_SEARCH_FILTERS,
  sort: DEFAULT_SEARCH_SORT_OPTIONS,
  activeSort: DEFAULT_SEARCH_SORT,
  query: DEFAULT_SEARCH_QUERY,

  offset: 0,
  limit: 30,
  numCursors: 10,

  loading: false,
  results: []
};

const defaultInitialState = {
  search: defaultSearchState
};

const search = (state = defaultSearchState, action = defaultAction) => {
  switch (action.type) {
    case SearchStoreActions.SETRESULTS: {
      let {results, total, limit} = action.payload.response;
      if (isEmpty(results)) {
        return state;
      }
      return Object.assign({}, state, {
        results: action.payload.response.results,
        total,
        limit,
        loading: false
      });
    }
    case SearchStoreActions.SETACTIVEFILTERS:
      return Object.assign({}, state, {
        activeFilters: action.payload.activeFilters
      });
    case SearchStoreActions.SETACTIVESORT:
      if (isNil(action.payload.activeSort)) {
        return state;
      }
      return Object.assign({}, state, {
        activeSort: action.payload.activeSort,
        query: DEFAULT_SEARCH_QUERY
      });
    case SearchStoreActions.SETQUERY:
      return Object.assign({}, state, {
        query: action.payload.query === '' ? '*' : action.payload.query,
        activeSort: action.payload.query !== '*' ? DEFAULT_SEARCH_SORT_OPTIONS[0] : state.activeSort
      });
    case SearchStoreActions.LOADING:
      return Object.assign({}, state, {
        loading: !state.loading
      });
    default:
      return state;
  }
};

const searchStoreWrapper = () => {
  return createStore(
    combineReducers({
      search
    }),
    defaultInitialState
  );
};

const SearchStore = searchStoreWrapper();
export default SearchStore;
