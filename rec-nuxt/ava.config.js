export default {
  "files": [
    "test/**/*",
  ],
  "helpers": [
    "**/helpers/**/*"
  ],
  "sources": [
    "src/**/*"
  ],
  "cache": true,
  "concurrency": 5,
  "failFast": true,
  "failWithoutAssertions": false,
  "environmentVariables": {
    "MY_ENVIRONMENT_VARIABLE": "some value"
  },
  "tap": true,
  "verbose": true,
  "compileEnhancements": false,
  "babel": {
    "extensions": ["js", "jsx"],
    "testOptions": {
      "babelrc": false
    }
  }
};
