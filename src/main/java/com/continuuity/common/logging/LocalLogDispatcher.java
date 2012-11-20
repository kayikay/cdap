package com.continuuity.common.logging;

import com.continuuity.api.common.LogDispatcher;
import com.continuuity.api.common.LogTag;
import com.continuuity.common.conf.CConfiguration;
import com.continuuity.common.logging.AbstractLogDispatcher;
import com.continuuity.common.logging.LogCollector;
import com.continuuity.common.logging.LogEvent;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Local Log dispatcher.
 */
public class LocalLogDispatcher extends AbstractLogDispatcher {
  private final CConfiguration configuration;
  private final LogCollector collector;
  private final SimpleDateFormat date;

  public LocalLogDispatcher(CConfiguration configuration) {
    this.configuration = configuration;
    this.collector = new LogCollector(configuration);
    this.date = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
  }

  @Override
  public String getName() {
    return "flume-log-dispatcher";
  }

  @Override
  public boolean writeLog(LogTag tag, LogDispatcher.Level level, String message,
                          String stack) {
    LogEvent event;
    String msg = String.format("%s: %s", date.format(new Date()), message);
    if(stack != null) {
      msg = String.format("%s: %s. Stack trace : %s",date.format(new Date()),
                          message, stack);
    }
    event = new LogEvent(tag.getTag(), level.name(), msg);
    collector.log(event);
    return true;
  }
}
