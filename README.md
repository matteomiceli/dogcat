## Instructions and Running the server

```bash
# Install deps
npm i

# To run in dev mode with watch
npm run dev
```

To query the replacer endpoint, make a POST request to `/replace` with your JSON payload in the `input` field. Optionally, you can add a `maxReplacements` field to limit the number of replacements made to your input.

```jsonc
// Example POST body
{
    "input": ["dog", {"nested": {"object": "dog"}}],
    // Optional
    "maxReplacements": 1
}
```

## Assumptions

- Replace _exact_ matches of the string `"dog"` rather than substring matches or different case strings (ie. doggo or Dog).
- The JSON input we're getting from clients is not always valid so we have to validate it.
- In prod we would have a load balancer or some infrastructure to manage load/rate limiting.
- No auth required, this is meant to be a public endpoint.
- I'm the only developer working on this (and it's a small scope project) so no need for an advanced lint or formatting setup.
- We didn't want to accept _any_ size of JSON payload so I implemented a body limit of 50kb. 
- Assumed that a depth-first approach was acceptable.

## Trade-offs

- This approach uses a naive, custom schema validation that works for the simple schema (input and maxReplacements), but falls apart for more complex objects. As this project grows, we should bring in something like Zod or JSON Schema to validate the shape of the incoming JSON.
- This endpoint is unauthenticated and would be totally accessible to the outside internet if hosted somewhere. Consider implementing an application rate limiter or authentication system to prevent misuse.
- Because we have a body size limit, we prevent potential overload from massive JSON requests, but users needing replacement on documents larger than our accepted 50kb will not be able to use the service. We can always adjust this larger but at the risk of introducing more latency in our responses.
- Use of depth-first traversal combined with `maxReplacements` enforces an opinionated order for replacements.

## Future improvements

- Implement an application rate-limiter to limit malicious use (eg. denial-of-service attacks).
- We could also implement an authentication system and give out API keys which would allow us to limit use by key and user.
- Use an off-the-shelf schema validator like Zod for more robust schema validation.
- Add project-level linting and a code formatting if anyone else works on this repo.
- We could add support for additional options to make the existing implementation more configurable:
  - case-insensitive matching
  - use breadth-first traversal and replacement (this effects which fields get replaced if you have `maxReplacements` enabled)
