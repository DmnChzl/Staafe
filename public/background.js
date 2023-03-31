const browserInstance = chrome || ['browser'];

browserInstance.runtime.onMessage.addListener((request, _, sendResponse) => {
  const url = `https://staafe.dmnchzl.dev/api/autocomplete?provider=${request.provider}&query=${request.query}`;

  fetch(url, {
    method: 'GET',
    // mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      sendResponse({ url, status: 'fulfilled', value: data });
    })
    .catch(err => {
      sendResponse({ url, status: 'rejected', reason: err.message });
    });

  return true;
});
