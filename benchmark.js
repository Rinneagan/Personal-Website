const { performance } = require('perf_hooks');

async function mockGetUserInfo(username) {
  return new Promise(resolve => setTimeout(() => resolve({ login: username }), 100)); // Mock network delay
}

const COLLABORATIVE_GITHUB_USERS = ['gaearon', 'sophiebits', 'dan_abramov', 'yyx990803', 'kentcdodds'];

async function sequential() {
  const start = performance.now();
  for (let i = 0; i < COLLABORATIVE_GITHUB_USERS.length; i++) {
    const username = COLLABORATIVE_GITHUB_USERS[i];
    await mockGetUserInfo(username);
    if (i < COLLABORATIVE_GITHUB_USERS.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
  return performance.now() - start;
}

async function parallel() {
  const start = performance.now();
  await Promise.all(COLLABORATIVE_GITHUB_USERS.map(username => mockGetUserInfo(username)));
  return performance.now() - start;
}

async function run() {
  console.log("Running sequential...");
  const seqTime = await sequential();
  console.log(`Sequential: ${seqTime.toFixed(2)}ms`);

  console.log("Running parallel...");
  const parTime = await parallel();
  console.log(`Parallel: ${parTime.toFixed(2)}ms`);
}

run();
