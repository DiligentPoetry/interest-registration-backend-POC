addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    if (request.method === 'OPTIONS') {
      // Respond to preflight request with CORS headers
      const headers = new Headers();
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
      headers.append('Access-Control-Allow-Headers', '*');
      headers.append('content-type', 'application/json;charset=UTF-8');
      return new Response(null, {
        status: 200,
        headers,
      });
    } else {
      const response = await handleRequestWithHeaders(request);
  
      // Add CORS and Content-Type headers to all responses
      const headers = new Headers(response.headers);
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
      headers.append('Access-Control-Allow-Headers', '*');
      headers.append('content-type', 'application/json;charset=UTF-8');
  
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }
  }
  
  async function handleRequestWithHeaders(request) {
    if (request.method === 'POST') {
      try {
        const data = await request.json();
        const firstname = data.firstname;
        const lastname = data.lastname;
        const email = data.email;
        const name = firstname + " " + lastname;
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const nameregex = /^[a-zA-Z]*$/;
  
        if (regex.test(email) && nameregex.test(firstname) && nameregex.test(lastname)) {
          // Check if the email already exists in the KV store
          const emailExists = await checkIfEmailExists(email);
          if (emailExists) {
            return new Response(JSON.stringify({ message: "Email already exists" }), { status: 409 });
          }
  
          await KVIR.put(email, name);
          return new Response(JSON.stringify({ message: "Data saved successfully" }), { status: 200 });
        } else {
          return new Response(JSON.stringify({ message: "Invalid data" }), { status: 400 });
        }
      } catch (err) {
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
      }
    }
    return new Response(JSON.stringify({ message: "Invalid request" }), { status: 400 });
  }
  
  async function checkIfEmailExists(email) {
    const value = await KVIR.get(email);
    return value !== null;
  }