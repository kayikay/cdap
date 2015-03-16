/*
 * Copyright © 2015 Cask Data, Inc.
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

package co.cask.cdap.templates.etl.api.stages;

import co.cask.cdap.templates.etl.api.SinkContext;
import co.cask.cdap.templates.etl.api.StageConfigurer;
import co.cask.cdap.templates.etl.api.realtime.RealtimeSink;

/**
 *
 */
public abstract class AbstractRealtimeSink<I> implements RealtimeSink<I> {

  private SinkContext context;

  @Override
  public void configure(StageConfigurer configurer) {
    configurer.setName(this.getClass().getSimpleName());
  }

  @Override
  public void initialize(SinkContext context) {
    this.context = context;
  }

  @Override
  public void destroy() {
    //no-op
  }

  protected SinkContext getContext() {
    return context;
  }
}
