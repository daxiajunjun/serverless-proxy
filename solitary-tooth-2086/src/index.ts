async function readRequestBody(request) {
  const contentType = request.headers.get('content-type');
  if (contentType.includes('application/json')) {
    return JSON.stringify(await request.json());
  } else if (contentType.includes('application/text')) {
    return request.text();
  } else if (contentType.includes('text/html')) {
    return request.text();
  } else if (contentType.includes('form')) {
    const formData = await request.formData();
    const body = {};
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1];
    }
    return JSON.stringify(body);
  } else {
    return 'a file';
  }
}

const src_default = {
  async fetch(request, env) {
    return await handleRequest(request);
  },
};
async function handleRequest(request) {
  if (request.url?.includes('openai')) {
    if (request.method === 'POST') {
      const reqBody = await readRequestBody(request);
      return fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody), // body data type must match "Content-Type" header
      });
    }
  } else {
    return new Response('hello world');
  }
}
export { src_default as default };
