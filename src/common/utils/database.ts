import { isEnv } from 'common/utils';
import { Column, ColumnOptions, ColumnType } from 'typeorm';

const postgresSqliteTypeMapping: { [key: string]: ColumnType } = {
  timestamp: 'datetime',
};

function resolveDbType(postgresType): ColumnType {
  if (isEnv('test') && postgresType in postgresSqliteTypeMapping) {
    return postgresSqliteTypeMapping[postgresType.toString()];
  }
  return postgresType;
}

export function DbAwareColumn(columnOptions: ColumnOptions) {
  if (columnOptions.type) {
    columnOptions.type = resolveDbType(columnOptions.type);
  }
  return Column(columnOptions);
}
