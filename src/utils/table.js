//  此版本使用，需要在data 里面设置以下初始变量
//  url: "/apis/assets/app/list/",
//  params: {}
//  pagination: {},
//  loading: false
export function table_fetch(params = {}, current = 0) {
    params = {...this.params, ...params}
    if (current > 0) {
        this.pagination.current = current
    }
    this.loading = true;
    this.$http({
        url: this.url,
        method: 'get',
        params: {
            size: 10,
            ...params,
        },
        type: 'json',
    }).then(data => {
        const pagination = {...this.pagination};
        pagination.total = data.data.count;
        this.loading = false;
        this.data = data.data.results;
        this.pagination = pagination;
    });
}

export function table_change(pagination, filters, sorter) {
    const pager = {...this.pagination};
    pager.current = pagination.current;
    this.pagination = pager;
    this.table_fetch({
        // results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
    });
}

export function table_search(value, dataIndex) {
    if (value) {
        this.params[dataIndex] = value
    } else {
        delete this.params[dataIndex]
    }
    this.table_fetch({}, 1)
}


//  此版本使用，需要在data 里面设置以下初始变量
//  table:{
//      pagination: {},
//      loading: false
//  }

export function table_fetch_v2(params = {url: '', params: {}, current: 0}) {
    if (params.url) {
        this.table.pagination = {}
        this.table.params = {}
        this.table = {...this.table, ...params}
    }
    if (params.current > 0) {
        this.table.pagination.current = params.current
    }
    this.table.params = {...this.table.params, ...params.params}
    this.table.loading = true;
    this.$http({
        url: this.table.url,
        method: 'get',
        params: {
            size: 10,
            ...this.table.params,
        },
        type: 'json',
    }).then(data => {
        const pagination = {...this.table.pagination};
        pagination.total = data.data.count;
        this.table.loading = false;
        this.data = data.data.results;
        this.table.pagination = pagination;
    }).catch(res => {
        console.log(res)
    }).finally(() => {
        this.table.loading = false;
    });
}

export function table_change_v2(pagination, filters, sorter) {
    const pager = {...this.table.pagination};
    pager.current = pagination.current;
    this.table.pagination = pager;
    this.table_fetch_v2({
        params: {
            // results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        }
    });
}

export function table_search_v2(value, dataIndex) {
    if (value === "" || value === undefined) {
        delete this.table.params[dataIndex]
    } else {
        this.table.params[dataIndex] = value
    }
    this.table_fetch_v2({current: 1})
}
