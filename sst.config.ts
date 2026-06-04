/// <reference path="./.sst/platform/config.d.ts" />

// SST v3 (Ion) configuration.
//
//   sst dev      → runs the Astro site, the live Lambda, and (via the dev
//                  script) Storybook + the API docs together.
//   sst deploy   → provisions the API Gateway + Lambda and the static site.
//
// The API URL is linked into the site as PUBLIC_API_URL so the Preact islands
// call the deployed endpoint without any hard-coded values.
export default $config({
  app(input) {
    return {
      name: 'astro-api-first',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
    };
  },
  async run() {
    const api = new sst.aws.ApiGatewayV2('Api');
    api.route('GET /hello', {
      handler: 'src/api/hello.handler',
    });

    const web = new sst.aws.Astro('Web', {
      link: [api],
      environment: {
        PUBLIC_API_URL: api.url,
      },
    });

    return {
      api: api.url,
      web: web.url,
    };
  },
});
