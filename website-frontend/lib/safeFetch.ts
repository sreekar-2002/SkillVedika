export async function safeFetchJson(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  // Read as text so we can include invalid JSON / HTML in errors
  const text = await res.text();

  if (!res.ok) {
    const err: any = new Error(`Request failed with status ${res.status}`);
    err.status = res.status;
    err.statusText = res.statusText;
    err.body = text;
    throw err;
  }

  try {
    return JSON.parse(text === "" ? "null" : text);
  } catch (parseErr) {
    const err: any = new Error("Invalid JSON response");
    err.body = text;
    err.parseError = parseErr;
    throw err;
  }
}

export default safeFetchJson;
