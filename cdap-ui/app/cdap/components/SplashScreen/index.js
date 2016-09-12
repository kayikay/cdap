/*
 * Copyright © 2016 Cask Data, Inc.
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

import React, { Component } from 'react';
import 'whatwg-fetch';
require('./SplashScreen.less');

import Card from '../Card';
import MyUserStoreApi from '../../api/userstore';
import T from 'i18n-react';

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      error: '',
      showRegistration: window.CDAP_CONFIG.cdap.standaloneWebsiteSDKDownload,
      showSplashScreen: false
    };
  }
  componentDidMount() {
    MyUserStoreApi
      .get()
      .subscribe(res => {
        this.setState({
          showSplashScreen: (typeof res.property['standalone-welcome-message'] === 'undefined' ? true : res.property['standalone-welcome-message'])
        });
      });
  }
  resetWelcomeMessage() {
    MyUserStoreApi
      .get()
      .flatMap(res => {
        res.property['standalone-welcome-message'] = false;
        return MyUserStoreApi.set({}, res.property);
      })
      .subscribe(
        () => {},
        (err) => { this.setState({error: err}); }
      );
  }
  onClose() {
    this.setState({
      showSplashScreen: false
    });
    this.resetWelcomeMessage();
  }
  render() {
    return (
      <div className={!this.state.showSplashScreen ? 'hide' : ''}>
        <div className="splash-screen-backdrop"></div>
        <div className="splash-screen">
          <Card
            closeable
            title={T.translate('features.SplashScreen.title')}
            onClose={this.onClose.bind(this)}
          >
            <div className="text-center">
              <span className="fa fa-5x icon-fist"></span>
              <h4>
                <T.span text={{ key: "features.SplashScreen.intro-message" }} />
              </h4>
              <br />
              <div className={this.state.showRegistration ? 'group' : 'group no-registration'}>
                <div className="btn btn-default">
                  <T.span text={{ key: "features.SplashScreen.buttons.getStarted" }} />
                </div>
                <div className={this.state.showRegistration ? 'btn btn-default' : 'hide'}>
                  <T.span text={{ key: "features.SplashScreen.buttons.introduction" }} />
                </div>
                <div className={this.state.showRegistration ? 'btn btn-default' : 'hide'}>
                  <T.span text={{ key: "features.SplashScreen.buttons.register" }} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }
}
