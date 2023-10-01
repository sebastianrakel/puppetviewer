class PqlQueryFilterField {
  parent: PqlQueryFilter;
  value: any | null;
  filterString = '';
  operator: string;

  constructor(parent: PqlQueryFilter, operator: string) {
    this.parent = parent;
    this.operator = operator;
  }

  private getFieldValue(value: any): string {
    if (value instanceof String || typeof value == 'string') {
      return `'${value}'`
    }

    return value;
  }

  equal(fieldName: string, value: any): PqlQueryFilter {
    this.filterString = `${fieldName} = ${this.getFieldValue(value)}`;
    return this.parent;
  }

  regex(fieldName: string, value: string): PqlQueryFilter {
    this.filterString = `${fieldName} ~= ${this.getFieldValue(value)})`;
    return this.parent;
  }

  in(fieldName: string, subqueryBuilder: PqlQuery): PqlQueryFilter {
    this.filterString = `${fieldName} in ${subqueryBuilder.build()}`;
    return this.parent;
  }

  build() {
    return this.filterString;
  }

  done(): PqlQueryFilter {
    return this.parent;
  }
}

class PqlQueryFilter {
  private readonly parent: PqlQuery;
  private fields = [] as PqlQueryFilterField[];

  constructor(parent: PqlQuery) {
    this.parent = parent;
  }


  private addField(operator: string): PqlQueryFilterField {
    const field = new PqlQueryFilterField(this, operator);
    this.fields.push(field);
    return field;
  }

  and(): PqlQueryFilterField {
    return this.addField('and');
  }

  or(): PqlQueryFilterField {
    return this.addField('or');
  }

  build(): string {
    let query = '';

    this.fields.forEach((field) => {
      if (query.length > 0) {
        query = `${query} ${field.operator} `;
      }

      query = query + `${field.build()}`;
    })

    return query;
  }

  done(): PqlQuery {
    return this.parent;
  }
}

export enum PqlSortOrder {
  Ascending = 'asc',
  Descending = 'desc',
}

class PqlQueryGroup {
  private readonly parent: PqlQuery;
  private fields = [] as string[]

  constructor(parent: PqlQuery) {
    this.parent = parent;
  }

  add(field: string): PqlQueryGroup {
    this.fields.push(field);
    return this;
  }

  done() : PqlQuery {
    return this.parent;
  }

  build() : string {
    if (this.fields.length == 0) {
      return '';
    }

    const sortFields = this.fields.join(',')
    return ` group by ${sortFields}`
  }
}

interface PqlSortField {
  field: string;
  order: PqlSortOrder;
}

class PqlQuerySort {
  private readonly parent: PqlQuery;
  private fields = [] as PqlSortField[]

  constructor(parent: PqlQuery) {
    this.parent = parent;
  }

  add(field: string, order: PqlSortOrder): PqlQuerySort {
    this.fields.push({
      field: field,
      order: order,
    } as PqlSortField);

    return this;
  }

  done() : PqlQuery {
    return this.parent;
  }

  build() : string {
    if (this.fields.length == 0) {
      return '';
    }

    const sortFields = this.fields.map(field => `${field.field} ${field.order}` ).join(',')

    return ` order by ${sortFields}`
  }
}

export enum PqlEntity {
  Catalogs = 'catalogs',
  Edges = 'edges',
  Events = 'events',
  Inventory = 'inventory',
  Environments = 'environments',
  FactContents = 'fact_contents',
  FactPaths = 'fact_paths',
  FactSets = 'factsets',
  Facts = 'facts',
  Nodes = 'nodes',
  PackageInventory = 'package_inventory',
  Packages = 'packages',
  Reports = 'reports',
  Resources = 'resources',
}

export default class PqlQuery {
  private readonly entity: PqlEntity;
  private projectionFields = [] as string[];
  private filterBuilder = new PqlQueryFilter(this);
  private sortBuilder = new PqlQuerySort(this);
  private groupBuilder = new PqlQueryGroup(this);
  private limitValue = 0;
  private offsetValue = 0;

  constructor(entity: PqlEntity) {
    this.entity = entity;
  }

  filter(): PqlQueryFilter {
    return this.filterBuilder;
  }

  groupBy() : PqlQueryGroup {
    return this.groupBuilder;
  }

  sortBy() : PqlQuerySort {
    return this.sortBuilder;
  }

  addProjectionField(field: string): PqlQuery {
    this.projectionFields.push(field);
    return this;
  }

  offset(offset: number) : PqlQuery {
    this.offsetValue = offset;
    return this;
  }

  limit(limit: number) : PqlQuery {
    this.limitValue = limit;
    return this;
  }

  build(): string {
    let projection = '';

    if (this.projectionFields.length > 0) {
      projection = `[${this.projectionFields.join(',')}]`;
    }

    let limit = '';
    if (this.limitValue > 0) {
        limit = ` limit ${this.limitValue}`
    }

    let offset = '';
    if (this.offsetValue > 0) {
        offset = ` offset ${this.offsetValue}`
    }

    return `${this.entity} ${projection} { ${this.filterBuilder.build()}${this.groupBuilder.build()}${this.sortBuilder.build()}${limit}${offset}}`;
  }
}
