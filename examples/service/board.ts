import fetcher, { AppResponse } from '../app';

interface Board {
  id: string;
  content: string;
  regDate: string;
}

const defaultValue: AppResponse<Board> = { jsonBody: { id: '', content: '', regDate: '' } };

const { events, onChange, provider, request: _get } = fetcher.create<AppResponse<Board>>('/board/:id', defaultValue, { method: 'get' });

events.on('response', (response: AppResponse<Board>) => {
  const { jsonBody } = response;
  // some times needs preprocessing
  jsonBody.content = decodeURIComponent(jsonBody.content);
  return Promise.resolve(response);
});

const { request } = fetcher.create('/board/:id', {}, {});

const get = (id: string) => {
  return _get({ params: { id } });
};

const post = (content: string) => {
  return request({ method: 'POST', body: JSON.stringify({ content }) });
};

const patch = ({ id, ...board }: Board) => {
  return request({ method: 'PATCH', params: { id }, body: JSON.stringify(board) });
};

const del = (id: string) => {
  return request({ method: 'PATCH', params: { id } });
};

export default {
  onChange,
  provider,
  get,
  post,
  patch,
  delete: del,
};
