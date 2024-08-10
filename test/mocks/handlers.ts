import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://example.com/user', () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json({
      id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
      firstName: 'John',
      lastName: 'Maverick',
    });
  }),

  http.get('https://example.com/error', () => {
    // ...and respond to them using this JSON response.
    return new HttpResponse(null, { status: 500 });
  }),

  http.all('https://example.com/headers', ({ request }) => {
    // @ts-ignore
    const headers = request.headers.entries();
    const body: Record<string, string> = {};

    for (const [key, value] of headers) {
      body[key] = value;
    }
    return HttpResponse.json(body);
  }),

  http.all('https://example.com/params/:parent/:id', ({ request, params }) => {
    return HttpResponse.json(params);
  }),
];
