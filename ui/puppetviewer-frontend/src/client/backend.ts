import {AxiosPromise, AxiosResponse} from 'axios';
import {api} from 'boot/axios';
import {SavedQuery} from 'src/client/models';
import PqlQuery from 'src/puppet/query-builder';
import {EventCount} from 'src/puppet/models';

class Backend {
  getQueryResult<T>(query: PqlQuery) : AxiosPromise<T> {
    const payload = {
      query: query.build(),
    }

    return api.post('/pdb/query', payload);
  }

  getFactNames() : AxiosPromise<string[]> {
    return api.get('/pdb/fact-names');
  }

  getSavedQueries() : AxiosPromise<SavedQuery[]> {
    return api.get('/pv/query/saved');
  }

  getEventCounts() : AxiosPromise<EventCount[]> {
    const params = {
      summarize_by: 'certname',
      query: '["=", "latest_report?", true]',
    }
    return api.get('/pdb/event-counts', { params: params })
  }
}

export default new Backend()
