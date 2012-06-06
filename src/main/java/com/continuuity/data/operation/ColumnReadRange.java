package com.continuuity.data.operation;

import java.util.Map;

import com.continuuity.data.operation.type.ReadOperation;

public class ColumnReadRange implements ReadOperation<Map<byte[], byte[]>> {

  private final byte [] key;
  private final byte [] startColumn;
  private final byte [] stopColumn;
  private final int limit;

  private Map<byte[], byte[]> result;

  public ColumnReadRange(final byte [] key, final byte [] startColumn) {
    this(key, startColumn, null, -1);
  }

  public ColumnReadRange(final byte [] key, final byte [] startColumn,
      final byte [] stopColumn) {
    this(key, startColumn, stopColumn, -1);
  }

  public ColumnReadRange(final byte [] key, final byte [] startColumn,
      final byte [] stopColumn, int limit) {
    this.key = key;
    this.startColumn = startColumn;
    this.stopColumn = stopColumn;
    this.limit = limit;
  }

  public byte [] getKey() {
    return this.key;
  }

  public byte [] getStartColumn() {
    return this.startColumn;
  }

  public byte [] getStopColumn() {
    return this.stopColumn;
  }

  public int getLimit() {
    return this.limit;
  }

  @Override
  public Map<byte[], byte[]> getResult() {
    return this.result;
  }
  
  @Override
  public void setResult(Map<byte[], byte[]> result) {
    this.result = result;
  }

}
