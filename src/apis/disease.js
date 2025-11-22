// apis/disease.js

import client from './client' // postCompare에서 쓰는 axios 인스턴스와 동일한 것 사용

// GET /search/diseases/?query=xxx
export const searchDiseases = (query) =>
  client.get('/search/diseases/', {
    params: { query },  // → /search/diseases/?query=비염
  })
